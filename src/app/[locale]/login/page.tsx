'use client'

import { authenticateUser, LoginCredentials } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { Chrome, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('Login')
  const errorsT = useTranslations('Errors')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string, password?: string }>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const validateForm = () => {
    const newErrors: { email?: string, password?: string } = {}

    if (!formData.email) {
      newErrors.email = errorsT('emailRequired')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = errorsT('invalidEmail')
    }

    if (!formData.password) {
      newErrors.password = errorsT('passwordRequired')
    } else if (formData.password.length < 6) {
      newErrors.password = errorsT('passwordMinLength')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const credentials: LoginCredentials = {
        email: formData.email,
        password: formData.password
      }

      const result = authenticateUser(credentials)

      setIsLoading(false)

      if (result.success && result.redirectTo) {
        // 根据用户角色跳转到不同页面
        const target = result.redirectTo.startsWith('/') ? result.redirectTo : `/${result.redirectTo}`
        router.push(`/${locale}${target}`)
      } else {
        // 显示错误信息
        const errorMessage = result.error === 'Invalid email or password'
          ? errorsT('invalidCredentials')
          : errorsT('generic')
        setErrors({
          email: errorMessage,
          password: ' ' // 避免重复显示错误
        })
      }
    }, 1500)
  }

  const handleGoogleLogin = () => {
    setIsLoading(true)
    // Simulate Google OAuth
    setTimeout(() => {
      setIsLoading(false)
      router.push(`/${locale}/dashboard`)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAE6F5] via-white to-[#EAE6F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#8573bd] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-[#E8B98A] rounded"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('fields.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={cn(
                    "block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8573bd] focus:border-transparent transition-all",
                    errors.email
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300"
                  )}
                  placeholder={t('fields.emailPlaceholder')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('fields.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={cn(
                    "block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8573bd] focus:border-transparent transition-all",
                    errors.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300"
                  )}
                  placeholder={t('fields.passwordPlaceholder')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#8573bd] focus:ring-[#8573bd] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  {t('fields.rememberMe')}
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-[#8573bd] hover:text-[#E8B98A] font-medium"
              >
                {t('fields.forgotPassword')}
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all",
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#8573bd] hover:bg-[#E8B98A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8573bd]"
              )}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {t('actions.signingIn')}
                </div>
              ) : (
                t('actions.signIn')
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t('divider')}</span>
              </div>
            </div>
          </div>

          {/* Google Login Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className={cn(
                "w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white transition-all",
                isLoading
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8573bd]"
              )}
            >
              <Chrome className="w-5 h-5 mr-3 text-gray-500" />
              {isLoading ? t('google.loading') : t('google.button')}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('signup.prompt')}{' '}
              <button
                type="button"
                className="font-medium text-[#8573bd] hover:text-[#E8B98A]"
                onClick={() => {
                  // For demo, just redirect to dashboard
                  router.push(`/${locale}/register`)
                }}
              >
                {t('signup.link')}
              </button>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 space-y-3">
          {/* Admin Account */}
          <div className="p-4 bg-[#EAE6F5] rounded-lg border border-[#8573bd]">
            <h3 className="text-sm font-medium text-gray-900 mb-2">{t('demo.adminTitle')}</h3>
            <p className="text-xs text-gray-700 mb-1">
              <strong>{t('demo.adminEmail')}</strong> admin@healing-together.com
            </p>
            <p className="text-xs text-gray-700">
              <strong>{t('demo.adminPassword')}</strong> admin123
            </p>
            <p className="text-xs text-[#8573bd] mt-1 italic">
              {t('demo.adminNote')}
            </p>
          </div>

          {/* Regular User */}
          <div className="p-4 bg-orange-50 rounded-lg border border-[#E8B98A]">
            <h3 className="text-sm font-medium text-gray-900 mb-2">{t('demo.userTitle')}</h3>
            <p className="text-xs text-gray-700">
              {t('demo.userHint')}
            </p>
            <p className="text-xs text-[#E8B98A] mt-1">
              {t('demo.userExample')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
