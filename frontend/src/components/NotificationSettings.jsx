import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Settings, Check, X } from 'lucide-react';
import notificationService from '../services/notificationService';

const NotificationSettings = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [settings, setSettings] = useState({
    taskCreated: true,
    taskCompleted: true,
    taskDue: true,
    taskOverdue: true,
    streak: true,
  });

  useEffect(() => {
    setIsSupported(notificationService.isNotificationSupported());
    setPermission(notificationService.getPermissionStatus());
    
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const requestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setPermission(granted ? 'granted' : 'denied');
    return granted;
  };

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const testNotification = () => {
    notificationService.showNotification('Test Notification', {
      body: 'This is a test notification from your Task Manager!',
      icon: '/favicon.ico'
    });
  };

  if (!isSupported) {
    return (
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <BellOff className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications Not Supported
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Your browser does not support push notifications. Please try using a modern browser like Chrome, Firefox, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Bell className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notification Settings
          </h3>
        </div>
        <button
          onClick={testNotification}
          className="btn btn-secondary text-sm"
          disabled={permission !== 'granted'}
        >
          Test Notification
        </button>
      </div>

      {/* Permission Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              Notification Permission
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {permission === 'granted' && 'Notifications are enabled'}
              {permission === 'denied' && 'Notifications are blocked'}
              {permission === 'default' && 'Notifications not requested yet'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {permission === 'granted' && (
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            )}
            {permission === 'denied' && (
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            )}
            {permission === 'default' && (
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            )}
            {permission !== 'granted' && (
              <button
                onClick={requestPermission}
                className="btn btn-primary text-sm"
              >
                Enable
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notification Types */}
      {permission === 'granted' && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Notification Types
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Task Created
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  When a new task is added
                </p>
              </div>
              <button
                onClick={() => updateSetting('taskCreated', !settings.taskCreated)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.taskCreated ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.taskCreated ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Task Completed
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  When a task is marked as complete
                </p>
              </div>
              <button
                onClick={() => updateSetting('taskCompleted', !settings.taskCompleted)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.taskCompleted ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.taskCompleted ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Task Due Soon
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  When a task is due within 1 hour
                </p>
              </div>
              <button
                onClick={() => updateSetting('taskDue', !settings.taskDue)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.taskDue ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.taskDue ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Task Overdue
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  When a task is past its due date
                </p>
              </div>
              <button
                onClick={() => updateSetting('taskOverdue', !settings.taskOverdue)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.taskOverdue ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.taskOverdue ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Streak Achievements
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  When you reach a new streak milestone
                </p>
              </div>
              <button
                onClick={() => updateSetting('streak', !settings.streak)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.streak ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.streak ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {permission === 'denied' && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Notifications are blocked in your browser. To enable them, go to your browser settings and allow notifications for this site.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;
