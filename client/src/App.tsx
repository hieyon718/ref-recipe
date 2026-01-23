import { LoginButton } from './components/LoginButton'
import { useAuth } from './hooks/useAuth'
import './App.css'

function App() {
  const { isLoading, isAuthenticated, user } = useAuth()

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">로딩 중...</div>
  }

  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">냉참</h1>
        <LoginButton />
      </header>

      <main>
        {isAuthenticated && user ? (
          <div>
            <h2 className="text-xl mb-4">안녕하세요, {user.nickname}님!</h2>
            <p>냉장고 속 재료로 만들 수 있는 레시피를 찾아보세요.</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-xl mb-4">냉장고 참고서</h2>
            <p className="mb-8">요리는 가볍게, 기록은 스마트하게.</p>
            <p className="text-gray-500">로그인하여 나만의 레시피를 관리하세요.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
