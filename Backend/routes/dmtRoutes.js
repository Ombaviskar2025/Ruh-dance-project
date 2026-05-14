const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking
} = require('../controllers/dmtController');

router.post('/', createBooking);
router.get('/my-bookings/:studentId', getMyBookings);
router.get('/admin/all', getAllBookings);
router.put('/admin/:id', updateBookingStatus);
router.delete('/admin/:id', deleteBooking);

module.exports = router;
