import React, { useState } from 'react';
import {
  Check,
  X,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Repeat,
  MoreVertical,
} from 'lucide-react';
import { formatDate, getCategoryColor, getPriorityBorder, formatStreak } from '../utils/helpers';

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  const handleToggleComplete = () => {
    onToggleComplete(task._id);
    setShowActions(false);
  };

  const handleEdit = () => {
    onEdit(task);
    setShowActions(false);
  };

  const handleDelete = () => {
    onDelete(task._id);
    setShowActions(false);
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted;

  return (
    <div className={`card task-enter ${getPriorityBorder(task.priority)} ${task.isCompleted ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Checkbox */}
          <button
            onClick={handleToggleComplete}
            className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              task.isCompleted
                ? 'bg-primary-600 border-primary-600 text-white'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
            }`}
          >
            {task.isCompleted && <Check className="w-3 h-3" />}
          </button>

          {/* Task content */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-medium text-gray-900 dark:text-white ${
              task.isCompleted ? 'line-through' : ''
            }`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Metadata */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              {/* Category */}
              <span className={`px-2 py-1 rounded-full font-medium ${getCategoryColor(task.category)}`}>
                {task.category}
              </span>

              {/* Priority */}
              <span className={`px-2 py-1 rounded-full font-medium border ${
                task.priority === 'High' 
                  ? 'text-red-600 bg-red-50 border-red-200'
                  : task.priority === 'Medium'
                  ? 'text-yellow-600 bg-yellow-50 border-yellow-200'
                  : 'text-green-600 bg-green-50 border-green-200'
              }`}>
                {task.priority}
              </span>

              {/* Due date */}
              {task.dueDate && (
                <span className={`flex items-center px-2 py-1 rounded-full font-medium ${
                  isOverdue
                    ? 'text-red-600 bg-red-50 border border-red-200'
                    : 'text-gray-600 bg-gray-50 border border-gray-200'
                }`}>
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(task.dueDate)}
                </span>
              )}

              {/* Recurring indicator */}
              {task.isRecurring && (
                <span className="flex items-center px-2 py-1 rounded-full font-medium text-blue-600 bg-blue-50 border border-blue-200">
                  <Repeat className="w-3 h-3 mr-1" />
                  Daily
                  {task.streak > 0 && (
                    <span className="ml-1">{formatStreak(task.streak)}</span>
                  )}
                </span>
              )}

              {/* Completed time */}
              {task.isCompleted && task.completedAt && (
                <span className="flex items-center text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(task.completedAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showActions && (
            <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <div className="py-1">
                <button
                  onClick={handleToggleComplete}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {task.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                </button>
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close actions */}
      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
};

export default TaskCard;
