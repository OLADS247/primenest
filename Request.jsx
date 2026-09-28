import { useState } from 'react';
import { api } from './api.js';
import { ACCOMMODATION_TYPES, CUSTOMER_TYPES } from './data.js';

const start = {
  customer_name: '',
  email: '',
  phone: '',
  preferred_contact: 'WhatsApp',
  customer_type: 'Student',
  country: 'Nigeria',
  state: 'Lagos',
  city: 'Lagos',
  area: '',
  institution: '',
  campus: '',
  accommodation_type: 'Apartment',
  bedrooms: '1',
  budget: '',
  currency: 'NGN',
  furnished: 'Furnished',
  move_in_date: '',
  duration: '',
  notes: ''
};
