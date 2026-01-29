import type { RecipeStep, RecipeIngredient, CookingMeta } from '../../types/recipe';
import { AMOUNT_UNIT_LABELS } from '../../types/recipe';

interface Step5SummaryProps {
  title: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  cookingMetas: CookingMeta[];
  mainImgUrl: string;
  videoUrl: string;
  onPrev: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export default function Step5Summary({
  title,
  ingredients,
  steps,
  cookingMetas,
  mainImgUrl,
  videoUrl,
  onPrev,
  onSave,
  isSaving,
}: Step5SummaryProps) {
  // 모든 재료가 사용되었는지 확인
  const usedIngredientIds = new Set(
    steps.flatMap((s) => s.selectedIngredientIds)
  );
  const allIngredientsUsed = ingredients.every((ri) =>
    usedIngredientIds.has(ri.ingredientId)
  );

  // 모든 스텝이 유효한지 확인
  const allStepsValid = steps.length > 0 && steps.every(
    (s) => s.selectedIngredientIds.length > 0 || s.description.trim().length > 0
  );

  const canSave = title.trim().length > 0 && allIngredientsUsed && allStepsValid;

  const getMetaName = (metaId: number) => {
    const meta = cookingMetas.find((m) => m.id === metaId);
    return meta?.name || '';
  };

  const getIngredientName = (ingredientId: number) => {
    const ri = ingredients.find((ri) => ri.ingredientId === ingredientId);
    return ri?.ingredient.name || '';
  };

  // 전체 예상 소요 시간 계산 (분)
  const totalTime = Math.ceil(
    steps.reduce((acc, s) => acc + (s.stepTime || 0), 0) / 60
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Step 5: 저장하기
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          입력한 내용을 확인하고 저장해주세요.
        </p>
      </div>

      {/* 요약 카드 */}
      <div className="space-y-4">
        {/* 기본 정보 */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">기본 정보</h3>
          <p className="text-lg font-bold text-orange-500">{title}</p>
          {totalTime > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              예상 소요 시간: {totalTime}분
            </p>
          )}
        </div>

        {/* 재료 목록 */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
            재료 ({ingredients.length}개)
          </h3>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ri) => (
              <span
                key={ri.ingredientId}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
              >
                {ri.ingredient.name} {ri.amount}{AMOUNT_UNIT_LABELS[ri.unit]}
              </span>
            ))}
          </div>
        </div>

        {/* 조리 단계 */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
            조리 단계 ({steps.length}단계)
          </h3>
          <div className="space-y-3">
            {steps.map((step, index) => {
              const tools = step.selectedMetaIds
                .map(getMetaName)
                .filter(Boolean);
              const stepIngredients = step.selectedIngredientIds
                .map(getIngredientName)
                .filter(Boolean);

              return (
                <div
                  key={step.id}
                  className="pl-4 border-l-2 border-orange-300 dark:border-orange-600"
                >
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    Step {index + 1}
                    {step.stepTime && (
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        ({Math.floor(step.stepTime / 60)}분)
                      </span>
                    )}
                  </p>
                  {stepIngredients.length > 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      재료: {stepIngredients.join(', ')}
                    </p>
                  )}
                  {tools.length > 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      도구/방식: {tools.join(', ')}
                    </p>
                  )}
                  {step.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                      "{step.description}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 추가 정보 */}
        {(mainImgUrl || videoUrl) && (
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">추가 정보</h3>
            {mainImgUrl && (
              <div className="mb-2">
                <img
                  src={mainImgUrl}
                  alt="대표 사진"
                  className="max-w-xs max-h-32 rounded-lg object-cover"
                />
              </div>
            )}
            {videoUrl && (
              <p className="text-sm text-blue-500 truncate">
                <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                  {videoUrl}
                </a>
              </p>
            )}
          </div>
        )}
      </div>

      {/* 유효성 메시지 */}
      {!canSave && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">
            {!title.trim() && '레시피 이름을 입력해주세요. '}
            {!allIngredientsUsed && '모든 재료가 조리 단계에서 사용되어야 합니다. '}
            {!allStepsValid && '모든 조리 단계에 재료 또는 설명을 추가해주세요.'}
          </p>
        </div>
      )}

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          이전
        </button>
        <button
          onClick={onSave}
          disabled={!canSave || isSaving}
          className="px-8 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
        >
          {isSaving ? '저장 중...' : '저장하기'}
        </button>
      </div>
    </div>
  );
}
