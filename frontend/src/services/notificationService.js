class NotificationService {
  constructor() {
    this.isSupported = 'Notification' in window;
    this.permission = 'default';
  }

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported) {
      console.warn('Notifications are not supported in this browser');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.permission = 'granted';
      return true;
    }

    if (Notification.permission === 'denied') {
      this.permission = 'denied';
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Show a notification
  showNotification(title, options = {}) {
    if (!this.isSupported || this.permission !== 'granted') {
      return false;
    }

    const defaultOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'task-notification',
      requireInteraction: false,
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);
      
      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle click
      notification.onclick = () => {
        window.focus();
        notification.close();
        if (options.onClick) {
          options.onClick();
        }
      };

      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  }

  // Task-related notifications
  notifyTaskCreated(task) {
    this.showNotification('Task Created', {
      body: `"${task.title}" has been added to your tasks`,
      icon: '/icons/task-created.png'
    });
  }

  notifyTaskCompleted(task) {
    this.showNotification('Task Completed! 🎉', {
      body: `Great job! You completed "${task.title}"`,
      icon: '/icons/task-completed.png'
    });
  }

  notifyTaskDue(task) {
    this.showNotification('Task Due Soon', {
      body: `"${task.title}" is due soon`,
      icon: '/icons/task-due.png',
      requireInteraction: true
    });
  }

  notifyTaskOverdue(task) {
    this.showNotification('Task Overdue', {
      body: `"${task.title}" is overdue!`,
      icon: '/icons/task-overdue.png',
      requireInteraction: true
    });
  }

  notifyStreak(streak) {
    this.showNotification(`${streak} Day Streak! 🔥`, {
      body: `Amazing! You've completed tasks for ${streak} consecutive days!`,
      icon: '/icons/streak.png'
    });
  }

  // Schedule notifications for due tasks
  scheduleDueTaskNotifications(tasks) {
    tasks.forEach(task => {
      if (task.isCompleted || !task.dueDate) return;

      const dueDate = new Date(task.dueDate);
      const now = new Date();
      const timeUntilDue = dueDate - now;

      // Notify 1 hour before due
      if (timeUntilDue > 0 && timeUntilDue <= 60 * 60 * 1000) {
        this.notifyTaskDue(task);
      }

      // Notify if overdue
      if (timeUntilDue < 0) {
        this.notifyTaskOverdue(task);
      }
    });
  }

  // Get current permission status
  getPermissionStatus() {
    return this.permission;
  }

  // Check if notifications are supported
  isNotificationSupported() {
    return this.isSupported;
  }
}

export default new NotificationService();
