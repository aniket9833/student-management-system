import { useState } from 'react';

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  enrollment_no: '',
  department: '',
  semester: '',
};

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Mathematics',
  'Physics',
];

const TextField = ({
  label,
  name,
  type = 'text',
  required = false,
  form,
  errors,
  handleChange,
}) => (
  <div className="col-md-6 mb-3">
    <label className="form-label fw-semibold">
      {label} {required && <span className="text-danger">*</span>}
    </label>
    <input
      type={type}
      name={name}
      className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
      value={form[name]}
      onChange={handleChange}
    />
    {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
  </div>
);

const StudentForm = ({
  initial = null,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form, setForm] = useState(() =>
    initial
      ? {
          first_name: initial.first_name || '',
          last_name: initial.last_name || '',
          email: initial.email || '',
          phone: initial.phone || '',
          enrollment_no: initial.enrollment_no || '',
          department: initial.department || '',
          semester: initial.semester || '',
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState({});

  const handleChange = ({ target: { name, value } }) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = 'First name is required';
    if (!form.last_name.trim()) e.last_name = 'Last name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.enrollment_no.trim())
      e.enrollment_no = 'Enrollment No. is required';
    if (form.semester && (form.semester < 1 || form.semester > 10))
      e.semester = 'Semester must be between 1 and 10';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const payload = { ...form };
    if (!payload.phone) delete payload.phone;
    if (!payload.semester) delete payload.semester;
    else payload.semester = Number(payload.semester);
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row">
        <TextField
          label="First Name"
          name="first_name"
          required
          form={form}
          errors={errors}
          handleChange={handleChange}
        />
        <TextField
          label="Last Name"
          name="last_name"
          required
          form={form}
          errors={errors}
          handleChange={handleChange}
        />
        <TextField
          label="Email Address"
          name="email"
          type="email"
          required
          form={form}
          errors={errors}
          handleChange={handleChange}
        />
        <TextField
          label="Phone Number"
          name="phone"
          type="tel"
          form={form}
          errors={errors}
          handleChange={handleChange}
        />
        <TextField
          label="Enrollment No."
          name="enrollment_no"
          required
          form={form}
          errors={errors}
          handleChange={handleChange}
        />

        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">Department</label>
          <select
            name="department"
            className="form-select"
            value={form.department}
            onChange={handleChange}
          >
            <option value="">— Select Department —</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">Semester</label>
          <select
            name="semester"
            className={`form-select ${errors.semester ? 'is-invalid' : ''}`}
            value={form.semester}
            onChange={handleChange}
          >
            <option value="">— Select Semester —</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
          {errors.semester && (
            <div className="invalid-feedback">{errors.semester}</div>
          )}
        </div>
      </div>

      <div className="d-flex gap-2 justify-content-end mt-2">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          <i className="bi bi-x-lg me-1" />
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Saving…
            </>
          ) : (
            <>
              <i className="bi bi-check-lg me-1" />
              {initial ? 'Update Student' : 'Create Student'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
