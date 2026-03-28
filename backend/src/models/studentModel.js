import { query } from '../config/db.js';

//READ
export const findAll = async ({
  page = 1,
  limit = 10,
  search = '',
  department = '',
}) => {
  const offset = (page - 1) * limit;
  const params = [];
  const conditions = ['s.is_active = TRUE'];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(
      `(s.first_name ILIKE $${params.length} OR s.last_name ILIKE $${params.length} OR s.email ILIKE $${params.length} OR s.enrollment_no ILIKE $${params.length})`,
    );
  }

  if (department) {
    params.push(department);
    conditions.push(`s.department = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await query(
    `SELECT COUNT(*) FROM students s ${where}`,
    params,
  );
  const total = parseInt(countResult.rows[0].count, 10);

  params.push(limit, offset);
  const dataResult = await query(
    `SELECT
       s.id, s.first_name, s.last_name, s.email, s.phone,
       s.enrollment_no, s.department, s.semester, s.created_at,
       COUNT(m.id)::INT                                   AS total_subjects,
       COALESCE(AVG(m.marks_obtained), 0)::NUMERIC(6,2)  AS average_marks
     FROM students s
     LEFT JOIN marks m ON m.student_id = s.id
     ${where}
     GROUP BY s.id
     ORDER BY s.created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );

  return { total, rows: dataResult.rows };
};

export const findById = async (id) => {
  const studentResult = await query(
    `SELECT * FROM students WHERE id = $1 AND is_active = TRUE`,
    [id],
  );
  if (!studentResult.rows.length) return null;

  const marksResult = await query(
    `SELECT
       m.id, m.marks_obtained, m.exam_type, m.exam_date,
       sub.id AS subject_id, sub.name AS subject_name, sub.code AS subject_code,
       sub.max_marks,
       ROUND((m.marks_obtained / sub.max_marks) * 100, 2) AS percentage
     FROM marks m
     JOIN subjects sub ON sub.id = m.subject_id
     WHERE m.student_id = $1
     ORDER BY sub.name`,
    [id],
  );

  return { ...studentResult.rows[0], marks: marksResult.rows };
};

//CREATE

export const create = async ({
  first_name,
  last_name,
  email,
  phone,
  enrollment_no,
  department,
  semester,
}) => {
  const result = await query(
    `INSERT INTO students (first_name, last_name, email, phone, enrollment_no, department, semester)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [first_name, last_name, email, phone, enrollment_no, department, semester],
  );
  return result.rows[0];
};

// UPDATE

export const update = async (id, fields) => {
  const allowed = [
    'first_name',
    'last_name',
    'email',
    'phone',
    'enrollment_no',
    'department',
    'semester',
  ];
  const updates = [];
  const values = [];

  allowed.forEach((key) => {
    if (fields[key] !== undefined) {
      values.push(fields[key]);
      updates.push(`${key} = $${values.length}`);
    }
  });

  if (!updates.length) return null;

  values.push(id);
  const result = await query(
    `UPDATE students SET ${updates.join(', ')} WHERE id = $${values.length} AND is_active = TRUE RETURNING *`,
    values,
  );
  return result.rows[0] || null;
};

// DELETE (soft)

export const softDelete = async (id) => {
  const result = await query(
    `UPDATE students SET is_active = FALSE WHERE id = $1 AND is_active = TRUE RETURNING id`,
    [id],
  );
  return result.rows[0] || null;
};
