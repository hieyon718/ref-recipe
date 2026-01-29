require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('../generated/prisma');

const ingredientRoutes = require('./routes/ingredients');
const cookingMetaRoutes = require('./routes/cooking-metas');
const recipeRoutes = require('./routes/recipes');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Prisma 인스턴스를 req에 추가
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Routes
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/cooking-metas', cookingMetaRoutes);
app.use('/api/recipes', recipeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
