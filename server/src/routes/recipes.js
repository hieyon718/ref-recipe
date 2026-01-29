const express = require('express');
const router = express.Router();

// GET /api/recipes - 모든 레시피 조회
router.get('/', async (req, res) => {
  try {
    const recipes = await req.prisma.recipe.findMany({
      include: {
        recipeIngredients: {
          include: { ingredient: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// GET /api/recipes/:id - 특정 레시피 조회
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await req.prisma.recipe.findUnique({
      where: { id: parseInt(id) },
      include: {
        recipeIngredients: {
          include: { ingredient: true },
        },
        steps: {
          include: {
            stepIngredients: {
              include: { ingredient: true },
            },
            stepMetas: {
              include: { meta: true },
            },
          },
          orderBy: { stepOrder: 'asc' },
        },
      },
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// POST /api/recipes - 새 레시피 생성
router.post('/', async (req, res) => {
  try {
    const { title, mainImgUrl, videoUrl, totalTime, ingredients, steps } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    // 임시 사용자 ID (실제로는 인증된 사용자 ID 사용)
    const tempUserId = 'temp-user-id';

    // 사용자 확인 또는 생성
    let user = await req.prisma.user.findUnique({
      where: { id: tempUserId },
    });

    if (!user) {
      user = await req.prisma.user.create({
        data: {
          id: tempUserId,
          email: 'temp@example.com',
          nickname: '테스트 사용자',
        },
      });
    }

    // 레시피 생성 (트랜잭션 사용)
    const recipe = await req.prisma.$transaction(async (tx) => {
      // 1. 레시피 기본 정보 생성
      const newRecipe = await tx.recipe.create({
        data: {
          userId: tempUserId,
          title,
          mainImgUrl: mainImgUrl || null,
          videoUrl: videoUrl || null,
          totalTime: totalTime || null,
        },
      });

      // 2. 레시피 재료 추가
      if (ingredients && ingredients.length > 0) {
        await tx.recipeIngredient.createMany({
          data: ingredients.map((ing) => ({
            recipeId: newRecipe.id,
            ingredientId: ing.ingredientId,
            amount: ing.amount,
            unit: ing.unit,
          })),
        });
      }

      // 3. 조리 단계 추가
      if (steps && steps.length > 0) {
        for (const step of steps) {
          const newStep = await tx.recipeStep.create({
            data: {
              recipeId: newRecipe.id,
              stepOrder: step.stepOrder,
              description: step.description || '',
              stepTime: step.stepTime || null,
              isTimerRequired: step.isTimerRequired || false,
            },
          });

          // 4. 단계별 재료 추가
          if (step.ingredientIds && step.ingredientIds.length > 0) {
            await tx.stepIngredient.createMany({
              data: step.ingredientIds.map((ingredientId) => ({
                stepId: newStep.id,
                ingredientId,
              })),
            });
          }

          // 5. 단계별 도구/방식 추가
          if (step.metaIds && step.metaIds.length > 0) {
            await tx.stepMetaMapping.createMany({
              data: step.metaIds.map((metaId) => ({
                stepId: newStep.id,
                metaId,
              })),
            });
          }
        }
      }

      return newRecipe;
    });

    // 생성된 레시피 전체 정보 조회
    const fullRecipe = await req.prisma.recipe.findUnique({
      where: { id: recipe.id },
      include: {
        recipeIngredients: {
          include: { ingredient: true },
        },
        steps: {
          include: {
            stepIngredients: {
              include: { ingredient: true },
            },
            stepMetas: {
              include: { meta: true },
            },
          },
          orderBy: { stepOrder: 'asc' },
        },
      },
    });

    res.status(201).json(fullRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

module.exports = router;
