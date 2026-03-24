import React, { useState } from 'react';
import {
  CheckSquare,
  Calendar,
  Clock,
  AlertCircle,
  MoreVertical,
  Edit,
  Trash2,
  Link,
  Target,
  Tag,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { formatDate, getPriorityColor, getCategoryColor } from '../utils/helpers';
import EnhancedTaskForm from './EnhancedTaskForm';

const EnhancedTaskCard = ({ task }) => {
  const { toggleTaskComplete, deleteTask } = useTask();
  const [showActions, setShowActions] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);

  const handleToggleComplete = async (e) => {
    e.stopPropagation();
    await toggleTaskComplete(task._id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowTaskForm(true);
    setShowActions(false);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task._id);
    }
    setShowActions(false);
  };

  const handleToggleSubtask = async (subtaskId) => {
    // This would need to be implemented in the backend
    console.log('Toggle subtask:', subtaskId);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 dark:text-green-400';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'Hard': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getSubtaskCompletionPercentage = () => {
    if (task.subtasks?.length === 0) return 100;
    const completed = task.subtasks?.filter(subtask => subtask.isCompleted).length || 0;
    return Math.round((completed / task.subtasks.length) * 100);
  };

  return (
    <>
      <div className="card hover:shadow-md transition-shadow cursor-pointer">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-3 flex-1">
              <button
                onClick={handleToggleComplete}
                className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  task.isCompleted
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
                }`}
              >
                {task.isCompleted && (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-gray-900 dark:text-white ${
                  task.isCompleted ? 'line-through opacity-75' : ''
                }`}>
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>
            </div>

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Actions Dropdown */}
              {showActions && (
                <div className="absolute right-0 z-10 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(task.category)}`}>
              {task.category}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)} text-white`}>
              {task.priority}
            </span>
            {task.difficulty && (
              <span className={`text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
                {task.difficulty}
              </span>
            )}
            {task.estimatedTime && (
              <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                {task.estimatedTime}m
              </span>
            )}
            {task.dueDate && (
              <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(task.dueDate)}
              </span>
            )}
            {task.isRecurring && (
              <span className="text-xs text-blue-600 dark:text-blue-400">
                Daily
              </span>
            )}
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Dependencies */}
          {task.dependencies && task.dependencies.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                <Link className="w-3 h-3 mr-1" />
                Depends on {task.dependencies.length} task(s)
              </div>
            </div>
          )}

          {/* Subtasks */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSubtasks(!showSubtasks);
                }}
                className="flex items-center justify-between w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Subtasks ({task.subtasks.filter(st => st.isCompleted).length}/{task.subtasks.length})
                </div>
                {showSubtasks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Progress Bar */}
              <div className="mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getSubtaskCompletionPercentage()}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {getSubtaskCompletionPercentage()}% complete
                </p>
              </div>

              {/* Subtasks List */}
              {showSubtasks && (
                <div className="mt-3 space-y-2">
                  {task.subtasks.map((subtask, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={subtask.isCompleted}
                        onChange={() => handleToggleSubtask(subtask._id || index)}
                        className="rounded"
                      />
                      <span className={`text-sm flex-1 ${
                        subtask.isCompleted ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'
                      }`}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Task Form Modal */}
      {showTaskForm && (
        <EnhancedTaskForm
          task={task}
          onClose={() => setShowTaskForm(false)}
          onSuccess={() => {
            setShowTaskForm(false);
            // Tasks will be automatically updated via context
          }}
        />
      )}
    </>
  );
};

export default EnhancedTaskCard;
