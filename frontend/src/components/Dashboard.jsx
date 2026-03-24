import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Calendar,
  TrendingUp,
  Plus,
  Target,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import { getGreeting } from '../utils/helpers';
import TaskForm from './TaskForm';

const Dashboard = () => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const { user } = useAuth();
  const { tasks, stats, todayTasks, upcomingTasks } = useTask();

  // Ensure user is always available for display
  const displayUser = user || { username: 'User', email: 'user@example.com' };

  // Calculate streak counter
  const calculateStreak = () => {
    if (!tasks || tasks.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < 365; i++) {
      const dayStart = new Date(currentDate);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      const hasCompletedTask = tasks.some(task => {
        if (!task.isCompleted || !task.completedAt) return false;
        const completedDate = new Date(task.completedAt);
        return completedDate >= dayStart && completedDate <= dayEnd;
      });
      
      if (hasCompletedTask) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const streak = calculateStreak();

  // Derive counts from stats (API) or fall back to local task arrays
  const todayCount = stats?.todayTasks ?? todayTasks?.length ?? 0;
  const completedCount = stats?.completedTasks ?? tasks?.filter(t => t.isCompleted).length ?? 0;
  const upcomingCount = stats?.pendingTasks ?? upcomingTasks?.length ?? 0;

  const quickAddTask = () => {
    setShowTaskForm(true);
  };

  const handleTaskFormClose = () => {
    setShowTaskForm(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {getGreeting()}, {displayUser?.username || 'User'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to your personal task manager. Let's get productive!
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Today's Tasks
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {todayCount}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <CheckSquare className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedCount}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {upcomingCount}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Streak
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {streak} {streak === 1 ? 'day' : 'days'} 🔥
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Keep it going!
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Target className="w-6 h-6 text-orange-600 dark:text-orange-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Welcome / CTA Card */}
      <div className="card text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="w-8 h-8 text-blue-600 dark:text-blue-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Ready to get started?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first task and start organizing your day.
          </p>
          <button
            onClick={quickAddTask}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Task
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Link to="/tasks" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <CheckSquare className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Manage Tasks</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View and manage all your tasks</p>
            </div>
          </div>
        </Link>

        <Link to="/calendar" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Calendar View</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">See your tasks on calendar</p>
            </div>
          </div>
        </Link>

        <Link to="/statistics" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Statistics</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View your productivity stats</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          onClose={handleTaskFormClose}
          onSuccess={() => {
            setShowTaskForm(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
