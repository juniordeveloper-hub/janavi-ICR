// backend/src/controllers/leadController.ts
import { Request, Response } from 'express';
import Lead from '../models/Lead';
import { deleteFromGCS } from '../services/gcsService';

interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

export const getLeads = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const leads = await Lead.find({ userId: req.user!.userId })
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ message: 'Failed to fetch leads' });
  }
};

export const getLead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findOne({ 
      _id: id, 
      userId: req.user!.userId 
    });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ message: 'Failed to fetch lead' });
  }
};

export const updateLead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, email, designation, company } = req.body;

    const lead = await Lead.findOneAndUpdate(
      { _id: id, userId: req.user!.userId },
      { name, phone, email, designation, company },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ message: 'Failed to update lead' });
  }
};

export const deleteLead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const lead = await Lead.findOneAndDelete({ 
      _id: id, 
      userId: req.user!.userId 
    });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Extract filename from GCS URL and delete the file
    if (lead.imageUrl) {
      try {
        const fileName = lead.imageUrl.split('/').pop();
        if (fileName) {
          await deleteFromGCS(`leadgen/${fileName}`);
        }
      } catch (deleteError) {
        console.error('Failed to delete file from GCS:', deleteError);
        // Continue with lead deletion even if file deletion fails
      }
    }

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ message: 'Failed to delete lead' });
  }
};