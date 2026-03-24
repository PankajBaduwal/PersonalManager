import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  X,
  Check,
} from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday, getDay, parseISO } from 'date-fns';
import TaskForm from './TaskForm';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'
  const { tasks, loading } = useTask();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = parseISO(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleAddTask = (date = null) => {
    setSelectedDate(date);
    setShowTaskForm(true);
  };

  const handleTaskFormClose = () => {
    setShowTaskForm(false);
    setSelectedDate(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Assignments': 'bg-blue-100 text-blue-800 border-blue-200',
      'Projects': 'bg-purple-100 text-purple-800 border-purple-200',
      'Workout': 'bg-green-100 text-green-800 border-green-200',
      'Daily Routine': 'bg-orange-100 text-orange-800 border-orange-200',
      'Learning': 'bg-pink-100 text-pink-800 border-pink-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Calendar
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                viewMode === 'week'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                viewMode === 'month'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
          {weekDays.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            const tasksForDay = getTasksForDate(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isDayToday = isToday(day);

            return (
              <div
                key={idx}
                onClick={() => handleDateClick(day)}
                className={`
                  min-h-[100px] p-2 border-r border-b border-gray-200 dark:border-gray-700 cursor-pointer
                  hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                  ${!isCurrentMonth ? 'bg-gray-50 dark:bg-gray-900 text-gray-400' : ''}
                  ${isSelected ? 'bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500' : ''}
                  ${isDayToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                `}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className={`
                    text-sm font-medium
                    ${isDayToday ? 'text-primary-600 dark:text-primary-400' : ''}
                    ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900 dark:text-white'}
                  `}>
                    {format(day, 'd')}
                  </span>
                  {tasksForDay.length > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {tasksForDay.length}
                    </span>
                  )}
                </div>

                {/* Tasks for the day */}
                <div className="space-y-1">
                  {tasksForDay.slice(0, 3).map(task => (
                    <div
                      key={task._id}
                      className="flex items-center space-x-1 text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                      <span className="truncate text-gray-700 dark:text-gray-300">
                        {task.title}
                      </span>
                      {task.isCompleted && (
                        <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                  {tasksForDay.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      +{tasksForDay.length - 3} more
                    </div>
                  )}
                </div>

                {/* Add task button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddTask(day);
                  }}
                  className="mt-1 w-full flex items-center justify-center p-1 text-xs text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
            <button
              onClick={() => handleAddTask(selectedDate)}
              className="btn btn-primary btn-sm flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Task
            </button>
          </div>

          <div className="space-y-3">
            {getTasksForDate(selectedDate).length > 0 ? (
              getTasksForDate(selectedDate).map(task => (
                <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                    <div>
                      <p className={`font-medium text-gray-900 dark:text-white ${task.isCompleted ? 'line-through opacity-75' : ''}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(task.category)}`}>
                          {task.category}
                        </span>
                        {task.isRecurring && (
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            Daily
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {task.isCompleted && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No tasks scheduled for this day
              </p>
            )}
          </div>
        </div>
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={{
            dueDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
          }}
          onClose={handleTaskFormClose}
          onSuccess={() => {
            // Tasks will be automatically updated via context
          }}
        />
      )}
    </div>
  );
};

export default Calendar;
