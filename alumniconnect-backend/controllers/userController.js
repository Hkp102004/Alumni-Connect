const User = require('../models/User');

// @route  GET /api/users
// @desc   Alumni directory search with filters: ?batch=&branch=&company=&skills=&role=&search=
const getUsers = async (req, res) => {
  try {
    const { batch, branch, company, skills, role, search } = req.query;
    const filter = {};

    if (batch) filter.batch = batch;
    if (branch) filter.branch = branch;
    if (company) filter.company = new RegExp(company, 'i');
    if (role) filter.role = role;
    if (skills) filter.skills = { $in: skills.split(',').map((s) => s.trim()) };
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { bio: new RegExp(search, 'i') },
      ];
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/users/mentors
// @desc   List all users who opted in as mentors, optional ?expertise=
const getMentors = async (req, res) => {
  try {
    const { expertise } = req.query;
    const filter = { isMentor: true };
    if (expertise) filter.mentorExpertise = { $in: [new RegExp(expertise, 'i')] };

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
      'location', 'bio', 'skills', 'avatarUrl', 'isMentor', 'mentorExpertise',
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
