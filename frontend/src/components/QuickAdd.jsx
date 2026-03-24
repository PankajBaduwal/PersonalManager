import React, { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { useTask } from '../context/TaskContext';

const QuickAdd = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Assignments',
    priority: 'Medium',
  });
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  
  const { createTask, loading } = useTask();

  const categories = ['Assignments', 'Projects', 'Workout', 'Daily Routine', 'Learning'];
  const priorities = ['High', 'Medium', 'Low'];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      const result = await createTask(formData);
      if (result.success) {
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      setError('Failed to create task');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Quick Add Task
            </h2>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            {/* Title Input */}
            <div className="mb-4">
              <input
                ref={inputRef}
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="What needs to be done?"
                className={`input ${error ? 'border-red-500' : ''}`}
                disabled={loading}
                autoFocus
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>

            {/* Quick Options */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input text-sm"
                  disabled={loading}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="input text-sm"
                  disabled={loading}
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="btn btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title.trim()}
                className="btn btn-primary text-sm disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="spinner mr-2" />
                    Adding...
                  </div>
                ) : (
                  'Add Task'
                )}
              </button>
            </div>
          </form>

          {/* Instructions */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Enter</kbd> to add task
              or <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Escape</kbd> to cancel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAdd;
