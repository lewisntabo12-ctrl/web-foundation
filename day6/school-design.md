# School Database Design

## Table Explanations and Relationships
* Students Table: Stores core information about the learners (ID, name, and a unique email).
* Courses Table: Stores the catalog of available classes (ID, course name).
* Enrolments Table (Join Table): Stores the grading data and connects students to their courses. 

Relationships:
The relationship between a single student and their enrolments is One-to-Many, and the relationship between a single course and its enrolments is also One-to-Many. However, the overall relationship between Students and Courses is Many-to-Many (a student can take many courses, and a course can have many students). A join table (enrolments) is strictly required because relational databases cannot natively map a Many-to-Many relationship without a middle table holding the foreign keys for both entities.

## Indexing
I would add an index to the email column in the students table (CREATE INDEX idx_student_email ON students(email);). Reason: Email addresses are frequently used for authentication and searching. An index prevents the database from performing a full table scan every time a student logs in or is queried by their email, significantly speeding up the lookup process.

## SQL vs NoSQL
For a school database system, I would absolutely choose SQL. Academic systems require strict data integrity, highly structured schemas, and ACID compliance to ensure that records like grades and enrolments are never orphaned, duplicated, or lost during transaction failures. The relationships are clearly defined and relational (students clearly map to courses), making the JOIN capabilities of a SQL database perfectly suited for academic reporting and data management.