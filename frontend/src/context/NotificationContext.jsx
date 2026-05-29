import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { getFirebaseMessaging, hasFirebaseConfig } from '../utils/firebase';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([
    { id: 'seed', title: 'New WhatsApp lead', body: 'Reena Sharma asked for 250 custom mugs.' }
  ]);

  const pushToast = (toast) => {
    setToasts((currentToasts) => [{ id: crypto.randomUUID(), ...toast }, ...currentToasts].slice(0, 4));
  };

  const dismissToast = (id) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  };

  // 1. Initialize Firebase Cloud Messaging Token & Foreground Listeners
  useEffect(() => {
    const initializeFCM = async () => {
      // Confirm browser supports notifications & config is present
      if (!hasFirebaseConfig || typeof window === 'undefined' || !('Notification' in window)) {
        return;
      }

      try {
        // Request notification permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('[FCM] Notification permissions denied.');
          return;
        }

        const messaging = await getFirebaseMessaging();
        if (!messaging) return;

        // Dynamically import messaging tools to keep main chunk modular
        const { getToken, onMessage } = await import('firebase/messaging');

        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined
        });

        if (token) {
          // Log FCM token in beautiful, premium green console format
          console.log(
            `%c[FCM Token] %c${token}`,
            'color: #ffffff; background: #1a7a4a; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
            'color: #1f2724; font-weight: 500; font-family: monospace;'
          );
        } else {
          console.warn('[FCM] No registration token available. Generate another device instance.');
        }

        // Foreground messaging push trigger
        onMessage(messaging, (payload) => {
          pushToast({
            title: payload.notification?.title || 'FCM Alert',
            body: payload.notification?.body || 'New operations update received.'
          });
        });
      } catch (error) {
        console.error('[FCM] Failed to configure Firebase messaging:', error);
      }
    };

    initializeFCM();
  }, []);

  const value = useMemo(() => ({ toasts, pushToast, dismissToast }), [toasts]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="fixed right-5 top-20 z-50 grid w-[min(360px,calc(100vw-2rem))] gap-3">
        {toasts.map((toast) => (
          <div key={toast.id} className="rounded-2xl border border-brand-line bg-white p-4 shadow-float animate-fade-in-up">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-dark">
                <Bell size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{toast.title}</p>
                <p className="mt-1 text-sm text-ink-light">{toast.body}</p>
              </div>
              <button className="text-ink-extra hover:text-ink cursor-pointer" onClick={() => dismissToast(toast.id)} aria-label="Dismiss">
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used inside NotificationProvider');
  return context;
};
