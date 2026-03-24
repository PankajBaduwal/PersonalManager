const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Assignments', 'Projects', 'Workout', 'Daily Routine', 'Learning'],
      message: 'Category must be one of: Assignments, Projects, Workout, Daily Routine, Learning'
    }
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: {
      values: ['High', 'Medium', 'Low'],
      message: 'Priority must be High, Medium, or Low'
    },
    default: 'Medium'
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  streak: {
    type: Number,
    default: 0,
    min: 0
  },
  completedAt: {
    type: Date
  },
  subtasks: [{
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Subtask title cannot exceed 200 characters']
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  dependents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  estimatedTime: {
    type: Number, // in minutes
    min: 1,
    max: 480 // 8 hours max
  },
  actualTime: {
    type: Number, // in minutes
    min: 0
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastCompletedDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
taskSchema.index({ user: 1, isCompleted: 1 });
taskSchema.index({ user: 1, category: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, dueDate: 1 });

// Method to reset daily recurring tasks
taskSchema.methods.resetIfRecurring = function() {
  if (this.isRecurring && this.isCompleted) {
    const today = new Date();
    const lastCompleted = this.lastCompletedDate;
    
    // Check if task was completed on a previous day
    if (lastCompleted) {
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const lastCompletedStart = new Date(lastCompleted.getFullYear(), lastCompleted.getMonth(), lastCompleted.getDate());
      
      if (lastCompletedStart < todayStart) {
        this.isCompleted = false;
        this.completedAt = null;
      }
    }
  }
  return this;
};

// Virtual for subtask completion percentage
taskSchema.virtual('subtaskCompletionPercentage').get(function() {
  if (this.subtasks.length === 0) return 100;
  const completed = this.subtasks.filter(subtask => subtask.isCompleted).length;
  return Math.round((completed / this.subtasks.length) * 100);
});

// Virtual for checking if task can be completed (all dependencies must be completed)
taskSchema.virtual('canBeCompleted').get(function() {
  return this.dependencies.length === 0; // Simplified for now
});

// Method to add subtask
taskSchema.methods.addSubtask = function(title) {
  this.subtasks.push({ title });
  return this.save();
};

// Method to toggle subtask
taskSchema.methods.toggleSubtask = function(subtaskId) {
  const subtask = this.subtasks.id(subtaskId);
  if (subtask) {
    subtask.isCompleted = !subtask.isCompleted;
    subtask.completedAt = subtask.isCompleted ? new Date() : undefined;
    
    // Auto-complete parent task if all subtasks are completed
    if (subtask.isCompleted && this.subtaskCompletionPercentage === 100) {
      this.isCompleted = true;
      this.completedAt = new Date();
    }
  }
  return this.save();
};

// Method to add dependency
taskSchema.methods.addDependency = function(dependencyId) {
  if (!this.dependencies.includes(dependencyId)) {
    this.dependencies.push(dependencyId);
  }
  return this.save();
};

// Method to remove dependency
taskSchema.methods.removeDependency = function(dependencyId) {
  this.dependencies = this.dependencies.filter(dep => !dep.equals(dependencyId));
  return this.save();
};

// Method to mark task as complete and update streak
taskSchema.methods.markComplete = function() {
  this.isCompleted = true;
  this.completedAt = new Date();
  
  if (this.isRecurring) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Update streak for recurring tasks
    if (this.lastCompletedDate) {
      const lastCompleted = new Date(this.lastCompletedDate.getFullYear(), this.lastCompletedDate.getMonth(), this.lastCompletedDate.getDate());
      const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
      
      if (lastCompleted.getTime() === yesterdayStart.getTime()) {
        this.streak += 1;
      } else if (lastCompleted < yesterdayStart) {
        this.streak = 1;
      }
    } else {
      this.streak = 1;
    }
    
    this.lastCompletedDate = today;
  }
  
  return this.save();
};

module.exports = mongoose.model('Task', taskSchema);
