import React, { useState, useEffect } from 'react';
import { hostelApi } from '../services/api';

const initialForm = {
  name: '',
  type: 'Boys',
  totalFloors: 3,
  address: '',
};

function Hostels() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal & form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hostelApi.getAll();
      setHostels(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch hostels.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleOpenEdit = (hostel) => {
    setEditingId(hostel.id);
    setFormData({
      name: hostel.name || '',
      type: hostel.type || 'Boys',
      totalFloors: hostel.totalFloors || 3,
      address: hostel.address || '',
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
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'totalFloors' ? parseInt(value, 10) || 1 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.address) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      if (editingId) {
        await hostelApi.update(editingId, formData);
        setSuccess('Hostel updated successfully.');
      } else {
        await hostelApi.create(formData);
        setSuccess('Hostel added successfully.');
      }
      handleCloseModal();
      fetchHostels();
    } catch (err) {
      setError(err.message || 'Operation failed.');
    }
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to delete hostel "${name}"?`);
    if (!confirmed) return;

    try {
      setError(null);
      await hostelApi.delete(id);
      setSuccess('Hostel deleted successfully.');
      fetchHostels();
    } catch (err) {
      setError(err.message || 'Failed to delete hostel. Ensure no rooms are linked to it.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h2 className="section-title">Hostels Directory</h2>
          <p className="section-description">Manage hostel buildings, block types, and floor capacities</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          Add Hostel
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading hostels...</div>
      ) : hostels.length === 0 ? (
        <div className="empty-state">
          <h3>No Hostels Registered</h3>
          <p>There are currently no hostels in the database. Click "Add Hostel" to register one.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hostel Name</th>
                <th>Hostel Type</th>
                <th>Total Floors</th>
                <th>Address</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hostels.map((hostel) => (
                <tr key={hostel.id}>
                  <td>#{hostel.id}</td>
                  <td className="font-semibold">{hostel.name}</td>
                  <td>
                    <span className="badge badge-info">{hostel.type}</span>
                  </td>
                  <td>{hostel.totalFloors} Floors</td>
                  <td className="truncate-text" title={hostel.address}>{hostel.address}</td>
                  <td className="text-right table-actions">
                    <button
                      type="button"
                      className="btn-link"
                      onClick={() => handleOpenEdit(hostel)}
                    >
                      Edit Hostel
                    </button>
                    <button
                      type="button"
                      className="btn-link text-danger"
                      onClick={() => handleDelete(hostel.id, hostel.name)}
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

      {/* Modal Form for Add/Edit Hostel */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">{editingId ? 'Edit Hostel' : 'Add New Hostel'}</h3>
              <button type="button" className="modal-close" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Hostel Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="e.g. APJ Abdul Kalam Hostel"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Hostel Type *</label>
                    <select
                      name="type"
                      className="form-control"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="Boys">Boys</option>
                      <option value="Girls">Girls</option>
                      <option value="Co-ed">Co-ed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Floors *</label>
                    <input
                      type="number"
                      name="totalFloors"
                      min="1"
                      max="20"
                      className="form-control"
                      value={formData.totalFloors}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Building / Campus Address *</label>
                  <textarea
                    name="address"
                    rows="2"
                    className="form-control"
                    placeholder="e.g. North Campus, Block B"
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
                  {editingId ? 'Save Changes' : 'Save Hostel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hostels;
