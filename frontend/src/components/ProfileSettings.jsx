import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Save, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.put('/auth/profile', formData);
      updateUser(response.data.data.user);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
    });
    setIsEditing(false);
    setMessage('');
  };

  if (!user) {
    return (
      <div className="card">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Profile Information
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Loading profile information...
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Profile Information
          </h3>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-secondary text-sm flex items-center"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      {message && (
        <div className={`p-3 rounded-lg mb-4 ${
          message.includes('success') 
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
        }`}>
          {message}
        </div>
      )}

      {!isEditing ? (
        // View Mode
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-300">
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {user.username}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Username
              </p>
              <p className="text-gray-900 dark:text-white">
                {user.username}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Email Address
              </p>
              <p className="text-gray-900 dark:text-white">
                {user.email}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Member Since
              </p>
              <p className="text-gray-900 dark:text-white">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Account Status
              </p>
              <p className="text-green-600 dark:text-green-400 font-medium">
                Active
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Edit Mode
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-300">
                {formData.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {formData.username}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formData.email}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input"
              required
              minLength="3"
              maxLength="30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center"
            >
              {loading ? (
                <>
                  <div className="spinner mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="btn btn-secondary flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileSettings;
