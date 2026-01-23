import { useState, useEffect, useCallback } from 'react'

interface User {
  id: string
  email: string
  nickname: string
  profileImg: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  })

  // 앱 시작 시 저장된 토큰으로 사용자 정보 복원
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const savedUser = localStorage.getItem('user')

    if (token && savedUser) {
      setAuthState({
        user: JSON.parse(savedUser),
        isLoading: false,
        isAuthenticated: true
      })
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  // Google 로그인 처리
  const loginWithGoogle = useCallback(async (idToken: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      })

      if (!response.ok) {
        throw new Error('로그인 실패')
      }

      const data = await response.json()

      // 토큰과 사용자 정보 저장
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('user', JSON.stringify(data.user))

      setAuthState({
        user: data.user,
        isLoading: false,
        isAuthenticated: true
      })

      return data.user
    } catch (error) {
      console.error('Google 로그인 에러:', error)
      throw error
    }
  }, [])

  // 로그아웃
  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')

    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false
    })
  }, [])

  // API 요청용 헤더 (인증 토큰 포함)
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('accessToken')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }, [])

  return {
    ...authState,
    loginWithGoogle,
    logout,
    getAuthHeaders
  }
}
