import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../constants';

export const apiService = {
  auth: {
    login: (email, password) =>
      apiClient(API_ENDPOINTS.AUTH_LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }),
    getMe: () => apiClient(API_ENDPOINTS.AUTH_ME)
  },
  leads: {
    getLeads: () => apiClient(API_ENDPOINTS.LEADS),
    createLead: (lead) =>
      apiClient(API_ENDPOINTS.LEADS, {
        method: 'POST',
        body: JSON.stringify(lead)
      })
  },
  orders: {
    getOrders: () => apiClient(API_ENDPOINTS.ORDERS),
    updateOrderStage: (orderId, stage, actor) =>
      apiClient(API_ENDPOINTS.ORDER_STAGE(orderId), {
        method: 'PATCH',
        body: JSON.stringify({ stage, actor })
      })
  },
  payments: {
    getPayments: () => apiClient(API_ENDPOINTS.PAYMENTS)
  },
  team: {
    getTeamMembers: () => apiClient(API_ENDPOINTS.TEAM)
  }
};
