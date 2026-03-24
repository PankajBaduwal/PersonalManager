import React, { useState, useCallback, useEffect } from 'react';
import { Search, Filter, Grid, List, ChevronDown, Settings } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import TaskCard from './TaskCard';
import EnhancedTaskCard from './EnhancedTaskCard';
import TaskForm from './TaskForm';
import EnhancedTaskForm from './EnhancedTaskForm';
import { debounce } from '../utils/helpers';

const TaskList = () => {
  const {
    tasks,
    loading,
    error,
    filters,
    pagination,
    setFilters,
    resetFilters,
    toggleTaskComplete,
    deleteTask,
    clearError,
  } = useTask();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [enhancedMode, setEnhancedMode] = useState(false);

  const categories = ['Assignments', 'Projects', 'Workout', 'Daily Routine', 'Learning'];
  const priorities = ['High', 'Medium', 'Low'];
  const completionStatus = [
    { value: '', label: 'All' },
    { value: 'true', label: 'Completed' },
    { value: 'false', label: 'Pending' },
  ];

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term) => {
      setFilters({ search: term });
    }, 300),
    [setFilters]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleFilterChange = (filterName, value) => {
    setFilters({ [filterName]: value });
  };

  const handleSortChange = (sortBy, sortOrder) => {
    setFilters({ sortBy, sortOrder });
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  const handleTaskFormClose = () => {
    setShowTaskForm(false);
    setSelectedTask(null);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    resetFilters();
  };

  const hasActiveFilters = searchTerm || filters.category || filters.priority || 
                          filters.isCompleted !== '' || filters.isRecurring !== '';

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-800">{error}</p>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your tasks and stay productive
            </p>
          </div>
          <button
            onClick={() => setEnhancedMode(!enhancedMode)}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              enhancedMode
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Settings className="w-4 h-4 mr-2" />
            {enhancedMode ? 'Enhanced' : 'Simple'}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'} flex items-center`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-600 text-xs rounded-full">
                Active
              </span>
            )}
          </button>

          {/* View mode toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="input"
                >
                  <option value="">All Priorities</option>
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={filters.isCompleted}
                  onChange={(e) => handleFilterChange('isCompleted', e.target.value)}
                  className="input"
                >
                  {completionStatus.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort By
                </label>
                <div className="relative">
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      handleSortChange(sortBy, sortOrder);
                    }}
                    className="input appearance-none pr-8"
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="dueDate-asc">Due Date (Earliest)</option>
                    <option value="dueDate-desc">Due Date (Latest)</option>
                    <option value="priority-desc">Priority (High to Low)</option>
                    <option value="priority-asc">Priority (Low to High)</option>
                    <option value="title-asc">Title (A-Z)</option>
                    <option value="title-desc">Title (Z-A)</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="mt-4">
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tasks */}
      <div className="mb-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tasks found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {hasActiveFilters 
                ? 'Try adjusting your filters or search terms'
                : 'Get started by creating your first task'
              }
            </p>
            {!hasActiveFilters && (
              <button
                onClick={() => setShowTaskForm(true)}
                className="btn btn-primary"
              >
                Create Task
              </button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-4'
          }>
            {tasks.map(task => (
              enhancedMode ? (
                <EnhancedTaskCard key={task._id} task={task} />
              ) : (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleComplete={toggleTaskComplete}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              )
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} tasks
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilters({ page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="btn btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
              {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => setFilters({ page: pagination.page + 1 })}
              disabled={pagination.page === pagination.pages}
              className="btn btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        enhancedMode ? (
          <EnhancedTaskForm
            task={selectedTask}
            onClose={handleTaskFormClose}
            onSuccess={() => {
              // Task will be automatically updated via context
            }}
          />
        ) : (
          <TaskForm
            task={selectedTask}
            onClose={handleTaskFormClose}
            onSuccess={() => {
              // Task will be automatically updated via context
            }}
          />
        )
      )}
    </div>
  );
};

export default TaskList;
