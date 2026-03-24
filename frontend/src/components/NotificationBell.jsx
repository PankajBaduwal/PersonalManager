import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Settings } from 'lucide-react';
import notificationService from '../utils/notificationService';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load notifications
    const loadNotifications = () => {
      const saved = localStorage.getItem('notifications') || '[]';
      const parsed = JSON.parse(saved);
      setNotifications(parsed.slice(0, 5)); // Show only last 5 in dropdown
      setUnreadCount(parsed.filter(n => !n.read).length);
    };

    loadNotifications();

    // Listen for notification events
    const handleNotification = (event) => {
      loadNotifications();
    };

    const handleNotificationsCleared = () => {
      setNotifications([]);
      setUnreadCount(0);
    };

    const handleNotificationRead = (event) => {
      const notificationId = event.detail;
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    };

    window.addEventListener('notification', handleNotification);
    window.addEventListener('notifications-cleared', handleNotificationsCleared);
    window.addEventListener('notification-read', handleNotificationRead);

    return () => {
      window.removeEventListener('notification', handleNotification);
      window.removeEventListener('notifications-cleared', handleNotificationsCleared);
      window.removeEventListener('notification-read', handleNotificationRead);
    };
  }, []);

  const markAsRead = (notificationId) => {
    notificationService.markAsRead(notificationId);
  };

  const markAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.read) {
        notificationService.markAsRead(n.id);
      }
    });
  };

  const clearAll = () => {
    notificationService.clearAllNotifications();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task_reminder':
        return '📅';
      case 'due_date':
        return '⚠️';
      case 'task_completed':
        return '✅';
      case 'daily_summary':
        return '📊';
      default:
        return '🔔';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="fixed top-16 right-4 z-50 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Notifications
              </h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium text-gray-900 dark:text-white ${
                            !notification.read ? 'font-semibold' : ''
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-blue-600 hover:text-blue-700"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={clearAll}
                  className="w-full text-center text-sm text-red-600 hover:text-red-700"
                >
                  Clear all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
