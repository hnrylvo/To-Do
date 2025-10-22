const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

async function request(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();
  if (!res.ok) {
    let message = 'Request failed';
    if (typeof data === 'string') message = data;
    else if (data?.error) message = data.error;
    else if (data?.message) message = data.message;
    else if (Array.isArray(data?.errors) && data.errors.length) message = data.errors[0]?.msg || message;
    throw new Error(message);
  }
  return data;
}

const api = {
  get: (path, opts) => request(path, { method: 'GET', ...(opts || {}) }),
  post: (path, body, opts) => request(path, { method: 'POST', body, ...(opts || {}) }),
  put: (path, body, opts) => request(path, { method: 'PUT', body, ...(opts || {}) }),
  delete: (path, opts) => request(path, { method: 'DELETE', ...(opts || {}) }),
};

export default api;
