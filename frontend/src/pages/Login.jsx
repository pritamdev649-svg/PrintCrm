import React, { useState } from 'react';
import { KeyRound, Mail, PackageCheck, ShieldAlert } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { apiService } from '../services/apiService';

export const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { pushToast } = useNotifications();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await apiService.auth.login(email, password);

      pushToast({
        title: 'Authentication Successful',
        body: `Welcome back, ${data.user.name}!`
      });

      onLoginSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (quickEmail, quickPassword) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
    setError('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-12 sm:px-6 lg:px-8">
      {/* Background abstract glowing blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-brand-soft/40 blur-3xl" />
        <div className="absolute -bottom-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-accent-light/30 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center animate-fade-in-up">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-float">
            <PackageCheck size={26} />
          </div>
          <h2 className="mt-4 font-sans text-2xl font-bold tracking-tight text-brand-dark">Sign in to PrintCRM</h2>
          <p className="mt-1 text-xs text-ink-light">Manage inquiries, operations, and payments in high density</p>
        </div>

        {/* Login Form Card */}
        <div className="shell-card bg-white/70 backdrop-blur-md p-6 shadow-float border-brand-line/40 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <form className="space-y-4" onSubmit={handleLogin}>
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-system-redLight p-3 text-xs font-medium text-system-red border border-system-red/10 animate-fade-in">
                <ShieldAlert size={16} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-wide text-ink-extra">Email address</label>
              <div className="flex items-center gap-2 rounded-xl border border-paper-border bg-white px-3 py-2 transition-all focus-within:border-brand focus-within:ring-2 focus-within:ring-brand-soft">
                <Mail size={16} className="text-ink-extra" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-ink outline-none"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-wide text-ink-extra">Password</label>
              <div className="flex items-center gap-2 rounded-xl border border-paper-border bg-white px-3 py-2 transition-all focus-within:border-brand focus-within:ring-2 focus-within:ring-brand-soft">
                <KeyRound size={16} className="text-ink-extra" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-ink outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full min-h-10 items-center justify-center rounded-xl bg-brand text-sm font-semibold text-white shadow-card transition-all duration-200 hover:bg-brand-dark hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Quick-Fill Helpers for Demo */}
          <div className="mt-6 border-t border-paper-border pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-extra mb-2">Demo Accounts (Quick-Fill)</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickFill('owner@printcrm.test', 'printcrm123')}
                className="flex flex-col items-start rounded-lg border border-paper-border bg-paper-soft/40 p-2 text-left transition-all hover:bg-brand-soft hover:border-brand-line group cursor-pointer"
              >
                <div className="flex items-center gap-1.5 w-full">
                  <span className="text-[11px] font-bold text-ink group-hover:text-brand-dark">Pritam Shah</span>
                  <Badge className="bg-system-greenLight text-system-green text-[8px] px-1 py-0 ml-auto">Owner</Badge>
                </div>
                <span className="text-[9px] text-ink-extra">owner@printcrm.test</span>
              </button>

              <button
                onClick={() => handleQuickFill('sales@printcrm.test', 'printcrm123')}
                className="flex flex-col items-start rounded-lg border border-paper-border bg-paper-soft/40 p-2 text-left transition-all hover:bg-brand-soft hover:border-brand-line group cursor-pointer"
              >
                <div className="flex items-center gap-1.5 w-full">
                  <span className="text-[11px] font-bold text-ink group-hover:text-brand-dark">Meera Joshi</span>
                  <Badge className="bg-system-blueLight text-system-blue text-[8px] px-1 py-0 ml-auto">Sales</Badge>
                </div>
                <span className="text-[9px] text-ink-extra">sales@printcrm.test</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
