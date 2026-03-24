import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  X,
  Calendar,
  Clock,
  Tag,
  ChevronDown,
  Save,
  Trash2,
  SlidersHorizontal,
} from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { format, subDays, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

const AdvancedSearch = ({ onSearch, onFilter }) => {
  const { tasks } = useTask();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedFilters, setSavedFilters] = useState([]);
  
  const [filters, setFilters] = useState({
    // Text search
    title: '',
    description: '',
    
    // Basic filters
    category: '',
    priority: '',
    status: '',
    isRecurring: '',
    
    // Date filters
    dueDateFrom: '',
    dueDateTo: '',
    createdFrom: '',
    createdTo: '',
    completedFrom: '',
    completedTo: '',
    
    // Advanced filters
    tags: [],
    estimatedTimeMin: '',
    estimatedTimeMax: '',
    difficulty: '',
    hasSubtasks: '',
    subtaskStatus: '',
    
    // Sorting
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const categories = ['Assignments', 'Projects', 'Workout', 'Daily Routine', 'Learning'];
  const priorities = ['High', 'Medium', 'Low'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const statuses = [
    { value: '', label: 'All' },
    { value: 'true', label: 'Completed' },
    { value: 'false', label: 'Pending' },
  ];

  const hasSubtasksOptions = [
    { value: '', label: 'All' },
    { value: 'true', label: 'With Subtasks' },
    { value: 'false', label: 'Without Subtasks' },
  ];

  const subtaskStatusOptions = [
    { value: '', label: 'All' },
    { value: 'all_complete', label: 'All Subtasks Complete' },
    { value: 'some_complete', label: 'Some Subtasks Complete' },
    { value: 'none_complete', label: 'No Subtasks Complete' },
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Created Date' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'title', label: 'Title' },
    { value: 'estimatedTime', label: 'Estimated Time' },
    { value: 'difficulty', label: 'Difficulty' },
  ];

  useEffect(() => {
    // Load saved filters from localStorage
    const saved = localStorage.getItem('savedFilters');
    if (saved) {
      setSavedFilters(JSON.parse(saved));
    }
  }, []);

  // Get all unique tags from tasks
  const getAllTags = () => {
    const tagSet = new Set();
    tasks.forEach(task => {
      if (task.tags) {
        task.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    
    // Apply filters immediately for real-time search
    if (onFilter) {
      onFilter(newFilters);
    }
  };

  const handleSearch = () => {
    const searchCriteria = {
      query: searchQuery,
      filters,
    };
    
    if (onSearch) {
      onSearch(searchCriteria);
    }
  };

  const clearFilters = () => {
    const emptyFilters = {
      title: '',
      description: '',
      category: '',
      priority: '',
      status: '',
      isRecurring: '',
      dueDateFrom: '',
      dueDateTo: '',
      createdFrom: '',
      createdTo: '',
      completedFrom: '',
      completedTo: '',
      tags: [],
      estimatedTimeMin: '',
      estimatedTimeMax: '',
      difficulty: '',
      hasSubtasks: '',
      subtaskStatus: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    
    setFilters(emptyFilters);
    setSearchQuery('');
    
    if (onFilter) {
      onFilter(emptyFilters);
    }
  };

  const saveFilter = () => {
    const filterName = prompt('Enter a name for this filter:');
    if (!filterName) return;

    const newFilter = {
      id: Date.now(),
      name: filterName,
      filters: { ...filters },
      searchQuery,
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem('savedFilters', JSON.stringify(updated));
  };

  const loadSavedFilter = (savedFilter) => {
    setFilters(savedFilter.filters);
    setSearchQuery(savedFilter.searchQuery || '');
    
    if (onFilter) {
      onFilter(savedFilter.filters);
    }
  };

  const deleteSavedFilter = (filterId) => {
    const updated = savedFilters.filter(f => f.id !== filterId);
    setSavedFilters(updated);
    localStorage.setItem('savedFilters', JSON.stringify(updated));
  };

  const setQuickDateRange = (range) => {
    const now = new Date();
    let fromDate, toDate;

    switch (range) {
      case 'today':
        fromDate = toDate = now;
        break;
      case 'tomorrow':
        fromDate = toDate = addDays(now, 1);
        break;
      case 'this_week':
        fromDate = startOfWeek(now);
        toDate = endOfWeek(now);
        break;
      case 'next_week':
        fromDate = addDays(startOfWeek(now), 7);
        toDate = addDays(endOfWeek(now), 7);
        break;
      case 'this_month':
        fromDate = startOfMonth(now);
        toDate = endOfMonth(now);
        break;
      case 'overdue':
        toDate = subDays(now, 1);
        fromDate = new Date(2000, 0, 1); // Very old date
        break;
      default:
        return;
    }

    handleFilterChange('dueDateFrom', format(fromDate, 'yyyy-MM-dd'));
    handleFilterChange('dueDateTo', format(toDate, 'yyyy-MM-dd'));
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== '' && value !== null && value !== undefined;
  });

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== null && value !== undefined;
    }).length;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="input pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSearch}
            className="btn btn-primary flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </button>
          
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`btn flex items-center ${hasActiveFilters ? 'btn-primary' : 'btn-secondary'}`}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Advanced
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-1 text-xs bg-white dark:bg-gray-700 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn btn-secondary flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          {/* Saved Filters */}
          {savedFilters.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Saved Filters
              </label>
              <div className="flex flex-wrap gap-2">
                {savedFilters.map(filter => (
                  <div
                    key={filter.id}
                    className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                  >
                    <button
                      onClick={() => loadSavedFilter(filter)}
                      className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600"
                    >
                      {filter.name}
                    </button>
                    <button
                      onClick={() => deleteSavedFilter(filter.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filter Actions */}
          <div className="flex justify-end mb-4 space-x-2">
            <button
              onClick={saveFilter}
              className="btn btn-secondary flex items-center text-sm"
            >
              <Save className="w-3 h-3 mr-1" />
              Save Filter
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Text Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title Contains
              </label>
              <input
                type="text"
                value={filters.title}
                onChange={(e) => handleFilterChange('title', e.target.value)}
                className="input"
                placeholder="Search in title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description Contains
              </label>
              <input
                type="text"
                value={filters.description}
                onChange={(e) => handleFilterChange('description', e.target.value)}
                className="input"
                placeholder="Search in description..."
              />
            </div>

            {/* Basic Filters */}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="input"
              >
                <option value="">All Difficulties</option>
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>

            {/* Date Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date From
              </label>
              <input
                type="date"
                value={filters.dueDateFrom}
                onChange={(e) => handleFilterChange('dueDateFrom', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date To
              </label>
              <input
                type="date"
                value={filters.dueDateTo}
                onChange={(e) => handleFilterChange('dueDateTo', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quick Date Range
              </label>
              <select
                onChange={(e) => setQuickDateRange(e.target.value)}
                className="input"
              >
                <option value="">Select range...</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="this_week">This Week</option>
                <option value="next_week">Next Week</option>
                <option value="this_month">This Month</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            {/* Advanced Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags
              </label>
              <select
                multiple
                value={filters.tags}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  handleFilterChange('tags', selected);
                }}
                className="input"
                size={3}
              >
                {getAllTags().map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Has Subtasks
              </label>
              <select
                value={filters.hasSubtasks}
                onChange={(e) => handleFilterChange('hasSubtasks', e.target.value)}
                className="input"
              >
                {hasSubtasksOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subtask Status
              </label>
              <select
                value={filters.subtaskStatus}
                onChange={(e) => handleFilterChange('subtaskStatus', e.target.value)}
                className="input"
              >
                {subtaskStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Time Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Est. Time (min)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.estimatedTimeMin}
                  onChange={(e) => handleFilterChange('estimatedTimeMin', e.target.value)}
                  className="input flex-1"
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.estimatedTimeMax}
                  onChange={(e) => handleFilterChange('estimatedTimeMax', e.target.value)}
                  className="input flex-1"
                  min="0"
                />
              </div>
            </div>

            {/* Sorting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="input"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="input"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
