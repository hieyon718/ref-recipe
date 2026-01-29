import { useState } from 'react';
import type { Ingredient, RecipeIngredient, AmountUnit, IngredientCategory } from '../../types/recipe';
import { AMOUNT_UNIT_LABELS, INGREDIENT_CATEGORY_LABELS } from '../../types/recipe';

interface Step2IngredientsProps {
  ingredients: RecipeIngredient[];
  existingIngredients: Ingredient[];
  onIngredientsChange: (ingredients: RecipeIngredient[]) => void;
  onAddNewIngredient: (name: string, category: IngredientCategory) => Promise<Ingredient>;
  onPrev: () => void;
  onNext: () => void;
}

export default function Step2Ingredients({
  ingredients,
  existingIngredients,
  onIngredientsChange,
  onAddNewIngredient,
  onPrev,
  onNext,
}: Step2IngredientsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddNew, setShowAddNew] = useState(false);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientCategory, setNewIngredientCategory] = useState<IngredientCategory>('FOOD');
  const [isAdding, setIsAdding] = useState(false);

  const filteredIngredients = existingIngredients.filter(
    (ing) =>
      ing.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ingredients.some((ri) => ri.ingredientId === ing.id)
  );

  const addIngredient = (ingredient: Ingredient) => {
    const newRecipeIngredient: RecipeIngredient = {
      ingredientId: ingredient.id,
      ingredient,
      amount: 1,
      unit: 'PIECE',
    };
    onIngredientsChange([...ingredients, newRecipeIngredient]);
    setSearchQuery('');
  };

  const removeIngredient = (ingredientId: number) => {
    onIngredientsChange(ingredients.filter((ri) => ri.ingredientId !== ingredientId));
  };

  const updateIngredient = (ingredientId: number, updates: Partial<RecipeIngredient>) => {
    onIngredientsChange(
      ingredients.map((ri) =>
        ri.ingredientId === ingredientId ? { ...ri, ...updates } : ri
      )
    );
  };

  const handleAddNewIngredient = async () => {
    if (!newIngredientName.trim()) return;

    setIsAdding(true);
    try {
      const newIngredient = await onAddNewIngredient(newIngredientName.trim(), newIngredientCategory);
      addIngredient(newIngredient);
      setNewIngredientName('');
      setShowAddNew(false);
    } catch (error) {
      console.error('Failed to add ingredient:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const isValid = ingredients.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Step 2: 전체 재료 선언
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          이 요리에 필요한 모든 재료와 소스를 추가해주세요.
        </p>
      </div>

      {/* 검색 및 추가 */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="재료 검색..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          />

          {/* 검색 결과 드롭다운 */}
          {searchQuery && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredIngredients.length > 0 ? (
                filteredIngredients.map((ing) => (
                  <button
                    key={ing.id}
                    onClick={() => addIngredient(ing)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center"
                  >
                    <span className="text-gray-800 dark:text-gray-100">{ing.name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      ing.category === 'FOOD'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                    }`}>
                      {INGREDIENT_CATEGORY_LABELS[ing.category]}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3">
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                    "{searchQuery}" 검색 결과가 없습니다.
                  </p>
                  <button
                    onClick={() => {
                      setNewIngredientName(searchQuery);
                      setShowAddNew(true);
                      setSearchQuery('');
                    }}
                    className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                  >
                    + 새 재료로 등록하기
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 새 재료 등록 폼 */}
        {showAddNew && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">새 재료 등록</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newIngredientName}
                onChange={(e) => setNewIngredientName(e.target.value)}
                placeholder="재료명"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
              <div className="flex gap-2">
                {(['FOOD', 'SAUCE'] as IngredientCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewIngredientCategory(cat)}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      newIngredientCategory === cat
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {INGREDIENT_CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddNew(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  취소
                </button>
                <button
                  onClick={handleAddNewIngredient}
                  disabled={!newIngredientName.trim() || isAdding}
                  className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isAdding ? '등록 중...' : '등록'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 선택된 재료 목록 */}
      {ingredients.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
            선택된 재료 ({ingredients.length}개)
          </h3>
          <div className="space-y-2">
            {ingredients.map((ri) => (
              <div
                key={ri.ingredientId}
                className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <span className={`text-xs px-2 py-1 rounded ${
                  ri.ingredient.category === 'FOOD'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                }`}>
                  {INGREDIENT_CATEGORY_LABELS[ri.ingredient.category]}
                </span>
                <span className="flex-1 font-medium text-gray-800 dark:text-gray-100">
                  {ri.ingredient.name}
                </span>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={ri.amount}
                  onChange={(e) => updateIngredient(ri.ingredientId, { amount: parseFloat(e.target.value) || 0 })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-center dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
                <select
                  value={ri.unit}
                  onChange={(e) => updateIngredient(ri.ingredientId, { unit: e.target.value as AmountUnit })}
                  className="px-2 py-1 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                >
                  {(Object.keys(AMOUNT_UNIT_LABELS) as AmountUnit[]).map((unit) => (
                    <option key={unit} value={unit}>
                      {AMOUNT_UNIT_LABELS[unit]}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeIngredient(ri.ingredientId)}
                  className="p-1 text-red-500 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
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
