import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Download,
  ChevronDown,
} from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Statistics = () => {
  const { tasks, stats, loading } = useTask();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'quarter', 'year'
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['Assignments', 'Projects', 'Workout', 'Daily Routine', 'Learning'];
  const priorities = ['High', 'Medium', 'Low'];

  const getFilteredTasks = () => {
    let filtered = [...tasks];
    
    // Filter by time range
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case 'week':
        startDate = startOfWeek(now);
        break;
      case 'month':
        startDate = startOfMonth(now);
        break;
      case 'quarter':
        startDate = subDays(now, 90);
        break;
      case 'year':
        startDate = subDays(now, 365);
        break;
      default:
        startDate = startOfWeek(now);
    }
    
    filtered = filtered.filter(task => {
      if (!task.createdAt) return false;
      return isWithinInterval(new Date(task.createdAt), { start: startDate, end: now });
    });
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(task => task.category === selectedCategory);
    }
    
    return filtered;
  };

  const calculateCompletionRate = (tasks) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.isCompleted).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const getTasksByCategory = (tasks) => {
    const categoryCount = {};
    tasks.forEach(task => {
      categoryCount[task.category] = (categoryCount[task.category] || 0) + 1;
    });
    return categoryCount;
  };

  const getTasksByPriority = (tasks) => {
    const priorityCount = { High: 0, Medium: 0, Low: 0 };
    tasks.forEach(task => {
      if (priorityCount[task.priority] !== undefined) {
        priorityCount[task.priority]++;
      }
    });
    return priorityCount;
  };

  const getCompletionTrend = (tasks) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayTasks = tasks.filter(task => {
        if (!task.completedAt) return false;
        const completedDate = new Date(task.completedAt);
        return completedDate.toDateString() === date.toDateString();
      });
      last7Days.push({
        date: format(date, 'EEE'),
        completed: dayTasks.length,
        total: tasks.filter(task => {
          if (!task.createdAt) return false;
          const createdDate = new Date(task.createdAt);
          return createdDate.toDateString() === date.toDateString();
        }).length,
      });
    }
    return last7Days;
  };

  // Chart data configurations
  const getCategoryChartData = () => {
    const filteredTasks = getFilteredTasks();
    const categoryData = getTasksByCategory(filteredTasks);
    
    return {
      labels: Object.keys(categoryData),
      datasets: [
        {
          data: Object.values(categoryData),
          backgroundColor: [
            '#3B82F6', // blue
            '#10B981', // green
            '#F59E0B', // yellow
            '#EF4444', // red
            '#8B5CF6', // purple
          ],
          borderWidth: 0,
        },
      ],
    };
  };

  const getPriorityChartData = () => {
    const filteredTasks = getFilteredTasks();
    const priorityData = getTasksByPriority(filteredTasks);
    
    return {
      labels: ['High', 'Medium', 'Low'],
      datasets: [
        {
          data: [priorityData.High, priorityData.Medium, priorityData.Low],
          backgroundColor: ['#EF4444', '#F59E0B', '#10B981'],
          borderWidth: 0,
        },
      ],
    };
  };

  const getCompletionTrendData = () => {
    const filteredTasks = getFilteredTasks();
    const trendData = getCompletionTrend(filteredTasks);
    
    return {
      labels: trendData.map(d => d.date),
      datasets: [
        {
          label: 'Completed',
          data: trendData.map(d => d.completed),
          borderColor: '#10B981',
          backgroundColor: '#10B98120',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Created',
          data: trendData.map(d => d.total),
          borderColor: '#3B82F6',
          backgroundColor: '#3B82F620',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const getAverageCompletionTime = (tasks) => {
    const completedTasks = tasks.filter(task => task.isCompleted && task.createdAt && task.completedAt);
    if (completedTasks.length === 0) return 0;
    
    const totalTime = completedTasks.reduce((sum, task) => {
      const created = new Date(task.createdAt);
      const completed = new Date(task.completedAt);
      return sum + (completed - created);
    }, 0);
    
    return Math.round(totalTime / completedTasks.length / (1000 * 60 * 60)); // in hours
  };

  const exportStats = () => {
    const filteredTasks = getFilteredTasks();
    const statsData = {
      user: user?.username,
      timeRange,
      category: selectedCategory,
      generatedAt: new Date().toISOString(),
      summary: {
        totalTasks: filteredTasks.length,
        completedTasks: filteredTasks.filter(t => t.isCompleted).length,
        completionRate: calculateCompletionRate(filteredTasks),
        averageCompletionTime: getAverageCompletionTime(filteredTasks),
      },
      tasksByCategory: getTasksByCategory(filteredTasks),
      tasksByPriority: getTasksByPriority(filteredTasks),
      completionTrend: getCompletionTrend(tasks),
    };
    
    const blob = new Blob([JSON.stringify(statsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-manager-stats-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
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

  const filteredTasks = getFilteredTasks();
  const completionRate = calculateCompletionRate(filteredTasks);
  const tasksByCategory = getTasksByCategory(filteredTasks);
  const tasksByPriority = getTasksByPriority(filteredTasks);
  const completionTrend = getCompletionTrend(tasks);
  const avgCompletionTime = getAverageCompletionTime(filteredTasks);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Statistics & Analytics
          </h1>
          <button
            onClick={exportStats}
            className="btn btn-secondary flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Stats
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input text-sm"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Tasks
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredTasks.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {timeRange}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-300" />
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
                {filteredTasks.filter(t => t.isCompleted).length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {completionRate}% completion rate
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg. Completion Time
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {avgCompletionTime}h
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Per task
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Productivity Score
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(completionRate * 0.7 + (filteredTasks.length > 0 ? (filteredTasks.filter(t => t.isCompleted).length / filteredTasks.length) * 30 : 0))}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Out of 100
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tasks by Category
            </h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64">
            <Doughnut
              data={getCategoryChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#4B5563',
                      padding: 15,
                      font: {
                        size: 12
                      }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tasks by Priority
            </h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64">
            <Bar
              data={getPriorityChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.label}: ${context.parsed.y} tasks`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                      color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#4B5563'
                    },
                    grid: {
                      color: document.documentElement.classList.contains('dark') ? '#374151' : '#E5E7EB'
                    }
                  },
                  x: {
                    ticks: {
                      color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#4B5563'
                    },
                    grid: {
                      display: false
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Completion Trend */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            7-Day Completion Trend
          </h3>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        <div className="h-64">
          <Line
            data={getCompletionTrendData()}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#4B5563',
                    padding: 15,
                    font: {
                      size: 12
                    }
                  }
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `${context.dataset.label}: ${context.parsed.y} tasks`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#4B5563'
                  },
                  grid: {
                    color: document.documentElement.classList.contains('dark') ? '#374151' : '#E5E7EB'
                  }
                },
                x: {
                  ticks: {
                    color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#4B5563'
                  },
                  grid: {
                    display: false
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
