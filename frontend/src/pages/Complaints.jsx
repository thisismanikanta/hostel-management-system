import React, { useState, useEffect } from 'react';
import { complaintApi, studentApi } from '../services/api';

const initialForm = {
  studentId: '',
  complaintType: 'Electrical',
  description: '',
  complaintDate: new Date().toISOString().split('T')[0],
  status: 'Pending',
};

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal & form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [compData, studentData] = await Promise.all([
        complaintApi.getAll(),
        studentApi.getAll(),
      ]);
      setComplaints(compData);
      setStudents(studentData);
      if (studentData.length > 0 && !formData.studentId) {
        setFormData((prev) => ({ ...prev, studentId: studentData[0].id }));
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    if (students.length === 0) {
      setError('Please register at least one student before logging a complaint.');
      return;
    }
    setFormData({
      ...initialForm,
      studentId: students[0]?.id || '',
    });
    setIsModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'studentId' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.studentId || !formData.description.trim()) {
      setError('Please fill in all complaint details.');
      return;
    }

    try {
      await complaintApi.create({
        studentId: Number(formData.studentId),
        complaintType: formData.complaintType,
        description: formData.description.trim(),
        complaintDate: formData.complaintDate,
        status: formData.status || 'Pending',
      });
      setSuccess('Complaint registered successfully.');
      handleCloseModal();
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to submit complaint.');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setError(null);
      await complaintApi.updateStatus(id, newStatus);
      setSuccess(`Complaint status updated to "${newStatus}".`);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to update complaint status.');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this complaint?');
    if (!confirmed) return;

    try {
      setError(null);
      await complaintApi.delete(id);
      setSuccess('Complaint deleted successfully.');
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to delete complaint.');
    }
  };

  const filteredComplaints = statusFilter === 'ALL'
    ? complaints
    : complaints.filter((c) => c.status.toLowerCase() === statusFilter.toLowerCase());

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'badge-success';
      case 'in progress':
        return 'badge-info';
      default:
        return 'badge-warning';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h2 className="section-title">Hostel Complaints & Maintenance</h2>
          <p className="section-description">Track student maintenance issues, repairs, and grievance resolutions</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          Add Complaint
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="filter-bar">
        <div className="filter-group">
          <label className="filter-label">Filter by Status:</label>
          <div className="button-group">
            {['ALL', 'Pending', 'In Progress', 'Resolved'].map((st) => (
              <button
                key={st}
                type="button"
                className={`btn btn-sm ${statusFilter === st ? 'btn-secondary active' : 'btn-outline'}`}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading complaints...</div>
      ) : filteredComplaints.length === 0 ? (
        <div className="empty-state">
          <h3>No Complaints Found</h3>
          <p>No complaints match the current filter. Click "Add Complaint" to log a maintenance ticket.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Category</th>
                <th>Description</th>
                <th>Date Logged</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((c) => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td className="font-semibold">{c.student?.name || 'N/A'}</td>
                  <td>
                    <span className="type-pill">{c.complaintType}</span>
                  </td>
                  <td className="desc-cell" title={c.description}>{c.description}</td>
                  <td>{c.complaintDate || 'N/A'}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="text-right table-actions">
                    {c.status !== 'In Progress' && c.status !== 'Resolved' && (
                      <button
                        type="button"
                        className="btn-link text-info"
                        onClick={() => handleStatusUpdate(c.id, 'In Progress')}
                      >
                        Set In Progress
                      </button>
                    )}
                    {c.status !== 'Resolved' && (
                      <button
                        type="button"
                        className="btn-link text-success"
                        onClick={() => handleStatusUpdate(c.id, 'Resolved')}
                      >
                        Mark as Resolved
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-link text-danger"
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form for Add Complaint */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">Register Maintenance Complaint</h3>
              <button type="button" className="modal-close" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Student *</label>
                  <select
                    name="studentId"
                    className="form-control"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Choose Student --</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.course} - {s.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Complaint Category *</label>
                    <select
                      name="complaintType"
                      className="form-control"
                      value={formData.complaintType}
                      onChange={handleChange}
                    >
                      <option value="Electrical">Electrical</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Carpentry">Carpentry</option>
                      <option value="Cleanliness">Cleanliness</option>
                      <option value="WiFi / Internet">WiFi / Internet</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Complaint Date *</label>
                    <input
                      type="date"
                      name="complaintDate"
                      className="form-control"
                      value={formData.complaintDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Issue Description *</label>
                  <textarea
                    name="description"
                    rows="3"
                    className="form-control"
                    placeholder="Describe the maintenance problem in detail..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Status</label>
                  <select
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Complaints;
