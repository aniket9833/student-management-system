-- ============================================================
-- Student Management System — Database Schema
-- Normalized to 3NF | 3 tables: subjects, students, marks
-- ============================================================

DROP TABLE IF EXISTS marks    CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;

-- ============================================================
-- Table: subjects
-- Master list of subjects (kept separate to avoid repeating
-- subject names inside the marks table)
-- ============================================================
CREATE TABLE subjects (
  id        SERIAL       PRIMARY KEY,
  name      VARCHAR(100) NOT NULL UNIQUE,
  code      VARCHAR(20)  NOT NULL UNIQUE,
  max_marks INTEGER      NOT NULL DEFAULT 100
);

-- ============================================================
-- Table: students
-- Core student info and enrollment details
-- ============================================================
CREATE TABLE students (
  id            SERIAL       PRIMARY KEY,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  phone         VARCHAR(20),
  enrollment_no VARCHAR(50)  NOT NULL UNIQUE,
  department    VARCHAR(100),
  semester      SMALLINT     CHECK (semester BETWEEN 1 AND 10),
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Table: marks
-- Junction table — one row per student + subject + exam type
-- FK to students (cascade delete) and subjects (restrict delete)
-- ============================================================
CREATE TABLE marks (
  id             SERIAL       PRIMARY KEY,
  student_id     INTEGER      NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id     INTEGER      NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
  marks_obtained NUMERIC(6,2) NOT NULL CHECK (marks_obtained >= 0),
  exam_type      VARCHAR(50)  NOT NULL DEFAULT 'Final',
  exam_date      DATE,
  UNIQUE (student_id, subject_id, exam_type)
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_marks_student ON marks(student_id);
CREATE INDEX idx_marks_subject ON marks(subject_id);

-- ============================================================
-- Seed data
-- ============================================================
INSERT INTO subjects (name, code, max_marks) VALUES
  ('Mathematics',         'MATH101', 100),
  ('Physics',             'PHY101',  100),
  ('Computer Science',    'CS101',   100),
  ('Data Structures',     'CS201',   100),
  ('Database Management', 'CS301',   100);

INSERT INTO students (first_name, last_name, email, phone, enrollment_no, department, semester) VALUES
  ('Aarav',  'Sharma', 'aarav.sharma@college.edu',  '9876543210', 'ENR2021001', 'Computer Science', 6),
  ('Priya',  'Patel',  'priya.patel@college.edu',   '9876543211', 'ENR2021002', 'Computer Science', 6),
  ('Rohan',  'Mehta',  'rohan.mehta@college.edu',   '9876543212', 'ENR2021003', 'Physics',          4);

INSERT INTO marks (student_id, subject_id, marks_obtained, exam_type, exam_date) VALUES
  (1, 1, 88, 'Final', '2024-11-15'),
  (1, 3, 92, 'Final', '2024-11-18'),
  (2, 1, 76, 'Final', '2024-11-15'),
  (2, 4, 89, 'Final', '2024-11-20'),
  (3, 2, 81, 'Final', '2024-11-16');
