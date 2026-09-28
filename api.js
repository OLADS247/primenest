import { API_BASE_URL } from './config.js';

async function callLocal(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const body = await response.json();
  if (!response.ok || body.success === false) throw new Error(body.message || 'Request failed.');
  return body;
}

async function callSheet(action, payload) {
  if (!API_BASE_URL) throw new Error('Add the Google Sheet web app URL in src/config.js.');
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, ...payload })
  });
  const body = await response.json();
  if (body.success === false) throw new Error(body.message || 'Sheet request failed.');
  return body;
}

const useSheet = Boolean(API_BASE_URL);

export const api = {
  createRequest(payload) {
    return useSheet ? callSheet('createRequest', payload) : callLocal('/api/requests', { method: 'POST', body: JSON.stringify(payload) });
  },
  trackRequest(payload) {
    return useSheet ? callSheet('trackRequest', payload) : callLocal('/api/requests/track', { method: 'POST', body: JSON.stringify(payload) });
  },
  createPartner(payload) {
    return useSheet ? callSheet('createPartner', payload) : callLocal('/api/partners', { method: 'POST', body: JSON.stringify(payload) });
  },
  createTicket(payload) {
    return useSheet ? callSheet('createSupport', payload) : callLocal('/api/support', { method: 'POST', body: JSON.stringify(payload) });
  },
  opsLogin(password) {
    return callLocal('/api/ops/login', { method: 'POST', body: JSON.stringify({ password }) });
  },
  opsBoard(token) {
    return callLocal('/api/ops/board', { headers: { Authorization: `Bearer ${token}` } });
  },
  updateRequest(token, id, payload) {
    return callLocal(`/api/ops/requests/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
  }
};
