const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a complaint title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a complaint description'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Please specify a department'],
      trim: true,
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be Low, Medium, or High',
      },
      default: 'Medium',
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Assigned', 'Accepted', 'In Progress', 'Completed', 'Rejected'],
        message: 'Status must be Pending, Assigned, Accepted, In Progress, Completed, or Rejected',
      },
      default: 'Pending',
    },
    latitude: {
      type: Number,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
    address: {
      type: String,
      trim: true,
    },
    beforeImage: {
      type: String,
      default: '',
    },
    afterImage: {
      type: String,
      default: '',
    },
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Complaint must belong to a citizen'],
    },
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    aiPrediction: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
