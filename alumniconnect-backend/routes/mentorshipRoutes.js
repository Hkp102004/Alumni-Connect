const express = require('express');
const {
  requestMentorship,
  updateMentorshipStatus,
  addSessionLog,
  getMyMentorships,
} = require('../controllers/mentorshipController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, requestMentorship);
router.get('/me', protect, getMyMentorships);
router.put('/:id/status', protect, updateMentorshipStatus);
router.post('/:id/sessions', protect, addSessionLog);

module.exports = router;
