const Mentorship = require('../models/Mentorship');
const User = require('../models/User');

// @route  POST /api/mentorships
// @desc   Mentee requests mentorship from a mentor
const requestMentorship = async (req, res) => {
  try {
    const { mentor, expertiseArea, message } = req.body;

    const mentorUser = await User.findById(mentor);
    if (!mentorUser || !mentorUser.isMentor) {
      return res.status(400).json({ message: 'Selected user is not a registered mentor' });
    }

    const mentorship = await Mentorship.create({
      mentor,
      mentee: req.user._id,
      expertiseArea,
      message,
    });

    res.status(201).json(mentorship);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  PUT /api/mentorships/:id/status
// @desc   Mentor updates status. Body: { status: 'active' | 'declined' | 'completed' }
const updateMentorshipStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const mentorship = await Mentorship.findById(req.params.id);

    if (!mentorship) return res.status(404).json({ message: 'Mentorship not found' });

    if (String(mentorship.mentor) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Only the mentor can update this mentorship' });
    }

    mentorship.status = status;
    await mentorship.save();
    res.json(mentorship);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  POST /api/mentorships/:id/sessions
// @desc   Log a mentorship session. Body: { date, notes }
const addSessionLog = async (req, res) => {
  try {
    const { date, notes } = req.body;
    const mentorship = await Mentorship.findById(req.params.id);

    if (!mentorship) return res.status(404).json({ message: 'Mentorship not found' });

    const isParticipant =
      String(mentorship.mentor) === String(req.user._id) ||
      String(mentorship.mentee) === String(req.user._id);

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not part of this mentorship' });
    }

    mentorship.sessionsLog.push({ date, notes });
    await mentorship.save();
    res.json(mentorship);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/mentorships/me
// @desc   List mentorships where the user is mentor or mentee, optional ?status=
const getMyMentorships = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {
      $or: [{ mentor: req.user._id }, { mentee: req.user._id }],
    };
    if (status) filter.status = status;

    const mentorships = await Mentorship.find(filter)
      .populate('mentor', 'name company designation')
      .populate('mentee', 'name batch branch');

    res.json(mentorships);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { requestMentorship, updateMentorshipStatus, addSessionLog, getMyMentorships };
