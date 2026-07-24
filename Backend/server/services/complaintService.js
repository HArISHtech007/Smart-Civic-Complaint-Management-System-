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
   * Get complaints with pagination, filtering, search, and sorting
   * @param {Object} filter - mongoose query filter based on user role
   * @param {Object} query - express query params for sorting/pagination/search
   * @returns {Promise<Object>}
   */
  async getComplaints(filter = {}, query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    // Copy filter to prevent side effects
    const finalFilter = { ...filter };
    
    // Support text search query
    if (query.search) {
      finalFilter.$text = { $search: query.search };
    }
    
    // Add request query filters if present
    if (query.status) finalFilter.status = query.status;
    if (query.priority) finalFilter.priority = query.priority;
    if (query.department) finalFilter.department = query.department;
    
    // Determine sorting options
    let sortBy = '-createdAt';
    if (query.sort) {
      sortBy = query.sort.split(',').join(' ');
    }
    
    const complaintsQuery = Complaint.find(finalFilter)
      .populate('citizen', 'name email phone role')
      .populate('assignedOfficer', 'name email phone role department')
      .sort(sortBy)
      .skip(skip)
      .limit(limit);
      
    const complaints = await complaintsQuery;
    const total = await Complaint.countDocuments(finalFilter);
    
    return {
      complaints,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
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
