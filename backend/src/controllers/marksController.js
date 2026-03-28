import * as MarksModel from '../models/marksModel.js';
import { successRes, errorRes } from '../utils/response.js';

// GET /api/students/:id/marks
export const getMarksByStudent = async (req, res) => {
  try {
    const marks = await MarksModel.findByStudent(req.params.id);
    return successRes(res, 200, 'Marks fetched successfully', marks);
  } catch (err) {
    return errorRes(res, 500, 'Failed to fetch marks', err);
  }
};

// POST /api/students/:id/marks
export const upsertMark = async (req, res) => {
  try {
    const mark = await MarksModel.upsert({
      student_id: req.params.id,
      ...req.body,
    });
    return successRes(res, 201, 'Mark saved successfully', mark);
  } catch (err) {
    if (err.code === '23503')
      return errorRes(res, 404, 'Student or Subject not found');
    if (err.code === '23514')
      return errorRes(res, 400, 'marks_obtained must be >= 0');
    return errorRes(res, 500, 'Failed to save mark', err);
  }
};

// DELETE /api/marks/:id
export const deleteMark = async (req, res) => {
  try {
    const deleted = await MarksModel.remove(req.params.id);
    if (!deleted) return errorRes(res, 404, 'Mark not found');
    return successRes(res, 200, 'Mark deleted successfully', {
      id: deleted.id,
    });
  } catch (err) {
    return errorRes(res, 500, 'Failed to delete mark', err);
  }
};

// GET /api/subjects
export const getSubjects = async (req, res) => {
  try {
    const subjects = await MarksModel.findAllSubjects();
    return successRes(res, 200, 'Subjects fetched successfully', subjects);
  } catch (err) {
    return errorRes(res, 500, 'Failed to fetch subjects', err);
  }
};
