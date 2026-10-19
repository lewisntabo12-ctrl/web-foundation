-- 1. CREATE TABLE STATEMENTS

CREATE TABLE students (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_name TEXT NOT NULL
);

CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    -- Rule preventing the same student enrolling on the same course twice
    UNIQUE(student_id, course_id) 
);

-- 2. INSERT STATEMENTS (3+ students, 3+ courses, 5+ enrolments)

INSERT INTO students (name, email) VALUES
('Lewis Somoni', 'lewis@example.com'),
('Erii Cynthia', 'erii@example.com'),
('John Doe', 'john@example.com'),
('Jane Smith', 'jane@example.com'); -- Jane has no enrolments for query 4

INSERT INTO courses (course_name) VALUES
('Software Engineering'),
('Automotive Mechanics'),
('Telematics');

INSERT INTO enrolments (student_id, course_id, grade) VALUES
(1, 1, 'A'),
(1, 3, 'B'),
(2, 1, 'A'),
(2, 2, 'B+'),
(3, 2, 'C');


-- 3. THE FIVE REQUIRED QUERIES

-- Query 1: All courses for one student (by name)
SELECT courses.course_name
FROM courses
JOIN enrolments ON courses.course_id = enrolments.course_id
JOIN students ON enrolments.student_id = students.student_id
WHERE students.name = 'Lewis Somoni';

-- Query 2: All students on one course
SELECT students.name
FROM students
JOIN enrolments ON students.student_id = enrolments.student_id
JOIN courses ON enrolments.course_id = courses.course_id
WHERE courses.course_name = 'Software Engineering';

-- Query 3: The number of students per course
SELECT courses.course_name, COUNT(enrolments.student_id) AS student_count
FROM courses
LEFT JOIN enrolments ON courses.course_id = enrolments.course_id
GROUP BY courses.course_id;

-- Query 4: Students who have no enrolments
SELECT students.name
FROM students
LEFT JOIN enrolments ON students.student_id = enrolments.student_id
WHERE enrolments.enrolment_id IS NULL;

-- Query 5: An update of one enrolment's grade
UPDATE enrolments
SET grade = 'A+'
WHERE student_id = 1 AND course_id = 1;