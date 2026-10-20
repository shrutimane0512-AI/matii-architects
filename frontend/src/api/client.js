const BASE_URL = `${import.meta.env.VITE_API_URL ?? ''}/api`;

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const detail = Array.isArray(data?.detail)
      ? data.detail.map((d) => `${d.loc?.at(-1)}: ${d.msg}`).join(', ')
      : data?.detail;
    throw new Error(detail || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  getProjects: (category) =>
    request(`/projects${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  getServices: () => request('/services'),
  sendContact: (payload) =>
    request('/contact', { method: 'POST', body: JSON.stringify(payload) }),
};
