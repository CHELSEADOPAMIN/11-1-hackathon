'use client';

import { cn } from '@/lib/utils';
import { Eye, EyeOff, Lock, Mail, Shield, User } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

type RegisterErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agree?: string;
};

export default function RegisterPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('Register');
  const errorsT = useTranslations('Errors');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name as keyof RegisterErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validate = () => {
    const nextErrors: RegisterErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!formData.name.trim()) {
      nextErrors.name = errorsT('nameRequired');
    }

    if (!formData.email.trim()) {
      nextErrors.email = errorsT('emailRequired');
    } else if (!emailRegex.test(formData.email)) {
      nextErrors.email = errorsT('invalidEmail');
    }

    if (!formData.password) {
      nextErrors.password = errorsT('passwordRequired');
    } else if (formData.password.length < 6) {
      nextErrors.password = errorsT('passwordMinLength');
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = errorsT('confirmPasswordRequired');
    } else if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = errorsT('passwordMismatch');
    }

    if (!formData.agree) {
      nextErrors.agree = t('fields.agree');
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(t('success'));
      router.push(`/${locale}/login`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAE6F5] via-white to-[#EAE6F5] flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#8573bd] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                {t('fields.name')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('fields.namePlaceholder')}
                  className={cn(
                    'block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8573bd] focus:border-transparent transition-all',
                    errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  )}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
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
                  onChange={handleChange}
                  placeholder={t('fields.emailPlaceholder')}
                  className={cn(
                    'block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8573bd] focus:border-transparent transition-all',
                    errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  )}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                  {t('fields.password')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('fields.passwordPlaceholder')}
                    className={cn(
                      'block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8573bd] focus:border-transparent transition-all',
                      errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    )}
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
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="confirmPassword">
                  {t('fields.confirmPassword')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t('fields.confirmPasswordPlaceholder')}
                    className={cn(
                      'block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8573bd] focus:border-transparent transition-all',
                      errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    )}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agree"
                  name="agree"
                  type="checkbox"
                  checked={formData.agree}
                  onChange={handleChange}
                  className={cn(
                    'h-4 w-4 rounded border-gray-300 text-[#8573bd] focus:ring-[#8573bd]',
                    errors.agree ? 'border-red-300 focus:ring-red-500' : undefined
                  )}
                />
              </div>
              <label htmlFor="agree" className="ml-2 text-sm text-gray-600">
                {t('fields.agree')}
              </label>
            </div>
            {errors.agree && <p className="-mt-4 text-sm text-red-600">{errors.agree}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all',
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#8573bd] hover:bg-[#E8B98A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8573bd]'
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {t('actions.signingUp')}
                </div>
              ) : (
                t('actions.signUp')
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('signin.prompt')}{' '}
              <button
                type="button"
                className="font-medium text-[#8573bd] hover:text-[#E8B98A]"
                onClick={() => router.push(`/${locale}/login`)}
              >
                {t('signin.link')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
