const API_URL =
  import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : import.meta.env.PROD
      ? ''
      : 'http://localhost:5000';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.erro || data.message || 'Erro na requisição');
  }
  return data;
}

export const api = {
  getAppointments: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/appointments${qs ? `?${qs}` : ''}`);
  },
  patchAppointmentStatus: (id, status) =>
    request(`/api/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  patchAppointmentStaff: (id, staffMember) =>
    request(`/api/appointments/${id}/staff`, {
      method: 'PATCH',
      body: JSON.stringify({ staffMember: staffMember || null }),
    }),
  getStaff: () => request('/api/staff'),
  getReportsVolume: (params) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/reports/volume?${qs}`);
  },
  getReportsTrends: (params) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/reports/trends?${qs}`);
  },
  getReportsStatusSummary: (params) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/reports/status-summary?${qs}`);
  },
  getExportData: (params) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/reports/export-data?${qs}`);
  },
  createAppointment: (body) =>
    request('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

export { API_URL };
