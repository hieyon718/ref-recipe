const express = require('express');
const router = express.Router();

// GET /api/ingredients - 모든 재료 조회
router.get('/', async (req, res) => {
  try {
    const ingredients = await req.prisma.ingredient.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(ingredients);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ error: 'Failed to fetch ingredients' });
  }
});

// POST /api/ingredients - 새 재료 추가
router.post('/', async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'name and category are required' });
    }

    if (!['FOOD', 'SAUCE'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const ingredient = await req.prisma.ingredient.create({
      data: { name, category },
    });

    res.status(201).json(ingredient);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Ingredient already exists' });
    }
    console.error('Error creating ingredient:', error);
    res.status(500).json({ error: 'Failed to create ingredient' });
  }
});

module.exports = router;
