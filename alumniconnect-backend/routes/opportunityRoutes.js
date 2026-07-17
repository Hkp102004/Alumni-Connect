const express = require('express');
const {
  createOpportunity,
  getOpportunities,
  applyToOpportunity,
  updateApplicantStatus,
  deleteOpportunity,
} = require('../controllers/opportunityController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createOpportunity);
router.get('/', protect, getOpportunities);
router.post('/:id/apply', protect, applyToOpportunity);
router.put('/:id/applicants/:userId', protect, updateApplicantStatus);
router.delete('/:id', protect, deleteOpportunity);

module.exports = router;
