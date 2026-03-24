class NotificationService {
  constructor() {
    this.notifications = [];
    this.settings = {};
    this.intervalId = null;
    this.loadSettings();
  }

  loadSettings() {
    const saved = localStorage.getItem('notificationSettings');
    this.settings = saved ? JSON.parse(saved) : {
      taskReminders: true,
      dueDateReminders: true,
      dailySummary: true,
      weeklyReport: true,
      reminderTime: '09:00',
      soundEnabled: true,
      desktopNotifications: true,
    };
  }

  // Request notification permission
  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Show desktop notification
  showDesktopNotification(title, message, options = {}) {
    if (!this.settings.desktopNotifications) return;

    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        tag: options.tag || Date.now(),
        requireInteraction: options.requireInteraction || false,
        ...options,
      });

      if (this.settings.soundEnabled) {
        this.playNotificationSound();
      }

      if (options.autoClose !== false) {
        setTimeout(() => notification.close(), 5000);
      }

      return notification;
    }
  }

  // Play notification sound
  playNotificationSound() {
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore errors
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  }

  // Add notification to the notification center
  addNotification(type, title, message, data = {}) {
    const notification = {
      id: Date.now(),
      type,
      title,
      message,
      data,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Save to localStorage for the notification center
    const existing = JSON.parse(localStorage.getItem('notifications') || '[]');
    existing.unshift(notification);
    localStorage.setItem('notifications', JSON.stringify(existing.slice(0, 100))); // Keep only last 100

    // Show desktop notification
    this.showDesktopNotification(title, message, {
      tag: notification.id,
      type: type.replace('_', '-'),
    });

    // Trigger custom event for React components
    window.dispatchEvent(new CustomEvent('notification', {
      detail: notification
    }));

    return notification;
  }

  // Check for due tasks and send reminders
  checkDueTasks(tasks) {
    if (!this.settings.taskReminders && !this.settings.dueDateReminders) return;

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    tasks.forEach(task => {
      if (task.isCompleted) return;

      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60);

        // Due today or overdue
        if (this.settings.dueDateReminders && hoursUntilDue <= 24 && hoursUntilDue > 0) {
          const lastNotified = localStorage.getItem(`due_notified_${task._id}`);
          const nowStr = now.toDateString();
          
          if (lastNotified !== nowStr) {
            this.addNotification(
              'due_date',
              `Task Due Today: ${task.title}`,
              `Your task "${task.title}" is due today at ${dueDate.toLocaleTimeString()}`,
              { taskId: task._id }
            );
            localStorage.setItem(`due_notified_${task._id}`, nowStr);
          }
        }

        // Overdue
        if (this.settings.dueDateReminders && hoursUntilDue < 0) {
          const lastNotified = localStorage.getItem(`overdue_notified_${task._id}`);
          const nowStr = now.toDateString();
          
          if (lastNotified !== nowStr) {
            this.addNotification(
              'due_date',
              `Task Overdue: ${task.title}`,
              `Your task "${task.title}" was due on ${dueDate.toLocaleDateString()}`,
              { taskId: task._id }
            );
            localStorage.setItem(`overdue_notified_${task._id}`, nowStr);
          }
        }
      }
    });
  }

  // Send daily summary
  sendDailySummary(tasks) {
    if (!this.settings.dailySummary) return;

    const today = new Date().toDateString();
    const lastSent = localStorage.getItem('daily_summary_sent');
    
    if (lastSent === today) return;

    const todayTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === today;
    });

    const completedToday = todayTasks.filter(t => t.isCompleted).length;
    const totalToday = todayTasks.length;

    this.addNotification(
      'daily_summary',
      'Daily Task Summary',
      `You have ${completedToday}/${totalToday} tasks completed today. ${totalToday - completedToday > 0 ? `${totalToday - completedToday} remaining.` : 'Great job!'}`,
      { type: 'summary', stats: { completed: completedToday, total: totalToday } }
    );

    localStorage.setItem('daily_summary_sent', today);
  }

  // Send weekly report
  sendWeeklyReport(tasks) {
    if (!this.settings.weeklyReport) return;

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekStartStr = weekStart.toDateString();
    
    const lastSent = localStorage.getItem('weekly_report_sent');
    if (lastSent === weekStartStr) return;

    const weekTasks = tasks.filter(task => {
      if (!task.createdAt) return false;
      const taskDate = new Date(task.createdAt);
      return taskDate >= weekStart;
    });

    const completedWeek = weekTasks.filter(t => t.isCompleted).length;
    const totalWeek = weekTasks.length;
    const completionRate = totalWeek > 0 ? Math.round((completedWeek / totalWeek) * 100) : 0;

    this.addNotification(
      'daily_summary',
      'Weekly Productivity Report',
      `This week: ${completedWeek}/${totalWeek} tasks completed (${completionRate}% completion rate). Keep up the great work!`,
      { type: 'weekly_report', stats: { completed: completedWeek, total: totalWeek, rate: completionRate } }
    );

    localStorage.setItem('weekly_report_sent', weekStartStr);
  }

  // Start the notification service
  start(tasks = []) {
    // Check for due tasks every hour
    this.intervalId = setInterval(() => {
      this.checkDueTasks(tasks);
    }, 60 * 60 * 1000);

    // Check immediately
    this.checkDueTasks(tasks);

    // Send daily summary at the configured time
    this.scheduleDailySummary();
    this.scheduleWeeklyReport(tasks);
  }

  // Stop the notification service
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Schedule daily summary
  scheduleDailySummary() {
    const [hours, minutes] = this.settings.reminderTime.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilScheduled = scheduledTime - now;

    setTimeout(() => {
      // This would be called from the component with current tasks
      window.dispatchEvent(new CustomEvent('daily-summary-due'));
      
      // Schedule next day
      this.scheduleDailySummary();
    }, timeUntilScheduled);
  }

  // Schedule weekly report (Sunday evening)
  scheduleWeeklyReport(tasks) {
    const now = new Date();
    const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + daysUntilSunday);
    nextSunday.setHours(20, 0, 0, 0); // 8 PM Sunday

    const timeUntilSunday = nextSunday - now;

    setTimeout(() => {
      this.sendWeeklyReport(tasks);
      
      // Schedule next week
      this.scheduleWeeklyReport(tasks);
    }, timeUntilSunday);
  }

  // Update settings
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
  }

  // Clear all notifications
  clearAllNotifications() {
    localStorage.setItem('notifications', '[]');
    window.dispatchEvent(new CustomEvent('notifications-cleared'));
  }

  // Mark notification as read
  markAsRead(notificationId) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem('notifications', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('notification-read', { detail: notificationId }));
  }

  // Get unread count
  getUnreadCount() {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    return notifications.filter(n => !n.read).length;
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
