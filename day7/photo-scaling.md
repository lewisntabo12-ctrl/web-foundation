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