import { useState, useEffect } from 'react';
import marksService from '../../services/marksService';
import { alertSuccess, alertError, alertConfirm } from '../../utils/alerts';

const EMPTY_MARK = {
  subject_id: '',
  marks_obtained: '',
  exam_date: '',
};

const MarksModal = ({ student, onClose }) => {
  const [marks, setMarks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_MARK);

  useEffect(() => {
    if (!student) return;
    Promise.all([
      marksService.getByStudent(student.id),
      marksService.getSubjects(),
    ])
      .then(([mRes, sRes]) => {
        setMarks(mRes.data.data);
        setSubjects(sRes.data.data);
      })
      .catch(() => alertError('Error', 'Could not load marks data'))
      .finally(() => setLoading(false));
  }, [student]);

  const handleChange = ({ target: { name, value } }) =>
    setForm((f) => ({ ...f, [name]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.subject_id || form.marks_obtained === '') {
      alertError('Validation', 'Subject and marks are required');
      return;
    }
    setSaving(true);
    try {
      const res = await marksService.upsert(student.id, {
        ...form,
        subject_id: Number(form.subject_id),
        marks_obtained: Number(form.marks_obtained),
      });
      const saved = res.data.data;
      const sub = subjects.find((s) => s.id === saved.subject_id);
      const enriched = {
        ...saved,
        subject_id: saved.subject_id,
        subject_name: sub?.name,
        max_marks: sub?.max_marks,
        percentage: sub?.max_marks
          ? ((saved.marks_obtained / sub.max_marks) * 100).toFixed(2)
          : null,
      };
      setMarks((prev) => {
        const idx = prev.findIndex((m) => m.id === saved.id);
        return idx >= 0
          ? prev.map((m) => (m.id === saved.id ? enriched : m))
          : [...prev, enriched];
      });
      setForm(EMPTY_MARK);
      alertSuccess('Saved!', 'Marks updated successfully');
    } catch (err) {
      alertError(
        'Error',
        err.response?.data?.message || 'Failed to save marks',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (markId) => {
    const { isConfirmed } = await alertConfirm('Delete this mark entry?');
    if (!isConfirmed) return;
    try {
      await marksService.delete(markId);
      setMarks((prev) => prev.filter((m) => m.id !== markId));
      alertSuccess('Deleted!', 'Mark entry removed');
    } catch {
      alertError('Error', 'Failed to delete mark');
    }
  };

  if (!student) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,.5)' }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content rounded-4">
          {/* Header */}
          <div className="modal-header bg-primary text-white rounded-top-4">
            <div>
              <h5 className="modal-title mb-0">
                <i className="bi bi-journal-text me-2" />
                Marks — {student.first_name} {student.last_name}
              </h5>
              <small className="opacity-75">
                {student.enrollment_no} · {student.department}
              </small>
            </div>
            <button className="btn-close btn-close-white" onClick={onClose} />
          </div>

          {/* Body */}
          <div className="modal-body">
            {loading ? (
              <div className="text-center py-4">
                <span className="spinner-border text-primary" />
              </div>
            ) : (
              <>
                {/* Add / Update form */}
                <div className="card border-0 bg-light rounded-3 mb-4">
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">
                      <i className="bi bi-plus-circle me-1 text-primary" />
                      Add / Update Mark
                    </h6>
                    <form onSubmit={handleSave}>
                      <div className="row g-2">
                        <div className="col-md-5">
                          <select
                            name="subject_id"
                            className="form-select"
                            value={form.subject_id}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Subject</option>
                            {subjects.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-2">
                          <input
                            type="number"
                            name="marks_obtained"
                            className="form-control"
                            placeholder="Marks"
                            min="0"
                            max="100"
                            step="0.01"
                            value={form.marks_obtained}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="col-md-3">
                          <div className="d-flex gap-2">
                            <input
                              type="date"
                              name="exam_date"
                              className="form-control"
                              value={form.exam_date}
                              onChange={handleChange}
                            />
                            <button
                              type="submit"
                              className="btn btn-primary px-3"
                              disabled={saving}
                            >
                              {saving ? (
                                <span className="spinner-border spinner-border-sm" />
                              ) : (
                                <i className="bi bi-check-lg" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Marks table */}
                {marks.length === 0 ? (
                  <div className="text-center text-muted py-3">
                    <i className="bi bi-inbox fs-2 d-block mb-2" />
                    No marks recorded yet.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Subject</th>
                          <th>Marks</th>
                          <th>Max</th>
                          <th>%</th>
                          <th>Date</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {marks.map((m) => (
                          <tr key={m.id}>
                            <td className="fw-semibold">{m.subject_name}</td>
                            <td className="fw-bold">{m.marks_obtained}</td>
                            <td className="text-muted">{m.max_marks || 100}</td>
                            <td>
                              <span
                                className={`badge ${
                                  parseFloat(m.percentage) >= 60
                                    ? 'bg-success'
                                    : 'bg-warning text-dark'
                                }`}
                              >
                                {m.percentage}%
                              </span>
                            </td>
                            <td className="text-muted small">
                              {m.exam_date
                                ? new Date(m.exam_date).toLocaleDateString()
                                : '—'}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(m.id)}
                              >
                                <i className="bi bi-trash" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarksModal;
