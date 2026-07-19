const User = require('../models/User');

// @route  GET /api/users
// @desc   Directory — list all registered users with optional filters
const getUsers = async (req, res) => {
  try {
    const { batch, branch, company, skills, role, search } = req.query;

    // Show everyone who signed up (excluding admins)
    const filter = { role: { $ne: 'admin' } };

    if (role) filter.role = role;
    if (batch) filter.batch = new RegExp(batch, 'i');
    if (branch) filter.branch = new RegExp(branch, 'i');
    if (company) filter.company = new RegExp(company, 'i');
    if (skills) {
      filter.skills = {
        $in: skills.split(',').map((s) => s.trim()).filter(Boolean),
      };
    }
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { bio: new RegExp(search, 'i') },
        { company: new RegExp(search, 'i') },
        { designation: new RegExp(search, 'i') },
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @route  GET /api/users/mentors
// @desc   List all users who opted in as mentors
const getMentors = async (req, res) => {
  try {
    const { expertise } = req.query;

    // Only require mentor flag + company + designation (enough to show in exploration cards)
    const queryConditions = [
      { isMentor: true },
      { company: { $exists: true, $ne: '' } },
      { designation: { $exists: true, $ne: '' } },
    ];

    if (expertise) {
      queryConditions.push({
        mentorExpertise: { $in: [new RegExp(expertise, 'i')] }
      });
    }

    const filter = { $and: queryConditions };
    // Return only public-facing fields for mentor cards
    const mentors = await User.find(filter).select('name company designation mentorExpertise avatarUrl location');
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
      'isMentor', 'mentorExpertise', 'phone',
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
