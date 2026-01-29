interface Step1BasicInfoProps {
  title: string;
  onTitleChange: (title: string) => void;
  onNext: () => void;
}

export default function Step1BasicInfo({ title, onTitleChange, onNext }: Step1BasicInfoProps) {
  const isValid = title.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Step 1: 기본 정보 입력
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          레시피의 이름을 입력해주세요.
        </p>
      </div>

      <div>
        <label htmlFor="recipe-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          레시피 이름 *
        </label>
        <input
          id="recipe-title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="예: 스팸 계란 볶음밥"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
        />
      </div>

      <div className="flex justify-end">
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
