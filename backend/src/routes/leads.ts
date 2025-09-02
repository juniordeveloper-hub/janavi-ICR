// backend/src/routes/leads.ts
import express from 'express';
import { getLeads, getLead, updateLead, deleteLead } from '../controllers/leadController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, getLeads);
router.get('/:id', authenticate, getLead);
router.put('/:id', authenticate, updateLead);
router.delete('/:id', authenticate, deleteLead);

export default router;