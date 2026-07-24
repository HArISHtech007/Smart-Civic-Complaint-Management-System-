const Notification = require('../models/notificationModel');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const query = { user: req.user._id };

  // Optional filter by read/unread status
  if (req.query.read !== undefined) {
    query.read = req.query.read === 'true';
  }

  const notifications = await Notification.find(query).sort('-createdAt');

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications,
  });
});

// @desc    Mark a specific notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  // Ensure notification belongs to the logged-in user
  if (notification.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to modify this notification');
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: notification,
  });
});

// @desc    Mark all user notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { $set: { read: true } }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
  });
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
