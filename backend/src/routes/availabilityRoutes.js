import express from 'express';
import { getMyAvailability, updateMyAvailability, getAvailableSlots } from '../controllers/availabilityController.js';
import { tenantContext } from '../middlewares/tenantContext.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(tenantContext);

// Public / client slot querying (or authenticated host)
router.get('/slots', (req, res, next) => {
  if (req.headers.authorization) {
    return protect(req, res, () => getAvailableSlots(req, res, next));
  }
  return getAvailableSlots(req, res, next);
});

// Protected host routes
router.use(protect);
router.use(authorize('host', 'staff'));

router.get('/me', getMyAvailability);
router.put('/me', updateMyAvailability);

export default router;
