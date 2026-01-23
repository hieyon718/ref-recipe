import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { useAuth } from '../hooks/useAuth'

export function LoginButton() {
  const { loginWithGoogle, isAuthenticated, user, logout } = useAuth()

  const handleSuccess = async (response: CredentialResponse) => {
    if (response.credential) {
      try {
        await loginWithGoogle(response.credential)
      } catch (error) {
        console.error('로그인 처리 실패:', error)
      }
    }
  }

  const handleError = () => {
    console.error('Google 로그인 실패')
  }

  // 이미 로그인된 경우
  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <img
          src={user.profileImg}
          alt={user.nickname}
          className="w-10 h-10 rounded-full"
        />
        <span>{user.nickname}</span>
        <button
          onClick={logout}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          로그아웃
        </button>
      </div>
    )
  }

  // 로그인 버튼
  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      useOneTap
      theme="outline"
      size="large"
      text="signin_with"
      shape="rectangular"
    />
  )
}
