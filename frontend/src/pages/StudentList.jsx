import { useState, useEffect, useCallback } from 'react';
import studentService from '../services/studentService';
import { alertSuccess, alertError, alertConfirm } from '../utils/alerts';
import StudentForm from '../components/forms/StudentForm';
import MarksModal from '../components/modals/MarksModal';
import Pagination from '../components/ui/Pagination';

const LIMIT_OPTIONS = [5, 10, 20, 50];
const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics',
];

const StudentList = () => {
  //  Data state
  const [students, setStudents] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Filter / pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [department, setDepartment] = useState('');

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState(null); // null → create mode
  const [marksStudent, setMarksStudent] = useState(null);

  // Fetch
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await studentService.getAll({
        page,
        limit,
        search,
        department,
      });
      setStudents(res.data.data);
      setMeta(res.data.meta);
    } catch {
      alertError('Error', 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, department]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  //  Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  const openCreate = () => {
    setEditStudent(null);
    setShowForm(true);
  };
  const openEdit = (s) => {
    setEditStudent(s);
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditStudent(null);
  };

  const handleFormSubmit = async (data) => {
    setSaving(true);
    try {
      if (editStudent) {
        await studentService.update(editStudent.id, data);
        alertSuccess('Updated!', 'Student record has been updated.');
      } else {
        await studentService.create(data);
        alertSuccess('Created!', 'New student has been added.');
      }
      closeForm();
      fetchStudents();
    } catch (err) {
      alertError('Error', err.response?.data?.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (student) => {
    const { isConfirmed } = await alertConfirm(
      `Delete ${student.first_name} ${student.last_name}?`,
      'All associated marks will also be removed.',
    );
    if (!isConfirmed) return;
    try {
      await studentService.delete(student.id);
      alertSuccess('Deleted!', 'Student has been removed.');
      if (students.length === 1 && page > 1) setPage((p) => p - 1);
      else fetchStudents();
    } catch (err) {
      alertError(
        'Error',
        err.response?.data?.message || 'Failed to delete student.',
      );
    }
  };

  return (
    <div className="container-fluid py-4 px-4">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-0 text-primary">
            <i className="bi bi-mortarboard-fill me-2" />
            Student Management
          </h2>
          <p className="text-muted mb-0 small">
            Manage student records and academic marks
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <i className="bi bi-person-plus-fill me-2" />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body py-3">
          <div className="row g-2 align-items-end">
            <div className="col-md-5">
              <form onSubmit={handleSearch} className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search by name, email or enrollment…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                {searchInput && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={clearSearch}
                  >
                    <i className="bi bi-x" />
                  </button>
                )}
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
              </form>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                {LIMIT_OPTIONS.map((l) => (
                  <option key={l} value={l}>
                    {l} per page
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2 text-end">
              {meta && (
                <span className="text-muted small">
                  <strong>{meta.total}</strong> student
                  {meta.total !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary"
                style={{ width: '2.5rem', height: '2.5rem' }}
              />
              <p className="mt-3 text-muted">Loading students…</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-person-x fs-1 text-muted d-block mb-2" />
              <p className="text-muted">No students found.</p>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={openCreate}
              >
                Add First Student
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4">#</th>
                    <th>Student</th>
                    <th>Enrollment No.</th>
                    <th>Department</th>
                    <th>Semester</th>
                    <th>Avg. Marks</th>
                    <th>Subjects</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, idx) => (
                    <tr key={s.id}>
                      <td className="ps-4 text-muted small">
                        {(page - 1) * limit + idx + 1}
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                            style={{
                              width: 38,
                              height: 38,
                              flexShrink: 0,
                              fontSize: 14,
                              background: `hsl(${(s.id * 47) % 360}, 55%, 50%)`,
                            }}
                          >
                            {s.first_name[0]}
                            {s.last_name[0]}
                          </div>
                          <div>
                            <div className="fw-semibold">
                              {s.first_name} {s.last_name}
                            </div>
                            <div className="text-muted small">{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {s.enrollment_no}
                        </span>
                      </td>
                      <td>
                        {s.department || <span className="text-muted">—</span>}
                      </td>
                      <td>
                        {s.semester ? (
                          `Sem ${s.semester}`
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        {s.total_subjects > 0 ? (
                          <span
                            className={`badge ${parseFloat(s.average_marks) >= 60 ? 'bg-success' : 'bg-warning text-dark'}`}
                          >
                            {parseFloat(s.average_marks).toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-primary rounded-pill">
                          {s.total_subjects}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-info"
                            title="View Marks"
                            onClick={() => setMarksStudent(s)}
                          >
                            <i className="bi bi-journal-text" />
                          </button>
                          <button
                            className="btn btn-outline-primary"
                            title="Edit"
                            onClick={() => openEdit(s)}
                          >
                            <i className="bi bi-pencil" />
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            title="Delete"
                            onClick={() => handleDelete(s)}
                          >
                            <i className="bi bi-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination footer */}
        {meta && meta.totalPages > 1 && (
          <div className="card-footer bg-white border-0 py-3">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
              <small className="text-muted">
                Showing {(page - 1) * limit + 1}–
                {Math.min(page * limit, meta.total)} of {meta.total} students
              </small>
              <Pagination meta={meta} onPageChange={setPage} />
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,.5)' }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content rounded-4">
              <div
                className={`modal-header ${editStudent ? 'bg-warning' : 'bg-primary text-white'} rounded-top-4`}
              >
                <h5 className="modal-title">
                  <i
                    className={`bi ${editStudent ? 'bi-pencil-square' : 'bi-person-plus-fill'} me-2`}
                  />
                  {editStudent ? 'Edit Student' : 'Add New Student'}
                </h5>
                <button
                  className={`btn-close ${!editStudent ? 'btn-close-white' : ''}`}
                  onClick={closeForm}
                />
              </div>
              <div className="modal-body">
                <StudentForm
                  initial={editStudent}
                  onSubmit={handleFormSubmit}
                  onCancel={closeForm}
                  loading={saving}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Marks Modal */}
      {marksStudent && (
        <MarksModal
          student={marksStudent}
          onClose={() => {
            setMarksStudent(null);
            fetchStudents();
          }}
        />
      )}
    </div>
  );
};

export default StudentList;
