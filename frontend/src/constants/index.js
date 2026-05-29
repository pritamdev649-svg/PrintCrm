export const ROLES = {
  OWNER: 'OWNER',
  MANAGER: 'MANAGER',
  SALES: 'SALES',
  PRODUCTION: 'PRODUCTION',
  DELIVERY: 'DELIVERY',
  ACCOUNTANT: 'ACCOUNTANT'
};

export const ROLE_OPTIONS = [
  { value: ROLES.OWNER, label: 'Owner' },
  { value: ROLES.MANAGER, label: 'Manager' },
  { value: ROLES.SALES, label: 'Sales Agent' },
  { value: ROLES.PRODUCTION, label: 'Production' },
  { value: ROLES.DELIVERY, label: 'Delivery' },
  { value: ROLES.ACCOUNTANT, label: 'Accountant' }
];

export const LEAD_TEMPERATURES = {
  COLD: { value: 'COLD', label: 'Cold', badgeClass: 'bg-system-blueLight text-system-blue' },
  WARM: { value: 'WARM', label: 'Warm', badgeClass: 'bg-system-amberLight text-system-amber' },
  HOT: { value: 'HOT', label: 'Hot', badgeClass: 'bg-accent-light text-accent' },
  GENERAL: { value: 'GENERAL', label: 'General', badgeClass: 'bg-paper-soft text-ink-light' }
};

export const ORDER_STAGES = [
  { id: 'new', label: 'New / Confirmed', color: '#6a1ac4' },
  { id: 'quoted', label: 'Quoted', color: '#1a4ac4' },
  { id: 'production', label: 'In Production', color: '#c47a10' },
  { id: 'quality', label: 'Quality Check', color: '#e8521a' },
  { id: 'ready', label: 'Ready', color: '#1a7a4a' },
  { id: 'delivery', label: 'Out for Delivery', color: '#1a4ac4' },
  { id: 'delivered', label: 'Delivered', color: '#7a7874' }
];

export const PAYMENT_METHODS = ['UPI', 'Cash', 'Bank Transfer', 'Cheque'];

export const PROVIDERS = ['Interakt', 'Wati', 'AiSensy', 'Twilio', 'Custom HTTP Gateway'];

export const API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  AUTH_ME: '/auth/me',
  LEADS: '/leads',
  LEAD_BY_ID: (id) => `/leads/${id}`,
  LEAD_NOTES: (id) => `/leads/${id}/notes`,
  ORDERS: '/orders',
  ORDER_BY_ID: (id) => `/orders/${id}`,
  ORDER_STAGE: (id) => `/orders/${id}/stage`,
  ORDER_FROM_LEAD: (leadId) => `/orders/from-lead/${leadId}`,
  PAYMENTS: '/payments',
  TEAM: '/team',
  TEAM_MEMBER_BY_ID: (id) => `/team/${id}`
};
