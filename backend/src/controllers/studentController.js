import * as StudentModel from '../models/studentModel.js';
import { paginate } from '../utils/pagination.js';
import { successRes, errorRes } from '../utils/response.js';

// GET /api/students?page=1&limit=10&search=&department=
export const getStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', department = '' } = req.query;
    const parsedPage = Math.max(1, parseInt(page, 10));
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10)));

    const { total, rows } = await StudentModel.findAll({
      page: parsedPage,
      limit: parsedLimit,
      search,
      department,
    });

    const meta = paginate(total, parsedPage, parsedLimit);
    return successRes(res, 200, 'Students fetched successfully', rows, meta);
  } catch (err) {
    return errorRes(res, 500, 'Failed to fetch students', err);
  }
};

// GET /api/students/:id
export const getStudentById = async (req, res) => {
  try {
    const student = await StudentModel.findById(req.params.id);
    if (!student) return errorRes(res, 404, 'Student not found');
    return successRes(res, 200, 'Student fetched successfully', student);
  } catch (err) {
    return errorRes(res, 500, 'Failed to fetch student', err);
  }
};

// POST /api/students
export const createStudent = async (req, res) => {
  try {
    const student = await StudentModel.create(req.body);
    return successRes(res, 201, 'Student created successfully', student);
  } catch (err) {
    if (err.code === '23505') {
      const field = err.constraint?.includes('email')
        ? 'Email'
        : 'Enrollment No';
      return errorRes(res, 409, `${field} already exists`);
    }
    return errorRes(res, 500, 'Failed to create student', err);
  }
};

// PUT /api/students/:id
export const updateStudent = async (req, res) => {
  try {
    const student = await StudentModel.update(req.params.id, req.body);
    if (!student) return errorRes(res, 404, 'Student not found');
    return successRes(res, 200, 'Student updated successfully', student);
  } catch (err) {
    if (err.code === '23505') {
      const field = err.constraint?.includes('email')
        ? 'Email'
        : 'Enrollment No';
      return errorRes(res, 409, `${field} already exists`);
    }
    return errorRes(res, 500, 'Failed to update student', err);
  }
};

// DELETE /api/students/:id
export const deleteStudent = async (req, res) => {
  try {
    const deleted = await StudentModel.softDelete(req.params.id);
    if (!deleted) return errorRes(res, 404, 'Student not found');
    return successRes(res, 200, 'Student deleted successfully', {
      id: deleted.id,
    });
  } catch (err) {
    return errorRes(res, 500, 'Failed to delete student', err);
  }
};
