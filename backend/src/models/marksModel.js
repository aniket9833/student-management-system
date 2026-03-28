import { query } from '../config/db.js';

export const findByStudent = async (studentId) => {
  const result = await query(
    `SELECT m.id, m.marks_obtained, m.exam_type, m.exam_date,
            sub.name AS subject_name, sub.code AS subject_code, sub.max_marks,
            ROUND((m.marks_obtained / sub.max_marks) * 100, 2) AS percentage
     FROM marks m
     JOIN subjects sub ON sub.id = m.subject_id
     WHERE m.student_id = $1
     ORDER BY sub.name`,
    [studentId],
  );
  return result.rows;
};

export const upsert = async ({
  student_id,
  subject_id,
  marks_obtained,
  exam_type,
  exam_date,
}) => {
  const result = await query(
    `INSERT INTO marks (student_id, subject_id, marks_obtained, exam_type, exam_date)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (student_id, subject_id, exam_type)
     DO UPDATE SET marks_obtained = EXCLUDED.marks_obtained,
                   exam_date      = EXCLUDED.exam_date
     RETURNING *`,
    [
      student_id,
      subject_id,
      marks_obtained,
      exam_type || 'Final',
      exam_date || null,
    ],
  );
  return result.rows[0];
};

export const remove = async (id) => {
  const result = await query(`DELETE FROM marks WHERE id = $1 RETURNING id`, [
    id,
  ]);
  return result.rows[0] || null;
};

export const findAllSubjects = async () => {
  const result = await query(`SELECT * FROM subjects ORDER BY name`);
  return result.rows;
};
