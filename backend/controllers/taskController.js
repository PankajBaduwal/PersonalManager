const Task = require('../models/Task');

// Get all tasks for a user
const getTasks = async (req, res) => {
  try {
    const {
      category,
      priority,
      isCompleted,
      isRecurring,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = { user: req.user._id };

    // Add filters
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (isCompleted !== undefined) query.isCompleted = isCompleted === 'true';
    if (isRecurring !== undefined) query.isRecurring = isRecurring === 'true';

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Reset recurring tasks if needed
    const tasks = await Task.find(query);
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    for (let task of tasks) {
      task.resetIfRecurring();
      if (task.isModified()) {
        await task.save();
      }
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const finalTasks = await Task.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        tasks: finalTasks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks',
      error: error.message
    });
  }
};

// Get single task
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Reset recurring task if needed
    task.resetIfRecurring();
    if (task.isModified()) {
      await task.save();
    }

    res.status(200).json({
      success: true,
      data: {
        task
      }
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching task',
      error: error.message
    });
  }
};

// Create new task
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      dueDate,
      isRecurring
    } = req.body;

    // Validate required fields
    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title and category are required'
      });
    }

    const task = new Task({
      title,
      description,
      category,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      isRecurring: isRecurring || false,
      user: req.user._id
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: {
        task
      }
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating task',
      error: error.message
    });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      dueDate,
      isCompleted,
      isRecurring
    } = req.body;

    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (category !== undefined) task.category = category;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (isRecurring !== undefined) task.isRecurring = isRecurring;

    // Handle completion
    if (isCompleted === true && !task.isCompleted) {
      await task.markComplete();
    } else if (isCompleted === false && task.isCompleted) {
      task.isCompleted = false;
      task.completedAt = null;
      await task.save();
    } else {
      await task.save();
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: {
        task
      }
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating task',
      error: error.message
    });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await Task.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting task',
      error: error.message
    });
  }
};

// Toggle task completion
const toggleTaskComplete = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (task.isCompleted) {
      task.isCompleted = false;
      task.completedAt = null;
      await task.save();
    } else {
      await task.markComplete();
    }

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.isCompleted ? 'complete' : 'incomplete'}`,
      data: {
        task
      }
    });
  } catch (error) {
    console.error('Toggle task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling task',
      error: error.message
    });
  }
};

// Get task statistics
const getTaskStats = async (req, res) => {
  try {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    // Total tasks
    const totalTasks = await Task.countDocuments({ user: req.user._id });

    // Completed tasks
    const completedTasks = await Task.countDocuments({ 
      user: req.user._id, 
      isCompleted: true 
    });

    // Pending tasks
    const pendingTasks = totalTasks - completedTasks;

    // Today's tasks
    const todayTasks = await Task.countDocuments({
      user: req.user._id,
      dueDate: {
        $gte: todayStart,
        $lt: todayEnd
      }
    });

    // Overdue tasks
    const overdueTasks = await Task.countDocuments({
      user: req.user._id,
      isCompleted: false,
      dueDate: { $lt: todayStart }
    });

    // Tasks by category
    const tasksByCategory = await Task.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Tasks by priority
    const tasksByPriority = await Task.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Completion rate
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Recurring tasks streak info
    const recurringTasks = await Task.find({
      user: req.user._id,
      isRecurring: true
    }).select('title streak lastCompletedDate');

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        pendingTasks,
        todayTasks,
        overdueTasks,
        completionRate,
        tasksByCategory,
        tasksByPriority,
        recurringTasks
      }
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching task statistics',
      error: error.message
    });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  getTaskStats
};
