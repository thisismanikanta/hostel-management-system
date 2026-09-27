const BASE_URL = 'http://localhost:8080/api';

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  // Handle empty responses (like 204 or text body)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

export const studentApi = {
  getAll: () => request('/students'),
  getById: (id) => request(`/students/${id}`),
  create: (student) => request('/students', { method: 'POST', body: JSON.stringify(student) }),
  update: (id, student) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(student) }),
  delete: (id) => request(`/students/${id}`, { method: 'DELETE' }),
  search: (query) => request(`/students/search?query=${encodeURIComponent(query)}`),
};

export const hostelApi = {
  getAll: () => request('/hostels'),
  getById: (id) => request(`/hostels/${id}`),
  create: (hostel) => request('/hostels', { method: 'POST', body: JSON.stringify(hostel) }),
  update: (id, hostel) => request(`/hostels/${id}`, { method: 'PUT', body: JSON.stringify(hostel) }),
  delete: (id) => request(`/hostels/${id}`, { method: 'DELETE' }),
};

export const roomApi = {
  getAll: () => request('/rooms'),
  getById: (id) => request(`/rooms/${id}`),
  create: (room) => request('/rooms', { method: 'POST', body: JSON.stringify(room) }),
  update: (id, room) => request(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(room) }),
  delete: (id) => request(`/rooms/${id}`, { method: 'DELETE' }),
};

export const allocationApi = {
  getAll: () => request('/allocations'),
  getById: (id) => request(`/allocations/${id}`),
  create: (allocation) => request('/allocations', { method: 'POST', body: JSON.stringify(allocation) }),
  vacate: (id) => request(`/allocations/${id}/vacate`, { method: 'PUT' }),
  delete: (id) => request(`/allocations/${id}`, { method: 'DELETE' }),
};

export const complaintApi = {
  getAll: () => request('/complaints'),
  getById: (id) => request(`/complaints/${id}`),
  create: (complaint) => request('/complaints', { method: 'POST', body: JSON.stringify(complaint) }),
  update: (id, complaint) => request(`/complaints/${id}`, { method: 'PUT', body: JSON.stringify(complaint) }),
  updateStatus: (id, status) => request(`/complaints/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  delete: (id) => request(`/complaints/${id}`, { method: 'DELETE' }),
};

export const dashboardApi = {
  getStats: () => request('/dashboard/stats'),
};
