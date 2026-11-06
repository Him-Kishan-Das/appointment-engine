import express from 'express';
import { getMyBookings, createBooking, updateBookingStatus } from '../controllers/bookingController.js';
import { tenantContext } from '../middlewares/tenantContext.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(tenantContext);

// Public or authenticated slot booking
router.post('/', (req, res, next) => {
  // If authorization header is provided, use protect, otherwise proceed for guest booking
  if (req.headers.authorization) {
    return protect(req, res, () => createBooking(req, res, next));
  }
  return createBooking(req, res, next);
});

// Protected host routes
router.use(protect);
router.use(authorize('host', 'staff'));

router.get('/', getMyBookings);
router.patch('/:id/status', updateBookingStatus);

export default router;

