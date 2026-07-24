const Complaint = require('../models/complaintModel');
const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');

// Helper to get start of today's date
const getStartOfToday = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return start;
};

// @desc    Get Citizen Dashboard Statistics
// @route   GET /api/dashboard/citizen
// @access  Private (Citizen)
const getCitizenStats = asyncHandler(async (req, res) => {
  const citizenId = new mongoose.Types.ObjectId(req.user._id);

  // Aggregation to count complaints by status
  const stats = await Complaint.aggregate([
    { $match: { citizen: citizenId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Convert array of groups to structured object
  const counts = {
    total: 0,
    Pending: 0,
    Assigned: 0,
    Accepted: 0,
    'In Progress': 0,
    Completed: 0,
    Rejected: 0,
  };

  stats.forEach((item) => {
    counts[item._id] = item.count;
    counts.total += item.count;
  });

  // Consolidate Active/Work-in-progress states
  const activeCount = counts.Assigned + counts.Accepted + counts['In Progress'];

  res.status(200).json({
    success: true,
    data: {
      total: counts.total,
      pending: counts.Pending,
      assigned: activeCount,
      completed: counts.Completed,
      rejected: counts.Rejected,
    },
  });
});

// @desc    Get Officer Dashboard Statistics
// @route   GET /api/dashboard/officer
// @access  Private (Officer)
const getOfficerStats = asyncHandler(async (req, res) => {
  const officerId = new mongoose.Types.ObjectId(req.user._id);
  const startOfToday = getStartOfToday();

  // 1) General status aggregations
  const stats = await Complaint.aggregate([
    { $match: { assignedOfficer: officerId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // 2) Count complaints completed today
  const completedToday = await Complaint.countDocuments({
    assignedOfficer: officerId,
    status: 'Completed',
    completedAt: { $gte: startOfToday },
  });

  const counts = {
    total: 0,
    Assigned: 0,
    Accepted: 0,
    'In Progress': 0,
    Completed: 0,
  };

  stats.forEach((item) => {
    counts[item._id] = item.count;
    counts.total += item.count;
  });

  const activeCount = counts.Assigned + counts.Accepted + counts['In Progress'];

  res.status(200).json({
    success: true,
    data: {
      total: counts.total,
      assigned: activeCount,
      completed: counts.Completed,
      completedToday,
    },
  });
});

// @desc    Get Head Officer Department Statistics
// @route   GET /api/dashboard/headofficer
// @access  Private (HeadOfficer)
const getHeadOfficerStats = asyncHandler(async (req, res) => {
  const department = req.user.department;

  if (!department) {
    res.status(400);
    throw new Error('User does not belong to a department');
  }

  // 1) Aggregation by status in department
  const stats = await Complaint.aggregate([
    { $match: { department } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // 2) Count Critical high priority items in department
  const criticalCount = await Complaint.countDocuments({
    department,
    priority: 'High',
    status: { $ne: 'Completed' },
  });

  const counts = {
    total: 0,
    Pending: 0,
    Assigned: 0,
    Accepted: 0,
    'In Progress': 0,
    Completed: 0,
    Rejected: 0,
  };

  stats.forEach((item) => {
    counts[item._id] = item.count;
    counts.total += item.count;
  });

  const activeCount = counts.Assigned + counts.Accepted + counts['In Progress'];

  res.status(200).json({
    success: true,
    data: {
      department,
      total: counts.total,
      pending: counts.Pending,
      assigned: activeCount,
      completed: counts.Completed,
      critical: criticalCount,
    },
  });
});

// @desc    Get Admin Dashboard Analytics
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
const getAdminStats = asyncHandler(async (req, res) => {
  // 1) Count Users grouped by Role
  const userStats = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
      },
    },
  ]);

  const userCounts = { total: 0 };
  userStats.forEach((item) => {
    userCounts[item._id] = item.count;
    userCounts.total += item.count;
  });

  // 2) Count Complaints grouped by Status
  const complaintStats = await Complaint.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const complaintCounts = { total: 0 };
  complaintStats.forEach((item) => {
    complaintCounts[item._id] = item.count;
    complaintCounts.total += item.count;
  });

  // 3) Count Complaints grouped by Department
  const departmentStats = await Complaint.aggregate([
    {
      $group: {
        _id: '$department',
        count: { $sum: 1 },
      },
    },
  ]);

  // 4) Monthly Trends (Group by Month and Year)
  const monthlyTrends = await Complaint.aggregate([
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // 5) Completion Rate by Department
  const completionRateByDept = await Complaint.aggregate([
    {
      $group: {
        _id: '$department',
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        department: '$_id',
        total: 1,
        completed: 1,
        rate: {
          $cond: [
            { $eq: ['$total', 0] },
            0,
            { $round: [{ $multiply: [{ $divide: ['$completed', '$total'] }, 100] }, 1] },
          ],
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      users: userCounts,
      complaints: complaintCounts,
      departments: departmentStats,
      monthlyTrends: monthlyTrends.map(item => ({
        month: item._id.month,
        year: item._id.year,
        count: item.count
      })),
      completionRates: completionRateByDept,
    },
  });
});

module.exports = {
  getCitizenStats,
  getOfficerStats,
  getHeadOfficerStats,
  getAdminStats,
};
