import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { Ingredient, RecipeIngredient, RecipeStep, CookingMeta, IngredientCategory } from '../types/recipe';
import StepIndicator from '../components/create-recipe/StepIndicator';
import Step1BasicInfo from '../components/create-recipe/Step1BasicInfo';
import Step2Ingredients from '../components/create-recipe/Step2Ingredients';
import Step3CookingSteps from '../components/create-recipe/Step3CookingSteps';
import Step4AdditionalInfo from '../components/create-recipe/Step4AdditionalInfo';
import Step5Summary from '../components/create-recipe/Step5Summary';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const STEP_LABELS = ['기본 정보', '재료', '조리 단계', '추가 정보', '저장'];

export default function CreateRecipePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [steps, setSteps] = useState<RecipeStep[]>([]);
  const [mainImgUrl, setMainImgUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Data from API
  const [existingIngredients, setExistingIngredients] = useState<Ingredient[]>([]);
  const [cookingMetas, setCookingMetas] = useState<CookingMeta[]>([]);

  useEffect(() => {
    fetchIngredients();
    fetchCookingMetas();
  }, []);

  const fetchIngredients = async () => {
    try {
      const res = await fetch(`${API_URL}/api/ingredients`);
      if (res.ok) {
        const data = await res.json();
        setExistingIngredients(data);
      }
    } catch (error) {
      console.error('Failed to fetch ingredients:', error);
    }
  };

  const fetchCookingMetas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/cooking-metas`);
      if (res.ok) {
        const data = await res.json();
        setCookingMetas(data);
      }
    } catch (error) {
      console.error('Failed to fetch cooking metas:', error);
    }
  };

  const handleAddNewIngredient = async (name: string, category: IngredientCategory): Promise<Ingredient> => {
    const res = await fetch(`${API_URL}/api/ingredients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category }),
    });

    if (!res.ok) {
      throw new Error('Failed to add ingredient');
    }

    const newIngredient = await res.json();
    setExistingIngredients((prev) => [...prev, newIngredient]);
    return newIngredient;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const totalTime = Math.ceil(
        steps.reduce((acc, s) => acc + (s.stepTime || 0), 0) / 60
      );

      const payload = {
        title,
        mainImgUrl: mainImgUrl || null,
        videoUrl: videoUrl || null,
        totalTime: totalTime || null,
        ingredients: ingredients.map((ri) => ({
          ingredientId: ri.ingredientId,
          amount: ri.amount,
          unit: ri.unit,
        })),
        steps: steps.map((s, index) => ({
          stepOrder: index + 1,
          description: s.description,
          stepTime: s.stepTime,
          isTimerRequired: s.isTimerRequired,
          ingredientIds: s.selectedIngredientIds,
          metaIds: s.selectedMetaIds,
        })),
      };

      const res = await fetch(`${API_URL}/api/recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to save recipe');
      }

      const savedRecipe = await res.json();
      navigate(`/recipes/${savedRecipe.id}`);
    } catch (error) {
      console.error('Failed to save recipe:', error);
      alert('레시피 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            title={title}
            onTitleChange={setTitle}
            onNext={() => setCurrentStep(2)}
          />
        );
      case 2:
        return (
          <Step2Ingredients
            ingredients={ingredients}
            existingIngredients={existingIngredients}
            onIngredientsChange={setIngredients}
            onAddNewIngredient={handleAddNewIngredient}
            onPrev={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        );
      case 3:
        return (
          <Step3CookingSteps
            steps={steps}
            ingredients={ingredients}
            cookingMetas={cookingMetas}
            onStepsChange={setSteps}
            onPrev={() => setCurrentStep(2)}
            onNext={() => setCurrentStep(4)}
          />
        );
      case 4:
        return (
          <Step4AdditionalInfo
            mainImgUrl={mainImgUrl}
            videoUrl={videoUrl}
            onMainImgUrlChange={setMainImgUrl}
            onVideoUrlChange={setVideoUrl}
            onPrev={() => setCurrentStep(3)}
            onNext={() => setCurrentStep(5)}
          />
        );
      case 5:
        return (
          <Step5Summary
            title={title}
            ingredients={ingredients}
            steps={steps}
            cookingMetas={cookingMetas}
            mainImgUrl={mainImgUrl}
            videoUrl={videoUrl}
            onPrev={() => setCurrentStep(4)}
            onSave={handleSave}
            isSaving={isSaving}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
          >
            ← 홈으로
          </Link>
          <h1 className="text-2xl font-bold mt-2 text-gray-800 dark:text-gray-100">
            새 레시피 만들기
          </h1>
        </div>

        {/* 스텝 인디케이터 */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={5}
          stepLabels={STEP_LABELS}
        />

        {/* 스텝 컨텐츠 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
