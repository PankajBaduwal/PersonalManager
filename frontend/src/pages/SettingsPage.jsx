import React from 'react';
import ProfileSettings from '../components/ProfileSettings';
import NotificationSettings from '../components/NotificationSettings';

const SettingsPage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your profile, preferences, and notifications.
        </p>
      </div>

      <div className="space-y-6">
        <ProfileSettings />
        <NotificationSettings />
        
        {/* Additional settings sections can be added here */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              More Settings Coming Soon
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            We're working on adding more customization options to enhance your experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
