const Task = require('../models/Task');
const User = require('../models/User');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');
const { taskAddedTemplate } = require('../utils/emailTemplates');


exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      createdBy: req.user.id
    });

    // Log activity
    task.activityLog.push({
      action: 'Task created',
      performedBy: req.user.id
    });
    await task.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tasks = await Task.find({
      $or: [
        { createdBy: req.user.id },
        { 'collaborators.userId': req.user.id }
      ]
    })
      .populate('createdBy', 'username email')
      .populate('collaborators.userId', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments({
      $or: [
        { createdBy: req.user.id },
        { 'collaborators.userId': req.user.id }
      ]
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('collaborators.userId', 'username email')
      .populate('comments.userId', 'username')
      .populate('activityLog.performedBy', 'username');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check access permission
    const isCreator = task.createdBy._id.toString() === req.user.id;
    const isCollaborator = task.collaborators.some(
      collab => collab.userId._id.toString() === req.user.id
    );

    if (!isCreator && !isCollaborator) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this task'
      });
    }

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.addCollaborator = async (req, res) => {
  try {
    const { username, responsibility } = req.body;

    const task = await Task.findById(req.params.id).populate('createdBy', 'username email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Only creator can add collaborators
    if (task.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only task creator can add collaborators'
      });
    }

    // Find user by username
    const userToAdd = await User.findOne({ username });
    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already a collaborator
    const alreadyAdded = task.collaborators.some(
      collab => collab.userId.toString() === userToAdd._id.toString()
    );

    if (alreadyAdded) {
      return res.status(400).json({
        success: false,
        message: 'User is already a collaborator'
      });
    }

    // Add collaborator
    task.collaborators.push({
      userId: userToAdd._id,
      assignedResponsibility: responsibility || '',
      emailSent: false
    });

    // Log activity
    task.activityLog.push({
      action: `Added ${username} as collaborator`,
      performedBy: req.user.id
    });

    await task.save();

    // Send email notification
    if (userToAdd.preferences.emailNotifications) {
      const emailData = {
        addedUserName: userToAdd.username,
        creatorName: req.user.username,
        taskTitle: task.title,
        description: task.description,
        responsibility: responsibility || 'No specific responsibility assigned',
        dueDate: task.dueDate,
        priority: task.priority,
        taskLink: `${process.env.FRONTEND_URL}/tasks/${task._id}`
      };

      const emailResult = await sendEmail({
        email: userToAdd.email,
        subject: `You've been added to "${task.title}"`,
        html: taskAddedTemplate(emailData)
      });

      // Update email sent status
      if (emailResult.success) {
        const collabIndex = task.collaborators.findIndex(
          c => c.userId.toString() === userToAdd._id.toString()
        );
        task.collaborators[collabIndex].emailSent = true;
        await task.save();
      }
    }

    // Create notification
    await Notification.create({
      userId: userToAdd._id,
      taskId: task._id,
      type: 'added',
      message: `${req.user.username} added you to task: ${task.title}`
    });

    res.status(200).json({
      success: true,
      message: 'Collaborator added successfully',
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.removeCollaborator = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Only creator can remove collaborators
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only task creator can remove collaborators'
      });
    }

    // Remove collaborator
    task.collaborators = task.collaborators.filter(
      collab => collab.userId.toString() !== req.params.userId
    );

    // Log activity
    task.activityLog.push({
      action: `Removed collaborator`,
      performedBy: req.user.id
    });

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Collaborator removed successfully',
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check access
    const isCreator = task.createdBy.toString() === req.user.id;
    const isCollaborator = task.collaborators.some(
      collab => collab.userId.toString() === req.user.id
    );

    if (!isCreator && !isCollaborator) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    task.status = status;
    task.activityLog.push({
      action: `Status changed to ${status}`,
      performedBy: req.user.id
    });

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task status updated',
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Only creator can update task details
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only task creator can update task details'
      });
    }

    const { title, description, dueDate, priority } = req.body;

    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (priority) task.priority = priority;

    task.activityLog.push({
      action: 'Task updated',
      performedBy: req.user.id
    });

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Only creator can delete
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only task creator can delete this task'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

