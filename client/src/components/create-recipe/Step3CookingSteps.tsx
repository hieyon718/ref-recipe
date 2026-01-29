import type { RecipeStep, RecipeIngredient, CookingMeta } from '../../types/recipe';
import StepBlock from './StepBlock';

interface Step3CookingStepsProps {
  steps: RecipeStep[];
  ingredients: RecipeIngredient[];
  cookingMetas: CookingMeta[];
  onStepsChange: (steps: RecipeStep[]) => void;
  onPrev: () => void;
  onNext: () => void;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export default function Step3CookingSteps({
  steps,
  ingredients,
  cookingMetas,
  onStepsChange,
  onPrev,
  onNext,
}: Step3CookingStepsProps) {
  const addStep = () => {
    const newStep: RecipeStep = {
      id: generateId(),
      stepOrder: steps.length + 1,
      description: '',
      stepTime: null,
      isTimerRequired: false,
      selectedIngredientIds: [],
      selectedMetaIds: [],
    };
    onStepsChange([...steps, newStep]);
  };

  const updateStep = (stepId: string, updates: Partial<RecipeStep>) => {
    onStepsChange(
      steps.map((s) => (s.id === stepId ? { ...s, ...updates } : s))
    );
  };

  const removeStep = (stepId: string) => {
    const filtered = steps.filter((s) => s.id !== stepId);
    // 순서 재정렬
    const reordered = filtered.map((s, idx) => ({ ...s, stepOrder: idx + 1 }));
    onStepsChange(reordered);
  };

  // 모든 재료가 최소 한 번 이상 사용되었는지 확인
  const usedIngredientIds = new Set(
    steps.flatMap((s) => s.selectedIngredientIds)
  );
  const allIngredientsUsed = ingredients.every((ri) =>
    usedIngredientIds.has(ri.ingredientId)
  );
  const unusedIngredients = ingredients.filter(
    (ri) => !usedIngredientIds.has(ri.ingredientId)
  );

  // 각 스텝이 유효한지 확인 (최소 하나의 재료 또는 설명이 있어야 함)
  const allStepsValid = steps.length > 0 && steps.every(
    (s) => s.selectedIngredientIds.length > 0 || s.description.trim().length > 0
  );

  const isValid = allStepsValid && allIngredientsUsed;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Step 3: 조리 단계 추가
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          조리 순서대로 단계를 추가해주세요. 모든 재료가 최소 한 번 이상 사용되어야 합니다.
        </p>
      </div>

      {/* 미사용 재료 경고 */}
      {unusedIngredients.length > 0 && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            아직 사용하지 않은 재료: {unusedIngredients.map((ri) => ri.ingredient.name).join(', ')}
          </p>
        </div>
      )}

      {/* 스텝 블록 목록 */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <StepBlock
            key={step.id}
            step={step}
            stepNumber={index + 1}
            ingredients={ingredients}
            cookingMetas={cookingMetas}
            onUpdate={(updates) => updateStep(step.id, updates)}
            onRemove={() => removeStep(step.id)}
          />
        ))}
      </div>

      {/* 스텝 추가 버튼 */}
      <button
        onClick={addStep}
        className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-orange-500 hover:text-orange-500 transition-colors"
      >
        + 조리 단계 추가
      </button>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          이전
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
        >
          다음
        </button>
      </div>
    </div>
  );
}
