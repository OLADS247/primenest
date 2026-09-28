import http from 'http';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readDb, writeDb, nextSeq } from './store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8787);
const OPS_PASSWORD = process.env.OPS_PASSWORD || 'change-this-before-real-users';
const tokens = new Map();
const hits = new Map();

const STATUSES = [
  'NEW', 'PAYMENT_PENDING', 'PAID', 'UNDER_REVIEW', 'ASSIGNED', 'SEARCHING',
  'OPTIONS_AVAILABLE', 'VIEWING', 'CLOSED', 'CANCELLED', 'ON_HOLD', 'REFUND_PENDING', 'REFUNDED'
];

const CITY_CODES = {
  lagos: 'LAG', abuja: 'ABJ', ibadan: 'IBD', 'port harcourt': 'PHC',
  enugu: 'ENU', kano: 'KAN', benin: 'BEN'
};

function clean(value, max = 240) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
}
function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function cityCode(city) {
  return CITY_CODES[clean(city, 40).toLowerCase()] || 'NG';
}
function requestId(city, seq) {
  return `PN-${cityCode(city)}-${new Date().getFullYear()}-${String(seq).padStart(6, '0')}`;
}
function nextStep(status) {
  const map = {
    NEW: 'PrimeNest will review this request. Payment is not collected in this version.',
    PAYMENT_PENDING: 'Payment is not live yet. Do not send money to a personal account.',
    PAID: 'Payment was recorded by operations. Review comes next.',
    UNDER_REVIEW: 'Operations is reviewing the request before a partner is assigned.',
    ASSIGNED: 'A partner has been assigned and should start searching.',
    SEARCHING: 'A partner is looking for suitable options.',
    OPTIONS_AVAILABLE: 'Options are ready. PrimeNest will share them with you.',
    VIEWING: 'A viewing or selection step is in progress.',
    CLOSED: 'This request is complete.',
    CANCELLED: 'This request was cancelled.',
    ON_HOLD: 'This request is on hold.',
    REFUND_PENDING: 'A refund is being reviewed.',
    REFUNDED: 'A refund has been recorded.'
  };
  return map[status] || 'PrimeNest will update this request.';
}
function publicRequest(row) {
  return {
    request_id: row.request_id,
    customer_name: row.customer_name,
    customer_type: row.customer_type,
    country: row.country,
    state: row.state,
    city: row.city,
    area: row.area,
    accommodation_type: row.accommodation_type,
    bedrooms: row.bedrooms,
    budget: row.budget,
    currency: row.currency,
    furnished: row.furnished,
    move_in_date: row.move_in_date,
    duration: row.duration,
    status: row.status,
    assigned_partner: row.assigned_partner || '',
    created_at: row.created_at,
    updated_at: row.updated_at,
    next_step: nextStep(row.status)
  };
}
function audit(db, action, entity, detail) {
  db.audit.unshift({ id: crypto.randomUUID(), at: new Date().toISOString(), action, entity, detail });
  db.audit = db.audit.slice(0, 500);
}
function limited(ip) {
  const now = Date.now();
  const bucket = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  if (bucket.length >= 40) return true;
  bucket.push(now);
  hits.set(ip, bucket);
  return false;
}
function send(res, code, body) {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS'
  });
  res.end(JSON.stringify(body));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 200_000) reject(new Error('Body too large'));
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { reject(new Error('Invalid JSON')); }
    });
  });
}
function opsOk(req) {
  const header = req.headers.authorization || '';
  const token = header.replace(/^Bearer\s+/i, '');
  const exp = tokens.get(token);
  return Boolean(exp && exp >= Date.now());
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, { success: true });
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const ip = req.socket.remoteAddress || 'local';

  try {
    if (req.method === 'GET' && url.pathname === '/api/health') {
      return send(res, 200, { success: true, message: 'PrimeNest API is running.', data: { product: 'PrimeNest', stage: 'V1 pilot', payments: 'not live' } });
    }

    if (req.method === 'POST' && url.pathname === '/api/requests') {
      if (limited(ip)) return send(res, 429, { success: false, message: 'Too many requests. Please wait a minute.' });
      const body = await readBody(req);
      const customer_name = clean(body.customer_name, 80);
      const email = clean(body.email, 120).toLowerCase();
      const phone = clean(body.phone, 30);
      const state = clean(body.state, 60);
      const city = clean(body.city, 60);
      const accommodation_type = clean(body.accommodation_type, 40);
      const budget = Number(body.budget);
      if (customer_name.length < 2) return send(res, 400, { success: false, message: 'Enter your full name.' });
      if (!isEmail(email)) return send(res, 400, { success: false, message: 'Enter a valid email.' });
      if (phone.length < 7) return send(res, 400, { success: false, message: 'Enter a phone number.' });
      if (!state || !city) return send(res, 400, { success: false, message: 'Enter a state and city.' });
      if (!accommodation_type) return send(res, 400, { success: false, message: 'Choose an accommodation type.' });
      if (!Number.isFinite(budget) || budget <= 0) return send(res, 400, { success: false, message: 'Enter a budget greater than zero.' });
      const db = readDb();
      const seq = nextSeq(db);
      const now = new Date().toISOString();
      const row = {
        request_id: requestId(city, seq), created_at: now, updated_at: now,
        customer_name, email, phone,
        preferred_contact: clean(body.preferred_contact, 20),
        customer_type: clean(body.customer_type, 40),
        country: clean(body.country, 40) || 'Nigeria',
        state, city, area: clean(body.area, 80),
        institution: clean(body.institution, 120), campus: clean(body.campus, 120),
        accommodation_type, bedrooms: clean(body.bedrooms, 20), budget,
        currency: clean(body.currency, 8) || 'NGN', furnished: clean(body.furnished, 20),
        move_in_date: clean(body.move_in_date, 20), duration: clean(body.duration, 40),
        notes: clean(body.notes, 800), payment_status: 'NOT_LIVE', status: 'NEW',
        assigned_partner: '', operations_notes: ''
      };
      db.requests.unshift(row);
      audit(db, 'REQUEST_CREATED', row.request_id, city);
      writeDb(db);
      return send(res, 201, { success: true, message: 'Request received.', data: publicRequest(row) });
    }

    if (req.method === 'POST' && url.pathname === '/api/requests/track') {
      if (limited(ip)) return send(res, 429, { success: false, message: 'Too many requests. Please wait a minute.' });
      const body = await readBody(req);
      const request_id = clean(body.request_id, 40).toUpperCase();
      const email = clean(body.email, 120).toLowerCase();
      const row = readDb().requests.find((r) => r.request_id === request_id && r.email === email);
      if (!row) return send(res, 404, { success: false, message: 'No request matches that ID and email.' });
      return send(res, 200, { success: true, message: 'Request found.', data: publicRequest(row) });
    }

    if (req.method === 'POST' && url.pathname === '/api/partners') {
      if (limited(ip)) return send(res, 429, { success: false, message: 'Too many requests. Please wait a minute.' });
      const body = await readBody(req);
      const applicant_name = clean(body.applicant_name, 80);
      const email = clean(body.email, 120).toLowerCase();
      const phone = clean(body.phone, 30);
      const partner_type = clean(body.partner_type, 60);
      const city = clean(body.city, 60);
      if (applicant_name.length < 2 || !isEmail(email) || phone.length < 7 || !partner_type || !city) {
        return send(res, 400, { success: false, message: 'Name, email, phone, partner type, and city are required.' });
      }
      const db = readDb();
      const seq = nextSeq(db);
      const row = {
        application_id: `PN-PAR-${new Date().getFullYear()}-${String(seq).padStart(6, '0')}`,
        created_at: new Date().toISOString(), applicant_name,
        business_name: clean(body.business_name, 120), email, phone, partner_type,
        country: clean(body.country, 40) || 'Nigeria', state: clean(body.state, 60), city,
        services: clean(body.services, 400), experience: clean(body.experience, 40),
        website: clean(body.website, 160), notes: clean(body.notes, 800), status: 'PENDING_REVIEW'
      };
      db.partners.unshift(row);
      audit(db, 'PARTNER_APPLIED', row.application_id, city);
      writeDb(db);
      return send(res, 201, { success: true, message: 'Application received. Verification is not automatic.', data: { application_id: row.application_id, status: row.status } });
    }

    if (req.method === 'POST' && url.pathname === '/api/support') {
      if (limited(ip)) return send(res, 429, { success: false, message: 'Too many requests. Please wait a minute.' });
      const body = await readBody(req);
      const name = clean(body.name, 80);
      const email = clean(body.email, 120).toLowerCase();
      const message = clean(body.message, 1000);
      if (name.length < 2 || !isEmail(email) || message.length < 8) {
        return send(res, 400, { success: false, message: 'Name, email, and a message are required.' });
      }
      const db = readDb();
      const seq = nextSeq(db);
      const row = {
        ticket_id: `PN-SUP-${new Date().getFullYear()}-${String(seq).padStart(6, '0')}`,
        created_at: new Date().toISOString(), name, email, phone: clean(body.phone, 30),
        request_id: clean(body.request_id, 40).toUpperCase(),
        category: clean(body.category, 40) || 'General Question', message, status: 'OPEN'
      };
      db.tickets.unshift(row);
      audit(db, 'TICKET_CREATED', row.ticket_id, row.category);
      writeDb(db);
      return send(res, 201, { success: true, message: 'Support ticket received.', data: { ticket_id: row.ticket_id, status: row.status } });
    }

    if (req.method === 'POST' && url.pathname === '/api/ops/login') {
      const body = await readBody(req);
      if (String(body.password || '') !== OPS_PASSWORD) return send(res, 401, { success: false, message: 'Incorrect operations password.' });
      const token = crypto.randomBytes(24).toString('hex');
      tokens.set(token, Date.now() + 1000 * 60 * 60 * 12);
      return send(res, 200, { success: true, message: 'Operations access granted.', data: { token } });
    }

    if (req.method === 'GET' && url.pathname === '/api/ops/board') {
      if (!opsOk(req)) return send(res, 401, { success: false, message: 'Operations login required.' });
      const db = readDb();
      return send(res, 200, { success: true, message: 'Board loaded.', data: { requests: db.requests, partners: db.partners, tickets: db.tickets, audit: db.audit.slice(0, 30) } });
    }

    const patch = url.pathname.match(/^\/api\/ops\/requests\/([^/]+)$/);
    if (req.method === 'PATCH' && patch) {
      if (!opsOk(req)) return send(res, 401, { success: false, message: 'Operations login required.' });
      const body = await readBody(req);
      const id = decodeURIComponent(patch[1]).toUpperCase();
      const db = readDb();
      const row = db.requests.find((r) => r.request_id === id);
      if (!row) return send(res, 404, { success: false, message: 'Request not found.' });
      const status = clean(body.status, 40);
      if (status && !STATUSES.includes(status)) return send(res, 400, { success: false, message: 'Unknown status.' });
      const before = row.status;
      if (status) row.status = status;
      if (body.assigned_partner !== undefined) row.assigned_partner = clean(body.assigned_partner, 120);
      if (body.operations_notes !== undefined) row.operations_notes = clean(body.operations_notes, 1000);
      row.updated_at = new Date().toISOString();
      audit(db, 'REQUEST_UPDATED', id, `${before} -> ${row.status}`);
      writeDb(db);
      return send(res, 200, { success: true, message: 'Request updated.', data: row });
    }

    if (!url.pathname.startsWith('/api')) {
      const dist = path.join(__dirname, '..', 'dist');
      const requested = url.pathname === '/' ? 'index.html' : url.pathname;
      const file = path.normalize(path.join(dist, requested));
      if (file.startsWith(dist) && fs.existsSync(file) && fs.statSync(file).isFile()) {
        const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
        res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
        return fs.createReadStream(file).pipe(res);
      }
      const index = path.join(dist, 'index.html');
      if (fs.existsSync(index)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return fs.createReadStream(index).pipe(res);
      }
    }
    return send(res, 404, { success: false, message: 'Not found. In development, open the Vite site.' });
  } catch (err) {
    return send(res, 400, { success: false, message: err.message || 'Request failed.' });
  }
});

server.listen(PORT, () => {
  console.log(`PrimeNest API on http://127.0.0.1:${PORT}`);
});
