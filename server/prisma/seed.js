const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function main() {
  // 기본 재료 추가
  const ingredients = [
    // 식재료
    { name: '계란', category: 'FOOD' },
    { name: '양파', category: 'FOOD' },
    { name: '스팸', category: 'FOOD' },
    { name: '밥', category: 'FOOD' },
    { name: '대파', category: 'FOOD' },
    { name: '마늘', category: 'FOOD' },
    { name: '당근', category: 'FOOD' },
    { name: '감자', category: 'FOOD' },
    { name: '두부', category: 'FOOD' },
    { name: '김치', category: 'FOOD' },
    { name: '돼지고기', category: 'FOOD' },
    { name: '소고기', category: 'FOOD' },
    { name: '닭고기', category: 'FOOD' },
    { name: '새우', category: 'FOOD' },
    { name: '오징어', category: 'FOOD' },
    // 소스류
    { name: '간장', category: 'SAUCE' },
    { name: '굴소스', category: 'SAUCE' },
    { name: '고추장', category: 'SAUCE' },
    { name: '된장', category: 'SAUCE' },
    { name: '참기름', category: 'SAUCE' },
    { name: '식용유', category: 'SAUCE' },
    { name: '소금', category: 'SAUCE' },
    { name: '설탕', category: 'SAUCE' },
    { name: '후추', category: 'SAUCE' },
    { name: '맛술', category: 'SAUCE' },
  ];

  for (const ing of ingredients) {
    await prisma.ingredient.upsert({
      where: { name: ing.name },
      update: {},
      create: ing,
    });
  }

  console.log('✅ Ingredients seeded');

  // 기본 도구 및 방식 추가
  const cookingMetas = [
    // 도구
    { type: 'TOOL', name: '후라이팬' },
    { type: 'TOOL', name: '냄비' },
    { type: 'TOOL', name: '전자레인지' },
    { type: 'TOOL', name: '오븐' },
    { type: 'TOOL', name: '에어프라이어' },
    { type: 'TOOL', name: '믹서기' },
    { type: 'TOOL', name: '도마' },
    { type: 'TOOL', name: '칼' },
    // 방식
    { type: 'METHOD', name: '볶기' },
    { type: 'METHOD', name: '끓이기' },
    { type: 'METHOD', name: '찌기' },
    { type: 'METHOD', name: '굽기' },
    { type: 'METHOD', name: '튀기기' },
    { type: 'METHOD', name: '데치기' },
    { type: 'METHOD', name: '썰기' },
    { type: 'METHOD', name: '다지기' },
    { type: 'METHOD', name: '섞기' },
    { type: 'METHOD', name: '재우기' },
  ];

  for (const meta of cookingMetas) {
    await prisma.cookingMeta.upsert({
      where: { type_name: { type: meta.type, name: meta.name } },
      update: {},
      create: meta,
    });
  }

  console.log('✅ Cooking metas seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
