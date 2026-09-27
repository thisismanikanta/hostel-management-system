import React, { useState, useEffect } from 'react';
import { studentApi } from '../services/api';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  gender: 'Male',
  course: 'B.Tech CSE',
  year: '1st Year',
  address: '',
};

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.getAll();
      setStudents(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      if (!searchQuery.trim()) {
        const data = await studentApi.getAll();
        setStudents(data);
      } else {
        const data = await studentApi.search(searchQuery.trim());
        setStudents(data);
      }
    } catch (err) {
      setError('Search failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = async () => {
    setSearchQuery('');
    fetchStudents();
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleOpenEdit = (student) => {
    setEditingId(student.id);
    setFormData({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      gender: student.gender || 'Male',
      course: student.course || 'B.Tech CSE',
      year: student.year || '1st Year',
      address: student.address || '',
    });
    setIsModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      if (editingId) {
        await studentApi.update(editingId, formData);
        setSuccess('Student updated successfully.');
      } else {
        await studentApi.create(formData);
        setSuccess('Student added successfully.');
      }
      handleCloseModal();
      fetchStudents();
    } catch (err) {
      setError(err.message || 'Operation failed.');
    }
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to delete student "${name}"?`);
    if (!confirmed) return;

    try {
      setError(null);
      await studentApi.delete(id);
      setSuccess('Student deleted successfully.');
      fetchStudents();
    } catch (err) {
      setError(err.message || 'Failed to delete student.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h2 className="section-title">Students List</h2>
          <p className="section-description">Manage student registrations and profile details</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          Add Student
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="filter-bar">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            className="input-field"
            placeholder="Search by student name, email, or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
          {searchQuery && (
            <button type="button" className="btn btn-outline" onClick={handleClearSearch}>
              Clear
            </button>
          )}
        </form>
      </div>

      {loading ? (
        <div className="loading-state">Loading students...</div>
      ) : students.length === 0 ? (
        <div className="empty-state">
          <h3>No Students Found</h3>
          <p>There are no students matching your query. Click "Add Student" to register one.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Course</th>
                <th>Year</th>
                <th>Address</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>#{student.id}</td>
                  <td className="font-semibold">{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.gender}</td>
                  <td>{student.course}</td>
                  <td>{student.year}</td>
                  <td className="truncate-text" title={student.address}>{student.address}</td>
                  <td className="text-right table-actions">
                    <button
                      type="button"
                      className="btn-link"
                      onClick={() => handleOpenEdit(student)}
                    >
                      Edit Student
                    </button>
                    <button
                      type="button"
                      className="btn-link text-danger"
                      onClick={() => handleDelete(student.id, student.name)}
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

      {/* Modal Form for Add/Edit Student */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">{editingId ? 'Edit Student' : 'Add New Student'}</h3>
              <button type="button" className="modal-close" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="e.g. ramesh@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Gender *</label>
                    <select
                      name="gender"
                      className="form-control"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Course *</label>
                    <input
                      type="text"
                      name="course"
                      className="form-control"
                      placeholder="e.g. B.Tech CSE"
                      value={formData.course}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year *</label>
                    <select
                      name="year"
                      className="form-control"
                      value={formData.year}
                      onChange={handleChange}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Permanent Address *</label>
                  <textarea
                    name="address"
                    rows="2"
                    className="form-control"
                    placeholder="Enter full address..."
                    value={formData.address}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Save Changes' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
