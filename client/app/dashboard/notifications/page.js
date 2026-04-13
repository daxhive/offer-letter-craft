'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../lib/api';
import {
  Bell,
  CheckCircle2,
  Clock,
  FileText,
  Trash2,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-500">Stay updated on offer statuses and candidate actions.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="premium-card p-6 bg-white animate-pulse h-24"></div>
          ))
        ) : notifications.length === 0 ? (
          <div className="premium-card p-12 text-center bg-white">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-200" />
            </div>
            <p className="text-gray-400 italic">No notifications yet.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`premium-card p-6 flex items-start justify-between border-l-4 transition-all ${notification.read
                  ? 'bg-white border-transparent'
                  : 'bg-blue-50/30 border-blue-600 shadow-blue-50'
                }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl ${notification.type === 'OFFER_SIGNED' ? 'bg-green-100 text-green-600' :
                    notification.type === 'OFFER_SENT' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                  }`}>
                  {notification.type === 'OFFER_SIGNED' ? <CheckCircle2 className="w-5 h-5" /> :
                    notification.type === 'OFFER_SENT' ? <Mail className="w-5 h-5" /> :
                      <Bell className="w-5 h-5" />}
                </div>
                <div>
                  <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-bold'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>

              {!notification.read && (
                <button
                  onClick={() => markRead(notification._id)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-lg"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
