import React, { useState, useEffect } from 'react';
import { roomApi, hostelApi } from '../services/api';

const initialForm = {
  roomNumber: '',
  hostelId: '',
  floor: 1,
  roomType: 'Double',
  capacity: 2,
  occupiedBeds: 0,
  status: 'Available',
};

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal & form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [roomsData, hostelsData] = await Promise.all([
        roomApi.getAll(),
        hostelApi.getAll(),
      ]);
      setRooms(roomsData);
      setHostels(hostelsData);
      if (hostelsData.length > 0 && !formData.hostelId) {
        setFormData((prev) => ({ ...prev, hostelId: hostelsData[0].id }));
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch room records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    if (hostels.length === 0) {
      setError('Please add at least one hostel before adding rooms.');
      return;
    }
    setEditingId(null);
    setFormData({
      ...initialForm,
      hostelId: hostels[0]?.id || '',
    });
    setIsModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleOpenEdit = (room) => {
    setEditingId(room.id);
    setFormData({
      roomNumber: room.roomNumber || '',
      hostelId: room.hostel?.id || '',
      floor: room.floor || 1,
      roomType: room.roomType || 'Double',
      capacity: room.capacity || 2,
      occupiedBeds: room.occupiedBeds || 0,
      status: room.status || 'Available',
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
    if (name === 'capacity') {
      const cap = parseInt(value, 10) || 1;
      setFormData((prev) => ({
        ...prev,
        capacity: cap,
        status: prev.occupiedBeds >= cap ? 'Full' : 'Available',
      }));
    } else if (name === 'occupiedBeds') {
      const occ = parseInt(value, 10) || 0;
      setFormData((prev) => ({
        ...prev,
        occupiedBeds: occ,
        status: occ >= prev.capacity ? 'Full' : 'Available',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'floor' || name === 'hostelId' ? parseInt(value, 10) || value : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.roomNumber || !formData.hostelId || !formData.capacity) {
      setError('Please fill in all required room details.');
      return;
    }

    try {
      const payload = {
        ...formData,
        hostelId: Number(formData.hostelId),
        capacity: Number(formData.capacity),
        occupiedBeds: Number(formData.occupiedBeds || 0),
        floor: Number(formData.floor),
      };

      if (editingId) {
        await roomApi.update(editingId, payload);
        setSuccess('Room updated successfully.');
      } else {
        await roomApi.create(payload);
        setSuccess('Room created successfully.');
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      setError(err.message || 'Operation failed.');
    }
  };

  const handleDelete = async (id, roomNumber) => {
    const confirmed = window.confirm(`Are you sure you want to delete room "${roomNumber}"?`);
    if (!confirmed) return;

    try {
      setError(null);
      await roomApi.delete(id);
      setSuccess('Room deleted successfully.');
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to delete room. Ensure no active allocations are attached.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h2 className="section-title">Rooms Management</h2>
          <p className="section-description">Manage room numbering, capacity, and bed availability per hostel</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          Add Room
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading rooms...</div>
      ) : rooms.length === 0 ? (
        <div className="empty-state">
          <h3>No Rooms Found</h3>
          <p>No rooms have been configured yet. Click "Add Room" to create one.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Room ID</th>
                <th>Room Number</th>
                <th>Hostel Building</th>
                <th>Floor</th>
                <th>Room Type</th>
                <th>Capacity</th>
                <th>Occupied Beds</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => {
                const isFull = room.occupiedBeds >= room.capacity || room.status === 'Full';
                return (
                  <tr key={room.id}>
                    <td>#{room.id}</td>
                    <td className="font-semibold">{room.roomNumber}</td>
                    <td>{room.hostel?.name || 'N/A'}</td>
                    <td>Floor {room.floor}</td>
                    <td>{room.roomType}</td>
                    <td>{room.capacity} Beds</td>
                    <td>
                      {room.occupiedBeds} / {room.capacity}
                    </td>
                    <td>
                      <span className={`badge ${isFull ? 'badge-danger' : 'badge-success'}`}>
                        {isFull ? 'Full' : 'Available'}
                      </span>
                    </td>
                    <td className="text-right table-actions">
                      <button
                        type="button"
                        className="btn-link"
                        onClick={() => handleOpenEdit(room)}
                      >
                        Edit Room
                      </button>
                      <button
                        type="button"
                        className="btn-link text-danger"
                        onClick={() => handleDelete(room.id, room.roomNumber)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form for Add/Edit Room */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">{editingId ? 'Edit Room' : 'Add New Room'}</h3>
              <button type="button" className="modal-close" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Hostel Building *</label>
                    <select
                      name="hostelId"
                      className="form-control"
                      value={formData.hostelId}
                      onChange={handleChange}
                      required
                    >
                      {hostels.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name} ({h.type})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Room Number *</label>
                    <input
                      type="text"
                      name="roomNumber"
                      className="form-control"
                      placeholder="e.g. 101, 204"
                      value={formData.roomNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Floor Number *</label>
                    <input
                      type="number"
                      name="floor"
                      min="0"
                      max="20"
                      className="form-control"
                      value={formData.floor}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Room Type *</label>
                    <select
                      name="roomType"
                      className="form-control"
                      value={formData.roomType}
                      onChange={handleChange}
                    >
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Triple">Triple</option>
                      <option value="Four-Sharing">Four-Sharing</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Total Bed Capacity *</label>
                    <input
                      type="number"
                      name="capacity"
                      min="1"
                      max="10"
                      className="form-control"
                      value={formData.capacity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {editingId && (
                    <div className="form-group">
                      <label className="form-label">Currently Occupied Beds</label>
                      <input
                        type="number"
                        name="occupiedBeds"
                        min="0"
                        max={formData.capacity}
                        className="form-control"
                        value={formData.occupiedBeds}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Save Changes' : 'Save Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rooms;
