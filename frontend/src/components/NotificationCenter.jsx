import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  Check,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  Settings,
  Trash2,
} from 'lucide-react';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    taskReminders: true,
    dueDateReminders: true,
    dailySummary: true,
    weeklyReport: true,
    reminderTime: '09:00',
    soundEnabled: true,
    desktopNotifications: true,
  });

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (type, title, message, data = {}) => {
    const notification = {
      id: Date.now(),
      type,
      title,
      message,
      data,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [notification, ...prev]);

    // Show desktop notification if enabled
    if (settings.desktopNotifications && 'Notification' in window && Notification.permission === 'granted') {
      const desktopNotification = new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        tag: notification.id,
      });

      if (settings.soundEnabled) {
        // Play notification sound
        const audio = new Audio('/notification.mp3');
        audio.play().catch(() => {}); // Ignore errors if sound file doesn't exist
      }

      setTimeout(() => desktopNotification.close(), 5000);
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task_reminder':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'due_date':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'task_completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'daily_summary':
        return <Info className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'task_reminder':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      case 'due_date':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      case 'task_completed':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      case 'daily_summary':
        return 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="ml-3 px-2 py-1 text-sm font-medium bg-primary-600 text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="btn btn-secondary flex items-center"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="btn btn-secondary flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Notification Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Task Reminders
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get notified about upcoming tasks
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.taskReminders}
                onChange={(e) => setSettings(prev => ({ ...prev, taskReminders: e.target.checked }))}
                className="rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Due Date Reminders
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get notified when tasks are due
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.dueDateReminders}
                onChange={(e) => setSettings(prev => ({ ...prev, dueDateReminders: e.target.checked }))}
                className="rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Daily Summary
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get a daily summary of your tasks
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.dailySummary}
                onChange={(e) => setSettings(prev => ({ ...prev, dailySummary: e.target.checked }))}
                className="rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Weekly Report
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get a weekly productivity report
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.weeklyReport}
                onChange={(e) => setSettings(prev => ({ ...prev, weeklyReport: e.target.checked }))}
                className="rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Desktop Notifications
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Show browser notifications
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.desktopNotifications}
                onChange={(e) => setSettings(prev => ({ ...prev, desktopNotifications: e.target.checked }))}
                className="rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sound Effects
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Play sound for notifications
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, soundEnabled: e.target.checked }))}
                className="rounded"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Default Reminder Time
              </label>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={(e) => setSettings(prev => ({ ...prev, reminderTime: e.target.value }))}
                className="input mt-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No notifications yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You'll see your notifications here when they arrive
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {unreadCount > 0 && (
            <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
              </span>
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                Mark all as read
              </button>
            </div>
          )}

          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`card border-l-4 ${getNotificationColor(notification.type)} ${
                !notification.read ? 'border-l-4' : 'opacity-75'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {notification.message}
                    </p>
                    {notification.data.taskId && (
                      <button className="mt-2 text-xs text-primary-600 hover:text-primary-700">
                        View Task →
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-1 text-gray-400 hover:text-green-600"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Test Notification Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => addNotification(
            'task_reminder',
            'Test Notification',
            'This is a test notification to check your settings.',
            { test: true }
          )}
          className="btn btn-secondary"
        >
          Send Test Notification
        </button>
      </div>
    </div>
  );
};

export default NotificationCenter;
