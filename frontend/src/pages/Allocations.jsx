import React, { useState, useEffect } from 'react';
import { allocationApi, studentApi, roomApi } from '../services/api';

const initialForm = {
  studentId: '',
  roomId: '',
  allocationDate: new Date().toISOString().split('T')[0],
};

function Allocations() {
  const [allocations, setAllocations] = useState([]);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal & form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [allocData, studentData, roomData] = await Promise.all([
        allocationApi.getAll(),
        studentApi.getAll(),
        roomApi.getAll(),
      ]);
      setAllocations(allocData);
      setStudents(studentData);
      setRooms(roomData);
    } catch (err) {
      setError(err.message || 'Failed to load allocation data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setError(null);
    setSuccess(null);

    if (students.length === 0) {
      setError('Please add students before performing room allocation.');
      return;
    }
    if (rooms.length === 0) {
      setError('Please add rooms before performing room allocation.');
      return;
    }

    // Default select available room if possible
    const availableRoom = rooms.find((r) => r.occupiedBeds < r.capacity);
    setFormData({
      studentId: students[0]?.id || '',
      roomId: availableRoom?.id || rooms[0]?.id || '',
      allocationDate: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'studentId' || name === 'roomId' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.studentId || !formData.roomId) {
      setError('Please select both a student and a room.');
      return;
    }

    // Check client-side if room is full
    const selectedRoom = rooms.find((r) => r.id === Number(formData.roomId));
    if (selectedRoom && selectedRoom.occupiedBeds >= selectedRoom.capacity) {
      setError(`Cannot allocate: Room ${selectedRoom.roomNumber} is full (${selectedRoom.occupiedBeds}/${selectedRoom.capacity} beds occupied).`);
      return;
    }

    try {
      await allocationApi.create({
        studentId: Number(formData.studentId),
        roomId: Number(formData.roomId),
        allocationDate: formData.allocationDate,
      });
      setSuccess('Room successfully allocated to student.');
      handleCloseModal();
      fetchData();
    } catch (err) {
      setError(err.message || 'Room allocation failed.');
    }
  };

  const handleVacate = async (id, studentName, roomNumber) => {
    const confirmed = window.confirm(
      `Confirm vacating student "${studentName}" from Room "${roomNumber}"? This will free 1 bed.`
    );
    if (!confirmed) return;

    try {
      setError(null);
      await allocationApi.vacate(id);
      setSuccess(`Student "${studentName}" vacated successfully.`);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to vacate student.');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to permanently delete this allocation record?');
    if (!confirmed) return;

    try {
      setError(null);
      await allocationApi.delete(id);
      setSuccess('Allocation record deleted.');
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to delete allocation record.');
    }
  };

  // Filter available rooms for the allocation dropdown
  const availableRooms = rooms.filter((r) => r.occupiedBeds < r.capacity);

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h2 className="section-title">Room Allocations</h2>
          <p className="section-description">Manage student room assignments, bed availability, and checkout dates</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          Allocate Room
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading room allocations...</div>
      ) : allocations.length === 0 ? (
        <div className="empty-state">
          <h3>No Allocations Found</h3>
          <p>No students have been assigned to rooms yet. Click "Allocate Room" to assign a room.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Course / Year</th>
                <th>Room Number</th>
                <th>Hostel Name</th>
                <th>Allocation Date</th>
                <th>Vacated Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((alloc) => {
                const isActive = alloc.status === 'Active';
                return (
                  <tr key={alloc.id}>
                    <td>#{alloc.id}</td>
                    <td className="font-semibold">{alloc.student?.name || 'N/A'}</td>
                    <td>
                      {alloc.student?.course || 'N/A'} ({alloc.student?.year || ''})
                    </td>
                    <td className="font-semibold">{alloc.room?.roomNumber || 'N/A'}</td>
                    <td>{alloc.room?.hostel?.name || 'N/A'}</td>
                    <td>{alloc.allocationDate || 'N/A'}</td>
                    <td>{alloc.vacateDate || '-'}</td>
                    <td>
                      <span className={`badge ${isActive ? 'badge-success' : 'badge-neutral'}`}>
                        {alloc.status}
                      </span>
                    </td>
                    <td className="text-right table-actions">
                      {isActive && (
                        <button
                          type="button"
                          className="btn-link text-warning"
                          onClick={() =>
                            handleVacate(
                              alloc.id,
                              alloc.student?.name,
                              alloc.room?.roomNumber
                            )
                          }
                        >
                          Vacate Room
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-link text-danger"
                        onClick={() => handleDelete(alloc.id)}
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

      {/* Modal Form for Room Allocation */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">Allocate Student to Room</h3>
              <button type="button" className="modal-close" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Student *</label>
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
                        {s.name} ({s.course} - {s.gender})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Select Room *</label>
                  <select
                    name="roomId"
                    className="form-control"
                    value={formData.roomId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Choose Room --</option>
                    {rooms.map((r) => {
                      const full = r.occupiedBeds >= r.capacity;
                      return (
                        <option key={r.id} value={r.id} disabled={full}>
                          Room {r.roomNumber} - {r.hostel?.name} ({r.occupiedBeds}/{r.capacity} beds occupied){' '}
                          {full ? '[FULL]' : '[AVAILABLE]'}
                        </option>
                      );
                    })}
                  </select>
                  <small className="form-hint">
                    {availableRooms.length} room(s) currently have beds available.
                  </small>
                </div>

                <div className="form-group">
                  <label className="form-label">Allocation Date *</label>
                  <input
                    type="date"
                    name="allocationDate"
                    className="form-control"
                    value={formData.allocationDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Allocations;
