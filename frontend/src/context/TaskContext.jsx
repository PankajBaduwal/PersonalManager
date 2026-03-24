import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { getTodayTasks, getUpcomingTasks } from '../utils/helpers';
import notificationService from '../services/notificationService';

// Initial state
const initialState = {
  tasks: [],
  todayTasks: [],
  upcomingTasks: [],
  stats: null,
  loading: false,
  error: null,
  filters: {
    category: '',
    priority: '',
    isCompleted: '',
    isRecurring: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
};

// Action types
const TASK_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_TASKS: 'SET_TASKS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  SET_STATS: 'SET_STATS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  RESET_FILTERS: 'RESET_FILTERS',
};

// Reducer
const taskReducer = (state, action) => {
  switch (action.type) {
    case TASK_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case TASK_ACTIONS.SET_TASKS:
      return {
        ...state,
        tasks: action.payload.tasks,
        todayTasks: getTodayTasks(action.payload.tasks),
        upcomingTasks: getUpcomingTasks(action.payload.tasks),
        pagination: action.payload.pagination,
        loading: false,
        error: null,
      };
    case TASK_ACTIONS.ADD_TASK:
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        todayTasks: getTodayTasks([action.payload, ...state.tasks]),
        upcomingTasks: getUpcomingTasks([action.payload, ...state.tasks]),
        loading: false,
        error: null,
      };
    case TASK_ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        ),
        todayTasks: getTodayTasks(
          state.tasks.map(task =>
            task._id === action.payload._id ? action.payload : task
          )
        ),
        upcomingTasks: getUpcomingTasks(
          state.tasks.map(task =>
            task._id === action.payload._id ? action.payload : task
          )
        ),
        loading: false,
        error: null,
      };
    case TASK_ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload),
        todayTasks: state.todayTasks.filter(task => task._id !== action.payload),
        upcomingTasks: state.upcomingTasks.filter(task => task._id !== action.payload),
        loading: false,
        error: null,
      };
    case TASK_ACTIONS.SET_STATS:
      return {
        ...state,
        stats: action.payload,
        loading: false,
      };
    case TASK_ACTIONS.SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case TASK_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case TASK_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 },
      };
    case TASK_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };
    case TASK_ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filters: {
          category: '',
          priority: '',
          isCompleted: '',
          isRecurring: '',
          search: '',
          sortBy: 'createdAt',
          sortOrder: 'desc',
        },
        pagination: { ...state.pagination, page: 1 },
      };
    default:
      return state;
  }
};

// Create context
const TaskContext = createContext();

// Provider component
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Fetch tasks
  const fetchTasks = async (page = 1, filters = state.filters) => {
    dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const params = new URLSearchParams({
        page,
        limit: state.pagination.limit,
        ...filters,
      });

      const response = await api.get(`/tasks?${params}`);
      dispatch({
        type: TASK_ACTIONS.SET_TASKS,
        payload: response.data.data,
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tasks';
      dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: message });
      // Always set loading to false even on error
      dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await api.get('/tasks/stats');
      dispatch({
        type: TASK_ACTIONS.SET_STATS,
        payload: response.data.data,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Create task
  const createTask = async (taskData) => {
    dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await api.post('/tasks', taskData);
      const newTask = response.data.data.task;
      
      dispatch({
        type: TASK_ACTIONS.ADD_TASK,
        payload: newTask,
      });
      
      // Show notification for task creation
      notificationService.notifyTaskCreated(newTask);
      
      await fetchStats();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  // Update task
  const updateTask = async (id, taskData) => {
    dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      dispatch({
        type: TASK_ACTIONS.UPDATE_TASK,
        payload: response.data.data.task,
      });
      await fetchStats();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
    
    try {
      await api.delete(`/tasks/${id}`);
      dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: id });
      await fetchStats();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  // Toggle task completion
  const toggleTaskComplete = async (id) => {
    try {
      const response = await api.patch(`/tasks/${id}/toggle`);
      const updatedTask = response.data.data.task;
      
      dispatch({
        type: TASK_ACTIONS.UPDATE_TASK,
        payload: updatedTask,
      });
      
      // Show notification for task completion
      if (updatedTask.isCompleted) {
        notificationService.notifyTaskCompleted(updatedTask);
      }
      
      await fetchStats();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to toggle task';
      dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  // Set filters
  const setFilters = useCallback((filters) => {
    dispatch({ type: TASK_ACTIONS.SET_FILTERS, payload: filters });
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    dispatch({ type: TASK_ACTIONS.RESET_FILTERS });
  }, []);

  // Clear error
  const clearError = () => {
    dispatch({ type: TASK_ACTIONS.CLEAR_ERROR });
  };

  // Initial fetch
  useEffect(() => {
    fetchTasks();
    fetchStats();
    
    // Fallback: if loading takes too long, set it to false
    const timeout = setTimeout(() => {
      dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: false });
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(timeout);
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchTasks(state.pagination.page, state.filters);
  }, [state.filters.category, state.filters.priority, state.filters.isCompleted, state.filters.isRecurring, state.filters.search, state.filters.sortBy, state.filters.sortOrder, state.pagination.page]);

  const value = {
    ...state,
    fetchTasks,
    fetchStats,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    setFilters,
    resetFilters,
    clearError,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

// Hook to use task context
export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext;
