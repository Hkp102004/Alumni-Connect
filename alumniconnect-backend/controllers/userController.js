const User = require('../models/User');

// @route  GET /api/users
// @desc   Alumni directory search with filters (only lists users with complete profiles)
const getUsers = async (req, res) => {
  try {
    const { batch, branch, company, skills, role, search } = req.query;
    
    // Core profile completeness conditions: name, batch, branch, bio, location, skills
    const queryConditions = [
      { name: { $exists: true, $ne: '' } },
      { batch: { $exists: true, $ne: '' } },
      { branch: { $exists: true, $ne: '' } },
      { bio: { $exists: true, $ne: '' } },
      { location: { $exists: true, $ne: '' } },
      { skills: { $exists: true, $not: { $size: 0 } } },
      {
        $or: [
          { role: 'student' },
          {
            role: 'alumni',
            company: { $exists: true, $ne: '' },
            designation: { $exists: true, $ne: '' }
          }
        ]
      }
    ];

    if (batch) queryConditions.push({ batch });
    if (branch) queryConditions.push({ branch });
    if (company) queryConditions.push({ company: new RegExp(company, 'i') });
    if (role) queryConditions.push({ role });
    if (skills) {
      queryConditions.push({
        skills: { $in: skills.split(',').map((s) => s.trim()).filter(Boolean) }
      });
    }
    if (search) {
      queryConditions.push({
        $or: [
          { name: new RegExp(search, 'i') },
          { bio: new RegExp(search, 'i') },
        ]
      });
    }

    const filter = { $and: queryConditions };
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/users/mentors
// @desc   List all users who opted in as mentors (only lists mentors with complete profiles)
const getMentors = async (req, res) => {
  try {
    const { expertise } = req.query;
    
    const queryConditions = [
      { isMentor: true },
      { name: { $exists: true, $ne: '' } },
      { batch: { $exists: true, $ne: '' } },
      { branch: { $exists: true, $ne: '' } },
      { bio: { $exists: true, $ne: '' } },
      { location: { $exists: true, $ne: '' } },
      { skills: { $exists: true, $not: { $size: 0 } } },
      { company: { $exists: true, $ne: '' } },
      { designation: { $exists: true, $ne: '' } }
    ];

    if (expertise) {
      queryConditions.push({
        mentorExpertise: { $in: [new RegExp(expertise, 'i')] }
      });
    }

    const filter = { $and: queryConditions };
    const mentors = await User.find(filter).select('-password');
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  PUT /api/users/me
// @desc   Update logged-in user's own profile
const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'batch', 'branch', 'company', 'designation',
      'location', 'bio', 'skills', 'avatarUrl', 'linkedinUrl', 'githubUrl',
      'isMentor', 'mentorExpertise',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUsers, getMentors, getUserById, updateProfile };
