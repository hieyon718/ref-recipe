export type IngredientCategory = 'FOOD' | 'SAUCE';

export type AmountUnit = 'PIECE' | 'TABLESPOON' | 'TEASPOON' | 'CUP' | 'GRAM' | 'ML' | 'PINCH';

export type MetaType = 'TOOL' | 'METHOD';

export interface Ingredient {
  id: number;
  name: string;
  category: IngredientCategory;
}

export interface RecipeIngredient {
  ingredientId: number;
  ingredient: Ingredient;
  amount: number;
  unit: AmountUnit;
}

export interface CookingMeta {
  id: number;
  type: MetaType;
  name: string;
}

export interface StepIngredient {
  ingredientId: number;
}

export interface RecipeStep {
  id: string; // 임시 ID (UUID) for client-side
  stepOrder: number;
  description: string;
  stepTime: number | null; // 초 단위
  isTimerRequired: boolean;
  selectedIngredientIds: number[];
  selectedMetaIds: number[];
}

export interface CreateRecipeForm {
  title: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  mainImgUrl: string;
  videoUrl: string;
}

export const AMOUNT_UNIT_LABELS: Record<AmountUnit, string> = {
  PIECE: '개',
  TABLESPOON: '큰술',
  TEASPOON: '작은술',
  CUP: '컵',
  GRAM: 'g',
  ML: 'ml',
  PINCH: '약간',
};

export const INGREDIENT_CATEGORY_LABELS: Record<IngredientCategory, string> = {
  FOOD: '식재료',
  SAUCE: '소스류',
};
