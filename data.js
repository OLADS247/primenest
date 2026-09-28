export const STATUSES = [
  'NEW',
  'PAYMENT_PENDING',
  'PAID',
  'UNDER_REVIEW',
  'ASSIGNED',
  'SEARCHING',
  'OPTIONS_AVAILABLE',
  'VIEWING',
  'CLOSED',
  'CANCELLED',
  'ON_HOLD',
  'REFUND_PENDING',
  'REFUNDED'
];

export const CUSTOMER_TYPES = ['Student', 'Professional', 'Family', 'Traveler', 'Relocator', 'Other'];

export const ACCOMMODATION_TYPES = [
  'Hostel',
  'Apartment',
  'Serviced apartment',
  'Hotel',
  'Guest house',
  'Other'
];

export const PARTNER_TYPES = [
  'Accommodation partner',
  'Hotel',
  'Hostel',
  'Property manager',
  'Serviced apartment',
  'Travel agency',
  'Travel specialist',
  'Relocation specialist',
  'Corporate partner',
  'Other'
];

export const SUPPORT_CATEGORIES = [
  'General Question',
  'Request Issue',
  'Payment Issue',
  'Accommodation Issue',
  'Partner Issue',
  'Complaint',
  'Other'
];

export const LOCATIONS = [
  { city: 'Lagos', state: 'Lagos', status: 'Pilot', note: 'First market. A request can be received. Coverage is real only where a partner is actually assigned.' },
  { city: 'Abuja', state: 'FCT', status: 'Listed', note: 'In the system. Not an operating city until supply and process exist.' },
  { city: 'Ibadan', state: 'Oyo', status: 'Listed', note: 'In the system. Not an operating city until supply and process exist.' },
  { city: 'Port Harcourt', state: 'Rivers', status: 'Listed', note: 'In the system. Not an operating city until supply and process exist.' }
];

export const FLOW = [
  ['Request', 'You tell PrimeNest the location, budget, dates, and type of place.'],
  ['Request ID', 'The server creates one ID. That ID is the record.'],
  ['Review', 'Operations reads the request. Nothing is marked paid unless payment is actually verified.'],
  ['Partner', 'A verified partner is assigned only when one exists for that place.'],
  ['Outcome', 'Options, a viewing, or a closed result. Then the record stays.']
];
