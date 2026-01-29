import type { RecipeStep, RecipeIngredient, CookingMeta } from '../../types/recipe';

interface StepBlockProps {
  step: RecipeStep;
  stepNumber: number;
  ingredients: RecipeIngredient[];
  cookingMetas: CookingMeta[];
  onUpdate: (updates: Partial<RecipeStep>) => void;
  onRemove: () => void;
}

export default function StepBlock({
  step,
  stepNumber,
  ingredients,
  cookingMetas,
  onUpdate,
  onRemove,
}: StepBlockProps) {
  const tools = cookingMetas.filter((m) => m.type === 'TOOL');
  const methods = cookingMetas.filter((m) => m.type === 'METHOD');

  const toggleIngredient = (ingredientId: number) => {
    const newIds = step.selectedIngredientIds.includes(ingredientId)
      ? step.selectedIngredientIds.filter((id) => id !== ingredientId)
      : [...step.selectedIngredientIds, ingredientId];
    onUpdate({ selectedIngredientIds: newIds });
  };

  const toggleMeta = (metaId: number) => {
    const newIds = step.selectedMetaIds.includes(metaId)
      ? step.selectedMetaIds.filter((id) => id !== metaId)
      : [...step.selectedMetaIds, metaId];
    onUpdate({ selectedMetaIds: newIds });
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
          Step {stepNumber}
        </h3>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-600 text-sm"
        >
          삭제
        </button>
      </div>

      {/* 재료 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          재료 선택
        </label>
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ri) => (
            <button
              key={ri.ingredientId}
              onClick={() => toggleIngredient(ri.ingredientId)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                step.selectedIngredientIds.includes(ri.ingredientId)
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {ri.ingredient.name}
            </button>
          ))}
        </div>
      </div>

      {/* 도구 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          도구
        </label>
        <div className="flex flex-wrap gap-2">
          {tools.map((meta) => (
            <button
              key={meta.id}
              onClick={() => toggleMeta(meta.id)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                step.selectedMetaIds.includes(meta.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {meta.name}
            </button>
          ))}
        </div>
      </div>

      {/* 방식 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          조리 방식
        </label>
        <div className="flex flex-wrap gap-2">
          {methods.map((meta) => (
            <button
              key={meta.id}
              onClick={() => toggleMeta(meta.id)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                step.selectedMetaIds.includes(meta.id)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {meta.name}
            </button>
          ))}
        </div>
      </div>

      {/* 시간 설정 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          소요 시간
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={step.stepTime ? Math.floor(step.stepTime / 60) : ''}
            onChange={(e) => {
              const minutes = parseInt(e.target.value) || 0;
              onUpdate({ stepTime: minutes * 60, isTimerRequired: minutes > 0 });
            }}
            placeholder="0"
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
          <span className="text-gray-600 dark:text-gray-400">분</span>
        </div>
      </div>

      {/* 특이사항 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          특이사항 (선택)
        </label>
        <textarea
          value={step.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="예: 양파가 투명해질 때까지 볶기"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />
      </div>
    </div>
  );
}
