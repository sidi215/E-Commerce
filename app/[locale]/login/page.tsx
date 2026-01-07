'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Card from '@/components/Card';

export default function LoginPage() {
  const t = useTranslations('login');
  const locale = useLocale();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    region: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const regions = ['Guidimaka', 'Gorgol', 'Brakna', 'Tarza', 'Autre'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // API URL - sera configuré pour le back-end
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    try {
      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Persist user to localStorage
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        // Redirect based on user role
        if (data.user.role === 'farmer') {
          router.push(`/${locale}/dashboard_agri`);
        } else {
          router.push(`/${locale}/dashboard_ach`);
        }
      } else {
        console.error('Login failed');
      }
    } catch (err) {
      console.error('Error during login', err);
    }
  };

  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-12 px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌾</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t('email')}
            </label>
            <input
              type="text"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="test (simple) ou votre@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              {t('password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
              <span className="ml-2 text-sm text-gray-600">{t('rememberMe')}</span>
            </label>
            <Link href={`/${locale}/forgot-password`} className="text-sm text-green-600 hover:text-green-700">
              {t('forgotPassword')}
            </Link>
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg">
            {t('submit')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t('noAccount')}{' '}
            <Link href={`/${locale}/register`} className="text-green-600 font-medium hover:text-green-700">
              {t('createAccount')}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

