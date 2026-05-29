import React, { useState } from 'react';
import {
  Bell,
  CreditCard,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  PackageCheck,
  Settings,
  Users,
  Workflow,
  X
} from 'lucide-react';
import { ROLE_OPTIONS } from '../../constants';
import { useCRMData } from '../../context/CRMDataContext.jsx';

const navItems = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'leads', label: 'Leads Inbox', icon: MessageSquare },
  { id: 'orders', label: 'Order Pipeline', icon: Workflow },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'settings', label: 'Integrations', icon: Settings }
];

export const AppShell = ({ activePage, onChangePage, children }) => {
  const { activeRole, setActiveRole, user, logout } = useCRMData();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper">
      {/* Mobile Sidebar Overlay Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Dynamic Sidebar Drawer (Responsive Slide-in / Permanently Pinned on Desktop) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-[200px] border-r border-brand-line bg-white transition-transform duration-200 lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between border-b border-paper-border px-4">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand text-white">
              <PackageCheck size={16} />
            </div>
            <div>
              <p className="font-sans text-[15px] font-bold text-ink leading-tight">PrintCRM</p>
              <p className="text-[11px] font-medium text-ink-extra">Print operations suite</p>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button 
            className="lg:hidden p-1 text-ink-extra hover:text-ink rounded-lg transition-colors"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Close Sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Role Switcher */}
        <div className="border-b border-paper-border p-3">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-extra">Role View</label>
          <select
            value={activeRole}
            onChange={(event) => setActiveRole(event.target.value)}
            className="w-full rounded-lg border border-brand-line bg-brand-soft px-2 py-1.5 text-[13px] font-medium text-brand-dark outline-none"
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-0.5 p-2">
          <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-extra">Quick links</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activePage;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onChangePage(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition-all duration-200 ${
                  isActive ? 'bg-brand text-white shadow-card' : 'text-ink-muted hover:bg-brand-soft hover:text-brand-dark'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Layout (Independent Scroll Column) */}
      <main className="lg:pl-[200px] flex flex-col min-w-0 min-h-screen bg-paper">
        {/* Dynamic Mobile Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-paper-border bg-white/90 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-2">
            {/* Hamburger Button for Mobile */}
            <button 
              className="lg:hidden p-1 rounded-lg text-ink-muted hover:bg-brand-soft hover:text-brand-dark transition-colors"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Open Sidebar"
            >
              <Menu size={19} />
            </button>
            <h1 className="font-sans text-base font-bold text-ink">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="icon-button animate-colors" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <div 
              className="grid h-8 w-8 place-items-center rounded-full bg-brand text-xs font-bold text-white uppercase"
              title={user?.name}
            >
              {user?.name?.charAt(0) || 'U'}
            </div>
            <button 
              className="icon-button text-system-red hover:bg-system-redLight hover:border-system-red/30"
              onClick={logout}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
};
