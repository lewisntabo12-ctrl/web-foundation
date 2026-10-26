# TicketHub System Design

## 1. Requirements
* **Functional:** Users can browse upcoming events, view available seats, place a temporary hold on seats, pay securely, and view their purchased tickets.
* **Non-functional (Speed & Fairness):** The system must load quickly via caching, gracefully handle massive traffic spikes using waiting rooms (fairness), and strictly enforce data correctness so no seat is sold twice.

## 2. Traffic Estimates
* **Normal Traffic:** 
  * Reads: 50,000 visitors * 10 pages = 500,000 page views/day (~5.7 requests/second)[cite: 32].
  * Writes: 5,000 tickets sold/day (~0.05 writes/second)[cite: 32].
* **"Big Sale" Peak Traffic:** 
  * 200,000 users attempting to buy 20,000 seats in 10 minutes (600 seconds)[cite: 32].
  * Writes: 20,000 / 600 = ~33 successful writes/second, but with potentially tens of thousands of simultaneous collision attempts per second at minute zero[cite: 32]. 
* **Comparison:** Peak traffic writes are almost 700x higher than normal traffic, and peak traffic reads happen in a massive burst rather than distributed over 24 hours.

## 3. API Design
| Method | Path | Description |
|---|---|---|
| GET | `/events` | Browse a list of all upcoming concerts and events. |
| GET | `/events/:id/seats` | View the seating chart and availability for a specific event[cite: 33]. |
| POST | `/holds` | Place a temporary 5-minute lock on a specific seat[cite: 33]. |
| POST | `/orders` | Process payment for the held seat and finalize the order[cite: 33]. |
| GET | `/users/:id/tickets` | View purchased tickets for the authenticated user[cite: 33]. |

## 4. Data Model
* **`users` table:** `id` (PK), `name`, `email` (UNIQUE), `created_at`[cite: 33].
* **`events` table:** `id` (PK), `name`, `date`, `venue_name`[cite: 33].
* **`seats` table:** `id` (PK), `event_id` (FK), `seat_number`, `status` (ENUM: available, held, booked). *Relationship: One Event has Many Seats.*[cite: 33].
* **`orders` table:** `id` (PK), `user_id` (FK), `seat_id` (FK), `total_price`, `status`. *Relationship: One User has Many Orders; One Order has One Seat.*[cite: 33].

## 5. Preventing Double-Booking
To prevent two people from buying the same seat simultaneously, TicketHub uses **Database Transactions** combined with **Optimistic Locking** and strict constraints[cite: 33]. 
When User A clicks "Buy", the backend executes an atomic SQL update: `UPDATE seats SET status = 'held' WHERE id = 123 AND status = 'available'`. If User B's request arrives one millisecond later, the `status = 'available'` condition fails, and the database returns 0 rows updated. The API immediately tells User B the seat is no longer available. Furthermore, a `UNIQUE(event_id, seat_number)` constraint ensures no duplicate seats can ever be created in the database.

## 6. Architecture & Surviving the Big Sale
```text
           [DNS]
             |
          [Client]
             |
           [CDN]
             |
      [Virtual Waiting Room / Queue]
             |
       [Load Balancer]
             |
      +------+------+
      |             |
[App Server 1] [App Server 2]
      |             |
  +---+---+---------+---+
  |       |             |
[Cache] [Primary DB]  [Worker Queue]
          |             |
      [Read Replica] [Email Worker]

Virtual Waiting Room: To survive the "Big Sale," a virtual queue sits directly behind the CDN. When 200,000 users hit the site, the waiting room acts as a buffer, only letting users through to the App Servers at a rate the database can safely handle (e.g., 500 users at a time).

Cache (Redis): Serves the event list and seating chart to vastly reduce DB reads.

Primary DB & Replica: Primary handles the strict seat-locking writes, while the replica handles read queries.

## 7. Trade-offs

    Waiting Room (Fairness vs. Immediate Access): By throttling traffic through a queue, we trade immediate user access for absolute system stability. Users have to wait in line, but the servers do not crash[cite: 33].

    Relational DB strictly consistent vs. NoSQL extreme availability: By choosing a relational DB to strictly lock rows and prevent double-booking, we trade away the extreme write-speed of NoSQL. Consistency is prioritized over raw throughput[cite: 33].