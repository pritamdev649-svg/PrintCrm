import React, { useState } from 'react';
import { CRMDataProvider, useCRMData } from './context/CRMDataContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Leads } from './pages/Leads.jsx';
import { Orders } from './pages/Orders.jsx';
import { Payments } from './pages/Payments.jsx';
import { Team } from './pages/Team.jsx';
import { Settings } from './pages/Settings.jsx';
import { Login } from './pages/Login.jsx';

const pages = {
  dashboard: Dashboard,
  leads: Leads,
  orders: Orders,
  payments: Payments,
  team: Team,
  settings: Settings
};

function CRMAppContent() {
  const { user, loading, loginSuccess } = useCRMData();
  const [activePage, setActivePage] = useState('dashboard');
  const ActivePage = pages[activePage];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          <p className="text-xs font-semibold text-ink-light">Synchronizing session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={loginSuccess} />;
  }

  return (
    <AppShell activePage={activePage} onChangePage={setActivePage}>
      <div key={activePage} className="animate-fade-in-up">
        <ActivePage />
      </div>
    </AppShell>
  );
}

export default function App() {
  return (
    <CRMDataProvider>
      <NotificationProvider>
        <CRMAppContent />
      </NotificationProvider>
    </CRMDataProvider>
  );
}
