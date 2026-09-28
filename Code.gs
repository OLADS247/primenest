var SHEETS = {
  requests: 'Requests',
  partners: 'Partner Applications',
  tickets: 'Support Tickets'
};

var REQUEST_HEADERS = [
  'Request ID', 'Created At', 'Updated At', 'Customer Name', 'Email', 'Phone',
  'Preferred Contact', 'Customer Type', 'Country', 'State', 'City', 'Area',
  'Institution', 'Campus', 'Accommodation Type', 'Bedrooms', 'Budget', 'Currency',
  'Furnished', 'Move-in Date', 'Duration', 'Special Requirements', 'Payment Status',
  'Request Status', 'Assigned Partner', 'Operations Notes'
];

function doGet() {
  return json({ success: true, message: 'PrimeNest sheet API is running.', data: { payments: 'not live' } });
}

function doPost(e) {
  try {
    var body = JSON.parse((e.postData && e.postData.contents) || '{}');
    var action = body.action;
    if (action === 'createRequest') return json(createRequest(body));
    if (action === 'trackRequest') return json(trackRequest(body));
    if (action === 'createPartner') return json(createPartner(body));
    if (action === 'createSupport') return json(createSupport(body));
    return json({ success: false, message: 'Unknown action.' });
  } catch (err) {
    return json({ success: false, message: err.message || 'Sheet API failed.' });
  }
}

function createRequest(body) {
  var name = clean(body.customer_name, 80);
  var email = clean(body.email, 120).toLowerCase();
  var phone = clean(body.phone, 30);
  var state = clean(body.state, 60);
  var city = clean(body.city, 60);
  var budget = Number(body.budget);
  if (name.length < 2) return { success: false, message: 'Enter your full name.' };
  if (!/@/.test(email)) return { success: false, message: 'Enter a valid email.' };
  if (phone.length < 7) return { success: false, message: 'Enter a phone number.' };
  if (!state || !city) return { success: false, message: 'Enter a state and city.' };
  if (!isFinite(budget) || budget <= 0) return { success: false, message: 'Enter a budget greater than zero.' };

  var sheet = tab(SHEETS.requests, REQUEST_HEADERS);
  var now = new Date().toISOString();
  var id = nextRequestId(sheet, city);
  sheet.appendRow([
    id, now, now, name, email, phone,
    clean(body.preferred_contact, 20), clean(body.customer_type, 40), clean(body.country, 40) || 'Nigeria',
    state, city, clean(body.area, 80), clean(body.institution, 120), clean(body.campus, 120),
    clean(body.accommodation_type, 40), clean(body.bedrooms, 20), budget, clean(body.currency, 8) || 'NGN',
    clean(body.furnished, 20), clean(body.move_in_date, 20), clean(body.duration, 40), clean(body.notes, 800),
    'NOT_LIVE', 'NEW', '', ''
  ]);
  return {
    success: true,
    message: 'Request saved to the sheet.',
    data: { request_id: id, status: 'NEW', next_step: 'The PrimeNest team will review this row in the spreadsheet.' }
  };
}

function trackRequest(body) {
  var id = clean(body.request_id, 40).toUpperCase();
  var email = clean(body.email, 120).toLowerCase();
  var sheet = tab(SHEETS.requests, REQUEST_HEADERS);
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]).toUpperCase() === id && String(values[i][4]).toLowerCase() === email) {
      return {
        success: true,
        message: 'Request found.',
        data: {
          request_id: values[i][0],
          customer_name: values[i][3],
          city: values[i][10],
          state: values[i][9],
          accommodation_type: values[i][14],
          budget: values[i][16],
          currency: values[i][17],
          status: values[i][23],
          assigned_partner: values[i][24],
          next_step: 'Status comes from the spreadsheet. The team updates that cell.'
        }
      };
    }
  }
  return { success: false, message: 'No request matches that ID and email.' };
}

function createPartner(body) {
  var sheet = tab(SHEETS.partners, ['Application ID', 'Created At', 'Applicant Name', 'Business Name', 'Email', 'Phone', 'Partner Type', 'State', 'City', 'Services', 'Status']);
  var id = 'PN-PAR-' + new Date().getFullYear() + '-' + pad(sheet.getLastRow());
  sheet.appendRow([id, new Date().toISOString(), clean(body.applicant_name, 80), clean(body.business_name, 120), clean(body.email, 120), clean(body.phone, 30), clean(body.partner_type, 60), clean(body.state, 60), clean(body.city, 60), clean(body.services, 400), 'PENDING_REVIEW']);
  return { success: true, message: 'Application saved to the sheet.', data: { application_id: id, status: 'PENDING_REVIEW' } };
}

function createSupport(body) {
  var sheet = tab(SHEETS.tickets, ['Ticket ID', 'Created At', 'Name', 'Email', 'Phone', 'Request ID', 'Category', 'Message', 'Status']);
  var id = 'PN-SUP-' + new Date().getFullYear() + '-' + pad(sheet.getLastRow());
  sheet.appendRow([id, new Date().toISOString(), clean(body.name, 80), clean(body.email, 120), clean(body.phone, 30), clean(body.request_id, 40), clean(body.category, 40), clean(body.message, 1000), 'OPEN']);
  return { success: true, message: 'Ticket saved to the sheet.', data: { ticket_id: id, status: 'OPEN' } };
}

function nextRequestId(sheet, city) {
  var code = ({ lagos: 'LAG', abuja: 'ABJ', ibadan: 'IBD' }[String(city || '').toLowerCase()] || 'NG');
  var year = new Date().getFullYear();
  var count = Math.max(sheet.getLastRow() - 1, 0) + 1;
  return 'PN-' + code + '-' + year + '-' + pad(count);
}

function tab(name, headers) {
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sheet.getLastRow() === 0) sheet.appendRow(headers);
  return sheet;
}

function pad(n) {
  return ('000000' + n).slice(-6);
}

function clean(value, max) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
