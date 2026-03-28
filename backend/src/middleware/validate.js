import { body, param, validationResult } from 'express-validator';

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

export const validateIdParam = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  handleValidation,
];

export const validateStudent = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 100 }),
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 100 }),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('enrollment_no')
    .trim()
    .notEmpty()
    .withMessage('Enrollment number is required'),
  body('phone').optional().trim(),
  body('semester')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Semester must be 1–10'),
  handleValidation,
];

export const validateUpdateStudent = [
  body('first_name').optional().trim().notEmpty().isLength({ max: 100 }),
  body('last_name').optional().trim().notEmpty().isLength({ max: 100 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().trim(),
  body('semester')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Semester must be 1–10'),
  handleValidation,
];

export const validateMark = [
  body('subject_id').isInt({ min: 1 }).withMessage('Subject ID is required'),
  body('marks_obtained').isFloat({ min: 0 }).withMessage('Marks must be >= 0'),
  body('exam_date').optional().isDate().withMessage('Invalid exam date'),
  handleValidation,
];
