const Complaint = require('../models/complaintModel');

class ComplaintService {
  /**
   * Create a new complaint
   * @param {Object} complaintData
   * @returns {Promise<Object>}
   */
  async createComplaint(complaintData) {
    const complaint = await Complaint.create(complaintData);
    return complaint;
  }

  /**
   * Get complaints with optional filtering
   * @param {Object} filter - mongoose query filter
   * @param {Object} query - express query params for sorting/pagination
   * @returns {Promise<Array>}
   */
  async getComplaints(filter = {}, query = {}) {
    // Basic sorting by createdAt desc by default
    const sortBy = query.sortBy || '-createdAt';
    
    const complaints = await Complaint.find(filter)
      .populate('citizen', 'name email phone role')
      .populate('assignedOfficer', 'name email phone role department')
      .sort(sortBy);
      
    return complaints;
  }

  /**
   * Get complaint by ID
   * @param {String} id
   * @returns {Promise<Object|null>}
   */
  async getComplaintById(id) {
    return await Complaint.findById(id)
      .populate('citizen', 'name email phone role')
      .populate('assignedOfficer', 'name email phone role department');
  }

  /**
   * Update complaint by ID
   * @param {String} id
   * @param {Object} updateData
   * @returns {Promise<Object|null>}
   */
  async updateComplaint(id, updateData) {
    // If status is updated to Completed, set completedAt
    if (updateData.status === 'Completed') {
      updateData.completedAt = new Date();
    } else if (updateData.status && updateData.status !== 'Completed') {
      // If status is changed back from Completed, clear completedAt
      updateData.completedAt = null;
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('citizen', 'name email phone role')
      .populate('assignedOfficer', 'name email phone role department');

    return complaint;
  }

  /**
   * Delete complaint by ID
   * @param {String} id
   * @returns {Promise<Object|null>}
   */
  async deleteComplaint(id) {
    return await Complaint.findByIdAndDelete(id);
  }
}

module.exports = new ComplaintService();
