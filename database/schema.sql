-- ============================================================
-- Student Management System — Database Schema
-- Normalized to 3NF | 3 tables: subjects, students, marks
-- ============================================================

DROP TABLE IF EXISTS marks    CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;

-- ============================================================
-- Table: subjects
-- Master list of subjects linked to department and semester
-- Each subject is tied to a specific department and semester
-- ============================================================
CREATE TABLE subjects (
  id        SERIAL        PRIMARY KEY,
  name      VARCHAR(100)  NOT NULL,
  department VARCHAR(100) NOT NULL,
  semester  SMALLINT      NOT NULL CHECK (semester BETWEEN 1 AND 10),
  max_marks INTEGER       NOT NULL DEFAULT 100,
  UNIQUE (name, department, semester)
);

-- ============================================================
-- Table: students
-- Core student info and enrollment details
-- ============================================================
CREATE TABLE students (
  id            SERIAL       PRIMARY KEY,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  phone         VARCHAR(20),
  enrollment_no VARCHAR(50)  NOT NULL,
  department    VARCHAR(100),
  semester      SMALLINT     CHECK (semester BETWEEN 1 AND 10),
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Table: marks
-- Junction table — one row per student + subject
-- FK to students (cascade delete) and subjects (restrict delete)
-- ============================================================
CREATE TABLE marks (
  id             SERIAL       PRIMARY KEY,
  student_id     INTEGER      NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id     INTEGER      NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
  marks_obtained NUMERIC(6,2) NOT NULL CHECK (marks_obtained >= 0),
  exam_date      DATE,
  UNIQUE (student_id, subject_id)
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_marks_student ON marks(student_id);
CREATE INDEX idx_marks_subject ON marks(subject_id);

-- Partial unique indexes for soft-deleted records
-- Only enforce uniqueness on active students
CREATE UNIQUE INDEX idx_students_email_active ON students(email) WHERE is_active = TRUE;
CREATE UNIQUE INDEX idx_students_enrollment_no_active ON students(enrollment_no) WHERE is_active = TRUE;

-- ============================================================
-- Seed data
-- Subjects are linked to specific departments and semesters
-- ============================================================

-- COMPUTER SCIENCE - All 8 Semesters
INSERT INTO subjects (name, department, semester, max_marks) VALUES
  ('Programming Fundamentals', 'Computer Science', 1, 100),
  ('Mathematics I', 'Computer Science', 1, 100),
  ('Digital Logic', 'Computer Science', 1, 100),
  ('Data Structures', 'Computer Science', 2, 100),
  ('Database Systems', 'Computer Science', 2, 100),
  ('Web Technologies', 'Computer Science', 2, 100),
  ('Operating Systems', 'Computer Science', 3, 100),
  ('Software Engineering', 'Computer Science', 3, 100),
  ('Computer Networks', 'Computer Science', 3, 100),
  ('Algorithms', 'Computer Science', 4, 100),
  ('Compiler Design', 'Computer Science', 4, 100),
  ('Database Design', 'Computer Science', 4, 100),
  ('Machine Learning', 'Computer Science', 5, 100),
  ('Artificial Intelligence', 'Computer Science', 5, 100),
  ('Cloud Computing', 'Computer Science', 5, 100),
  ('Cybersecurity', 'Computer Science', 6, 100),
  ('Big Data Analytics', 'Computer Science', 6, 100),
  ('Mobile Development', 'Computer Science', 6, 100),
  ('Distributed Systems', 'Computer Science', 7, 100),
  ('Computer Vision', 'Computer Science', 7, 100),
  ('IoT Applications', 'Computer Science', 7, 100),
  ('Project Management', 'Computer Science', 8, 100),
  ('Blockchain Technology', 'Computer Science', 8, 100),
  ('Advanced Databases', 'Computer Science', 8, 100);

-- INFORMATION TECHNOLOGY - All 8 Semesters
INSERT INTO subjects (name, department, semester, max_marks) VALUES
  ('IT Fundamentals', 'Information Technology', 1, 100),
  ('Computer Architecture', 'Information Technology', 1, 100),
  ('Programming in Python', 'Information Technology', 1, 100),
  ('Web Development Basics', 'Information Technology', 2, 100),
  ('Database Administration', 'Information Technology', 2, 100),
  ('Networking Basics', 'Information Technology', 2, 100),
  ('System Administration', 'Information Technology', 3, 100),
  ('Software Testing', 'Information Technology', 3, 100),
  ('IT Security', 'Information Technology', 3, 100),
  ('Enterprise Applications', 'Information Technology', 4, 100),
  ('Network Administration', 'Information Technology', 4, 100),
  ('Business Analysis', 'Information Technology', 4, 100),
  ('Cloud Services', 'Information Technology', 5, 100),
  ('DevOps', 'Information Technology', 5, 100),
  ('IT Compliance', 'Information Technology', 5, 100),
  ('Virtualization', 'Information Technology', 6, 100),
  ('Data Center Management', 'Information Technology', 6, 100),
  ('Disaster Recovery', 'Information Technology', 6, 100),
  ('IT Service Management', 'Information Technology', 7, 100),
  ('Infrastructure as Code', 'Information Technology', 7, 100),
  ('Network Security', 'Information Technology', 7, 100),
  ('IT Audit', 'Information Technology', 8, 100),
  ('Emerging Technologies', 'Information Technology', 8, 100),
  ('Strategic IT Planning', 'Information Technology', 8, 100);

-- ELECTRONICS - All 8 Semesters
INSERT INTO subjects (name, department, semester, max_marks) VALUES
  ('Basic Electronics', 'Electronics', 1, 100),
  ('Circuit Analysis', 'Electronics', 1, 100),
  ('DC Circuits', 'Electronics', 1, 100),
  ('AC Circuits', 'Electronics', 2, 100),
  ('Electronic Devices', 'Electronics', 2, 100),
  ('Analog Circuits', 'Electronics', 2, 100),
  ('Digital Circuits', 'Electronics', 3, 100),
  ('Microprocessors', 'Electronics', 3, 100),
  ('Signal Processing', 'Electronics', 3, 100),
  ('Communication Systems', 'Electronics', 4, 100),
  ('Power Electronics', 'Electronics', 4, 100),
  ('Control Systems', 'Electronics', 4, 100),
  ('Embedded Systems', 'Electronics', 5, 100),
  ('VLSI Design', 'Electronics', 5, 100),
  ('RF Engineering', 'Electronics', 5, 100),
  ('Microcontrollers', 'Electronics', 6, 100),
  ('IoT Hardware', 'Electronics', 6, 100),
  ('Sensor Technology', 'Electronics', 6, 100),
  ('Advanced Embedded Systems', 'Electronics', 7, 100),
  ('FPGA Design', 'Electronics', 7, 100),
  ('Wireless Communications', 'Electronics', 7, 100),
  ('Robotics', 'Electronics', 8, 100),
  ('Instrumentation', 'Electronics', 8, 100),
  ('Advanced Control Systems', 'Electronics', 8, 100);

INSERT INTO students (first_name, last_name, email, phone, enrollment_no, department, semester) VALUES
  ('Aarav',  'Sharma', 'aarav.sharma@college.edu',  '9876543210', 'ENR2021001', 'Computer Science', 6),
  ('Priya',  'Patel',  'priya.patel@college.edu',   '9876543211', 'ENR2021002', 'Information Technology', 6),
  ('Rohan',  'Mehta',  'rohan.mehta@college.edu',   '9876543212', 'ENR2021003', 'Electronics', 5);

INSERT INTO marks (student_id, subject_id, marks_obtained, exam_date) VALUES
  (1, 16, 88, '2024-11-15'),
  (1, 18, 92, '2024-11-18'),
  (2, 34, 76, '2024-11-15'),
  (2, 36, 89, '2024-11-20'),
  (3, 50, 81, '2024-11-16');
