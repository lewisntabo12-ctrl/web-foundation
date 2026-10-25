# SnapShare Scaling Plan

## 1. Assumptions and Daily Active Users
* Total registered users: 10 million.
* Daily Active Users (DAU): 10% of registered users = 1,000,000 DAU.
* Uploads: 1 photo per day per active user.
* Feed views: 50 feed pages per day per active user.
* Photo size: 2 MB.
* Thumbnail size: 50 KB (0.05 MB).
* Total size per upload: 2.05 MB.
* Time: 86,400 seconds in a day; 365 days in a year.

## 2. Estimates
* **Uploads per second (Average):** 1,000,000 uploads / 86,400 seconds ≈ 12 uploads/second[cite: 31].
* **Uploads per second (Peak):** 12 * 5 = 60 uploads/second[cite: 31].
* **Feed views per second (Average):** (1,000,000 * 50 views) / 86,400 seconds ≈ 579 views/second[cite: 31].
* **Feed views per second (Peak):** 579 * 5 = 2,895 views/second[cite: 31].
* **Storage per year:** 1,000,000 uploads * 2.05 MB = 2.05 TB per day. 2.05 TB * 365 days = 748.25 TB per year.

## 3. System Load Profile
This system is highly **read-heavy**. There are roughly 50 times more feed views (579/sec) than photo uploads (12/sec). For the design, this means we must prioritize caching, Content Delivery Networks (CDNs), and database read-replicas to serve data quickly, rather than optimizing primarily for writing data.

## 4. Photo Storage Strategy
Photos should **not** be stored inside the database[cite: 31]. Databases are optimized for structured text data and indexing; storing massive 2MB binary large objects (BLOBs) inside a database consumes expensive RAM, drastically slows down queries, and makes backups unmanageable. Instead, photos should be stored in **Object Storage** (like Amazon S3), while the database only saves a lightweight text URL pointing to the file's location.

## 5. Architecture Diagram
```text
[User] <-----> [CDN]
                 |
          [Load Balancer]
                 |
        +--------+--------+
        |                 |
  [App Server 1] ... [App Server N]
        |                 |
    +---+---+---------+---+---+
    |       |         |       |
 [Cache] [DB Main] [Queue] [Object Storage]
            |         |           |
      [DB Replica] [Worker]-------+
## 6. Component Explanations
* **CDN (Content Delivery Network):** Caches and serves heavy static assets (photos, thumbnails) from edge locations physically close to users to reduce loading latency.
* **Load Balancer:** Distributes incoming traffic evenly across multiple application servers so no single server gets overwhelmed.
* **App Servers:** Handle the core business logic, API routing, user authentication, and feed generation.
* **Cache:** Stores frequently requested data (like popular user feeds) in rapid-access memory to prevent hammering the database.
* **Database (Main):** The primary data store that safely handles all write operations (saving metadata, likes, comments).
* **Database (Read Replica):** A synchronized copy of the main database dedicated entirely to serving the massive volume of read requests (feed views).
* **Object Storage:** Provides highly scalable, cost-effective storage for the actual heavy photo and thumbnail files.
* **Queue & Worker:** A message broker (queue) temporarily holds thumbnail generation tasks, and the worker executes them in the background so the user does not have to wait.

## 7. Upload Flow
1. The user uploads a 2MB photo from their client to the App Server.
2. The App Server saves the photo file to Object Storage.
3. The App Server saves the photo's metadata (URL, user ID, timestamp) to the Main Database.
4. The App Server pushes a "create thumbnail" job into the message broker (Queue) and immediately returns a synchronous "Success" response to the client.
5. The Worker picks up the job from the Queue asynchronously, generates the 50KB thumbnail in the background, saves it to Object Storage, and updates the Database.

## 8. Trade-offs
1. **Asynchronous Image Processing:** By using a message broker and background worker for thumbnails, we trade strict consistency for low latency. The user receives an immediate response, but the thumbnail might not be visible on their profile for a few seconds.
2. **Database Read Replicas (Eventual Consistency):** By splitting the database into a Main (write) and Replica (read), we trade strict consistency for high availability and throughput. The system scales effortlessly for heavy reads, but it introduces eventual consistency on follower feeds—meaning a user might upload a photo and their followers might not see it for a few milliseconds until the replica fully synchronizes with the main database.