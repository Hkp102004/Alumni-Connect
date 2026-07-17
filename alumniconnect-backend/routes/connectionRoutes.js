const express = require('express');
const {
  sendRequest,
  respondToRequest,
  getMyConnections,
} = require('../controllers/connectionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, sendRequest);
router.put('/:id', protect, respondToRequest);
router.get('/me', protect, getMyConnections);

module.exports = router;
