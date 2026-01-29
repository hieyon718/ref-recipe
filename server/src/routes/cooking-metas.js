const express = require('express');
const router = express.Router();

// GET /api/cooking-metas - 모든 도구/방식 조회
router.get('/', async (req, res) => {
  try {
    const metas = await req.prisma.cookingMeta.findMany({
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });
    res.json(metas);
  } catch (error) {
    console.error('Error fetching cooking metas:', error);
    res.status(500).json({ error: 'Failed to fetch cooking metas' });
  }
});

// POST /api/cooking-metas - 새 도구/방식 추가
router.post('/', async (req, res) => {
  try {
    const { type, name } = req.body;

    if (!type || !name) {
      return res.status(400).json({ error: 'type and name are required' });
    }

    if (!['TOOL', 'METHOD'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type' });
    }

    const meta = await req.prisma.cookingMeta.create({
      data: { type, name },
    });

    res.status(201).json(meta);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Cooking meta already exists' });
    }
    console.error('Error creating cooking meta:', error);
    res.status(500).json({ error: 'Failed to create cooking meta' });
  }
});

module.exports = router;
