import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Link, Clock, Tag, Target, ChevronDown } from 'lucide-react';
import { useTask } from '../context/TaskContext';

const EnhancedTaskForm = ({ task = null, onClose, onSuccess }) => {
  const { createTask, updateTask, tasks, loading } = useTask();
  
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    category: task?.category || 'Assignments',
    priority: task?.priority || 'Medium',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    isRecurring: task?.isRecurring || false,
    tags: task?.tags || [],
    estimatedTime: task?.estimatedTime || '',
    difficulty: task?.difficulty || 'Medium',
    subtasks: task?.subtasks || [],
    dependencies: task?.dependencies || [],
  });

  const [newSubtask, setNewSubtask] = useState('');
  const [newTag, setNewTag] = useState('');
  const [showDependencySelector, setShowDependencySelector] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Assignments', 'Projects', 'Workout', 'Daily Routine', 'Learning'];
  const priorities = ['High', 'Medium', 'Low'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setFormData(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, { title: newSubtask.trim(), isCompleted: false }]
      }));
      setNewSubtask('');
    }
  };

  const handleRemoveSubtask = (index) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index)
    }));
  };

  const handleToggleSubtask = (index) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map((subtask, i) => 
        i === index ? { ...subtask, isCompleted: !subtask.isCompleted } : subtask
      )
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddDependency = (taskId) => {
    if (!formData.dependencies.includes(taskId)) {
      setFormData(prev => ({
        ...prev,
        dependencies: [...prev.dependencies, taskId]
      }));
    }
    setShowDependencySelector(false);
  };

  const handleRemoveDependency = (taskId) => {
    setFormData(prev => ({
      ...prev,
      dependencies: prev.dependencies.filter(dep => dep !== taskId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      const taskData = {
        ...formData,
        estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : undefined,
      };

      let result;
      if (task) {
        result = await updateTask(task._id, taskData);
      } else {
        result = await createTask(taskData);
      }

      if (result.success) {
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      setError('Failed to save task');
    }
  };

  const availableTasks = tasks.filter(t => 
    t._id !== task?._id && 
    !formData.dependencies.includes(t._id) &&
    !t.dependencies.includes(task?._id)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-md">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="input"
                      placeholder="Enter task title"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="input"
                      placeholder="Enter task description"
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category
                      </label>
                      <select name="category" value={formData.category} onChange={handleChange} className="input" disabled={loading}>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Priority
                      </label>
                      <select name="priority" value={formData.priority} onChange={handleChange} className="input" disabled={loading}>
                        {priorities.map(priority => (
                          <option key={priority} value={priority}>{priority}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Difficulty
                      </label>
                      <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="input" disabled={loading}>
                        {difficulties.map(difficulty => (
                          <option key={difficulty} value={difficulty}>{difficulty}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="input"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Estimated Time (minutes)
                      </label>
                      <input
                        type="number"
                        name="estimatedTime"
                        value={formData.estimatedTime}
                        onChange={handleChange}
                        min="1"
                        max="480"
                        className="input"
                        placeholder="60"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isRecurring"
                      id="isRecurring"
                      checked={formData.isRecurring}
                      onChange={handleChange}
                      className="mr-2"
                      disabled={loading}
                    />
                    <label htmlFor="isRecurring" className="text-sm text-gray-700 dark:text-gray-300">
                      Daily recurring task
                    </label>
                  </div>
                </div>
              </div>

              {/* Subtasks */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Subtasks
                </h3>
                <div className="space-y-2">
                  {formData.subtasks.map((subtask, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <input
                        type="checkbox"
                        checked={subtask.isCompleted}
                        onChange={() => handleToggleSubtask(index)}
                        className="rounded"
                        disabled={loading}
                      />
                      <span className={`flex-1 ${subtask.isCompleted ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                        {subtask.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(index)}
                        className="p-1 text-red-500 hover:text-red-700"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                      className="input flex-1"
                      placeholder="Add a subtask"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={handleAddSubtask}
                      className="btn btn-secondary"
                      disabled={loading || !newSubtask.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Tags
                </h3>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-primary-600 hover:text-primary-800"
                          disabled={loading}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="input flex-1"
                      placeholder="Add a tag"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="btn btn-secondary"
                      disabled={loading || !newTag.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Dependencies */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Link className="w-5 h-5 mr-2" />
                  Dependencies
                </h3>
                <div className="space-y-2">
                  {formData.dependencies.map(depId => {
                    const depTask = tasks.find(t => t._id === depId);
                    return depTask ? (
                      <div key={depId} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm text-gray-900 dark:text-white">{depTask.title}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDependency(depId)}
                          className="p-1 text-red-500 hover:text-red-700"
                          disabled={loading}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : null;
                  })}
                  
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowDependencySelector(!showDependencySelector)}
                      className="btn btn-secondary w-full flex items-center justify-center"
                      disabled={loading || availableTasks.length === 0}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Dependency
                    </button>
                    
                    {showDependencySelector && availableTasks.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {availableTasks.map(task => (
                          <button
                            key={task._id}
                            type="button"
                            onClick={() => handleAddDependency(task._id)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {task.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title.trim()}
                className="btn btn-primary"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="spinner mr-2" />
                    {task ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  task ? 'Update Task' : 'Create Task'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTaskForm;
