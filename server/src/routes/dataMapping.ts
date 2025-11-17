import express from 'express';
import { DatabaseService } from '../services/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();
const dbService = new DatabaseService();

// Get all data mappings for the authenticated user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const mappings = await dbService.getAllDataMappings(userId);
    res.json({ success: true, data: mappings });
  } catch (error) {
    console.error('Error fetching data mappings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch data mappings' });
  }
});

// Get a single data mapping by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const id = parseInt(req.params.id);
    
    const mapping = await dbService.getDataMappingById(id, userId);
    if (!mapping) {
      return res.status(404).json({ success: false, message: 'Data mapping not found' });
    }
    
    res.json({ success: true, data: mapping });
  } catch (error) {
    console.error('Error fetching data mapping:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch data mapping' });
  }
});

// Create a new data mapping
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { title, description, department, dataSubjectType } = req.body;

    // Validation - only title and department are required
    if (!title || !department) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and department are required' 
      });
    }

    const id = await dbService.createDataMapping({
      title,
      description: description || '',
      department,
      dataSubjectType: dataSubjectType || '',
      userId
    });

    res.status(201).json({ 
      success: true, 
      message: 'Data mapping created successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Error creating data mapping:', error);
    res.status(500).json({ success: false, message: 'Failed to create data mapping' });
  }
});

// Update a data mapping
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const id = parseInt(req.params.id);
    const { title, description, department, dataSubjectType } = req.body;

    // Validation - only title and department are required
    if (!title || !department) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and department are required' 
      });
    }

    const updated = await dbService.updateDataMapping(id, userId, {
      title,
      description,
      department,
      dataSubjectType: dataSubjectType || ''
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Data mapping not found' });
    }

    res.json({ success: true, message: 'Data mapping updated successfully' });
  } catch (error) {
    console.error('Error updating data mapping:', error);
    res.status(500).json({ success: false, message: 'Failed to update data mapping' });
  }
});

// Delete a data mapping
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const id = parseInt(req.params.id);

    const deleted = await dbService.deleteDataMapping(id, userId);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Data mapping not found' });
    }

    res.json({ success: true, message: 'Data mapping deleted successfully' });
  } catch (error) {
    console.error('Error deleting data mapping:', error);
    res.status(500).json({ success: false, message: 'Failed to delete data mapping' });
  }
});

export default router;
