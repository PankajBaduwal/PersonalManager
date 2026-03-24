import { format, isToday, isTomorrow, isPast, isThisWeek, addDays } from 'date-fns';

// Format date for display
export const formatDate = (date) => {
  if (!date) return 'No due date';
  
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) return 'Today';
  if (isTomorrow(dateObj)) return 'Tomorrow';
  if (isPast(dateObj) && !isToday(dateObj)) return 'Overdue';
  
  return format(dateObj, 'MMM d, yyyy');
};

// Get priority color
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'Medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'Low':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// Get category color
export const getCategoryColor = (category) => {
  switch (category) {
    case 'Assignments':
      return 'category-assignments';
    case 'Projects':
      return 'category-projects';
    case 'Workout':
      return 'category-workout';
    case 'Daily Routine':
      return 'category-daily-routine';
    case 'Learning':
      return 'category-learning';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Get priority border class
export const getPriorityBorder = (priority) => {
  switch (priority) {
    case 'High':
      return 'priority-high';
    case 'Medium':
      return 'priority-medium';
    case 'Low':
      return 'priority-low';
    default:
      return '';
  }
};

// Calculate completion percentage
export const calculateCompletionRate = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

// Format streak display
export const formatStreak = (streak) => {
  if (streak === 0) return 'No streak';
  if (streak === 1) return '1 day 🔥';
  return `${streak} days 🔥`;
};

// Get greeting based on time of day
export const getGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

// Check if date is overdue
export const isOverdue = (date) => {
  if (!date) return false;
  return isPast(new Date(date)) && !isToday(new Date(date));
};

// Get tasks for today
export const getTodayTasks = (tasks) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    return taskDate >= today && taskDate < tomorrow;
  });
};

// Get upcoming tasks (next 7 days)
export const getUpcomingTasks = (tasks) => {
  const today = new Date();
  const nextWeek = addDays(today, 7);

  return tasks.filter(task => {
    if (!task.dueDate || task.isCompleted) return false;
    const taskDate = new Date(task.dueDate);
    return taskDate >= today && taskDate <= nextWeek;
  });
};

// Sort tasks by priority
export const sortTasksByPriority = (tasks) => {
  const priorityOrder = { High: 0, Medium: 1, Low: 2 };
  return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
};

// Sort tasks by due date
export const sortTasksByDueDate = (tasks) => {
  return tasks.sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
};
