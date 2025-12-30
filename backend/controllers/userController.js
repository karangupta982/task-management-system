const User = require('../models/User');
const Notification = require('../models/Notification');


exports.searchUsers = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username to search'
      });
    }

    const users = await User.find({
      username: { $regex: username, $options: 'i' },
      _id: { $ne: req.user.id } // Exclude current user
    })
      .select('username email')
      .limit(10);

    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    console.log('Updating profile with data:', req.body);
    const { username, preferences } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (username) user.username = username;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .populate('taskId', 'title')
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};