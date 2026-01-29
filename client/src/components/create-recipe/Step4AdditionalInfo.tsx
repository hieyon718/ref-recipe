interface Step4AdditionalInfoProps {
  mainImgUrl: string;
  videoUrl: string;
  onMainImgUrlChange: (url: string) => void;
  onVideoUrlChange: (url: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Step4AdditionalInfo({
  mainImgUrl,
  videoUrl,
  onMainImgUrlChange,
  onVideoUrlChange,
  onPrev,
  onNext,
}: Step4AdditionalInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Step 4: 추가 정보 입력 (선택)
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          대표 사진이나 참고 영상 링크를 추가할 수 있습니다.
        </p>
      </div>

      {/* 대표 이미지 URL */}
      <div>
        <label htmlFor="main-img" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          대표 사진 URL
        </label>
        <input
          id="main-img"
          type="url"
          value={mainImgUrl}
          onChange={(e) => onMainImgUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
        />
        {mainImgUrl && (
          <div className="mt-3">
            <img
              src={mainImgUrl}
              alt="미리보기"
              className="max-w-xs max-h-48 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* 유튜브 링크 */}
      <div>
        <label htmlFor="video-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          유튜브 링크
        </label>
        <input
          id="video-url"
          type="url"
          value={videoUrl}
          onChange={(e) => onVideoUrlChange(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
        />
      </div>

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
          className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          다음
        </button>
      </div>
    </div>
  );
}
