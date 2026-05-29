import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ORDER_STAGES, ROLE_OPTIONS } from '../constants';
import { apiService } from '../services/apiService';

const CRMDataContext = createContext(null);

const formatTimeAgo = (date) => {
  const diffMs = new Date() - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs} hr ago`;
  return 'Yesterday';
};

export const CRMDataProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState(ROLE_OPTIONS[0].value);
  const [leads, setLeads] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [team, setTeam] = useState([]);
  
  // Auth state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('printcrm_token') || null);
  const [loading, setLoading] = useState(true);

  const [providerConfig, setProviderConfig] = useState({
    provider: import.meta.env.VITE_WHATSAPP_PROVIDER || 'Interakt',
    baseUrl: import.meta.env.VITE_WHATSAPP_API_BASE_URL || 'https://api.interakt.ai/v1',
    token: import.meta.env.VITE_WHATSAPP_API_TOKEN || '',
    authHeader: 'Authorization',
    authPrefix: 'Bearer',
    fieldMap: {
      name: 'contact.name',
      phone: 'contact.phone',
      message: 'message.text'
    }
  });

  // 1. Verify token session on initial mount
  useEffect(() => {
    const verifySession = async () => {
      if (token) {
        try {
          const res = await apiService.auth.getMe();
          setUser(res.user);
        } catch (error) {
          console.error('Session expired, clearing credentials.', error);
          localStorage.removeItem('printcrm_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    verifySession();
  }, [token]);

  // 2. Fetch all operational details dynamically upon authentication
  useEffect(() => {
    if (user) {
      const fetchAllCRMData = async () => {
        try {
          const [leadsRes, ordersRes, paymentsRes, teamRes] = await Promise.all([
            apiService.leads.getLeads(),
            apiService.orders.getOrders(),
            apiService.payments.getPayments(),
            apiService.team.getTeamMembers()
          ]);

          // Map Leads
          const mappedLeads = (leadsRes.leads || []).map((lead) => ({
            id: lead._id,
            name: lead.name,
            phone: lead.phone,
            product: lead.product,
            quantity: lead.quantity,
            temperature: lead.temperature || 'GENERAL',
            source: lead.source || 'Manual',
            assignee: lead.assignee?.name || 'Unassigned',
            status: lead.status || 'New',
            timeAgo: lead.createdAt ? formatTimeAgo(new Date(lead.createdAt)) : 'Just now'
          }));

          // Map Orders
          const mappedOrders = (ordersRes.orders || []).map((order) => ({
            id: order._id,
            customer: order.customerName,
            phone: order.phone,
            product: order.product,
            quantity: order.quantity,
            total: order.totalAmount,
            paid: order.paidAmount,
            deadline: order.deadline ? order.deadline.split('T')[0] : '2026-06-01',
            assignee: order.assignee?.name || 'Unassigned',
            stage: order.stage
          }));

          // Map Payments
          const mappedPayments = (paymentsRes.payments || []).map((payment) => ({
            id: payment._id,
            customer: payment.customerName,
            method: payment.method,
            amount: payment.amount,
            date: payment.paidAt ? payment.paidAt.split('T')[0] : '2026-05-27',
            status: payment.status
          }));

          // Map Team
          const mappedTeam = (teamRes.members || []).map((member) => ({
            name: member.name,
            role: member.role,
            status: member.status || 'Online',
            revenue: member.role === 'OWNER' ? 218000 : member.role === 'SALES' ? 93500 : 71000,
            closed: member.role === 'OWNER' ? 42 : member.role === 'SALES' ? 19 : 14
          }));

          setLeads(mappedLeads);
          setOrders(mappedOrders);
          setPayments(mappedPayments);
          setTeam(mappedTeam);
        } catch (err) {
          console.error('Failed to sync CRM data from backend:', err);
        }
      };
      fetchAllCRMData();
    }
  }, [user]);

  // Calculated metrics
  const metrics = useMemo(() => {
    const revenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const outstanding = orders.reduce((sum, order) => sum + order.total - order.paid, 0);
    const overdue = orders.filter((order) => new Date(order.deadline) < new Date()).length;

    return {
      totalLeads: leads.length,
      activeOrders: orders.filter((order) => order.stage !== 'delivered').length,
      revenue,
      outstanding,
      overdue
    };
  }, [leads, orders, payments]);

  // Stage changes persistent backend save
  const moveOrder = async (orderId, nextStage) => {
    try {
      // Optimistic state update
      setOrders((currentOrders) =>
        currentOrders.map((order) => (order.id === orderId ? { ...order, stage: nextStage } : order))
      );

      // Backend sync via unified apiService
      await apiService.orders.updateOrderStage(orderId, nextStage, user?.id);
    } catch (err) {
      console.error('Failed to update stage in backend database:', err);
    }
  };

  // Add lead persistent backend save
  const addLead = async (lead) => {
    try {
      const res = await apiService.leads.createLead({
        name: lead.name,
        phone: lead.phone,
        product: lead.product,
        quantity: lead.quantity,
        temperature: lead.temperature || 'GENERAL',
        source: lead.source || 'Manual',
        status: lead.status || 'New'
      });

      const newLead = {
        id: res.lead._id,
        name: res.lead.name,
        phone: res.lead.phone,
        product: res.lead.product,
        quantity: res.lead.quantity,
        temperature: res.lead.temperature,
        source: res.lead.source,
        assignee: 'Unassigned',
        status: res.lead.status,
        timeAgo: 'Just now'
      };

      setLeads((currentLeads) => [newLead, ...currentLeads]);
    } catch (err) {
      console.error('Failed to create new lead in backend database:', err);
    }
  };

  const loginSuccess = (newToken, loggedInUser) => {
    localStorage.setItem('printcrm_token', newToken);
    setToken(newToken);
    setUser(loggedInUser);
  };

  const logout = () => {
    localStorage.removeItem('printcrm_token');
    setToken(null);
    setUser(null);
    setLeads([]);
    setOrders([]);
    setPayments([]);
    setTeam([]);
  };

  return (
    <CRMDataContext.Provider
      value={{
        user,
        loading,
        loginSuccess,
        logout,
        activeRole,
        setActiveRole,
        leads,
        orders,
        payments,
        team,
        stages: ORDER_STAGES,
        metrics,
        providerConfig,
        setProviderConfig,
        moveOrder,
        addLead
      }}
    >
      {children}
    </CRMDataContext.Provider>
  );
};

export const useCRMData = () => {
  const context = useContext(CRMDataContext);
  if (!context) throw new Error('useCRMData must be used inside CRMDataProvider');
  return context;
};
