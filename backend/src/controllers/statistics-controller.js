import { statisticsService } from '../services/statistics-service.js';

/**
 * @description Get system statistics
 * @route GET /api/admin/stats
 */
export const getStats = async (req, res) => {
  try {
    const stats = await statisticsService.getStats(req.user);
    res.status(200).json(stats);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};