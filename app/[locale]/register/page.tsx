'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Card from '@/components/Card';

export default function RegisterPage() {
  const t = useTranslations('register');
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'farmer',
    region: '',
    profilePhoto: '',
  });
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const regions = ['Guidimaka', 'Gorgol', 'Brakna', 'Tarza', 'Autre'];

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData({ ...formData, profilePhoto: result });
        setProfilePhotoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePhoto = () => {
    setFormData({ ...formData, profilePhoto: '' });
    setProfilePhotoPreview(null);
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    
    // API URL - sera configuré pour le back-end
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    try {
      const response = await fetch(`${API_URL}/api/auth/register/`, {
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
        console.error('Registration failed');
      }
    } catch (err) {
      console.error('Error during registration', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-12 px-4">
      <Card className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌾</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('profilePhoto')} <span className="text-gray-400 text-xs">({t('optional')})</span>
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                {profilePhotoPreview ? (
                  <div className="relative">
                    <img
                      src={profilePhotoPreview}
                      alt="Photo de profil"
                      className="w-24 h-24 rounded-full object-cover border-4 border-green-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveProfilePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      title="Supprimer la photo"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                    <span className="text-4xl">👤</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition-colors">
                  {profilePhotoPreview ? t('changePhoto') : t('choosePhoto')}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">{t('photoHint')}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('accountType')}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, userType: 'farmer' })}
                className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  formData.userType === 'farmer'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-300 hover:border-green-300'
                }`}
              >
                <div className="text-3xl mb-2">👨‍🌾</div>
                <div className="font-medium">{t('farmer')}</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, userType: 'buyer' })}
                className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  formData.userType === 'buyer'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-300 hover:border-green-300'
                }`}
              >
                <div className="text-3xl mb-2">🛒</div>
                <div className="font-medium">{t('buyer')}</div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {t('fullName')}
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('email')}
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {t('phone')}
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="+222 XX XX XX XX"
                required
              />
            </div>

            {formData.userType === 'farmer' && (
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('region')}
                </label>
                <select
                  id="region"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">{t('selectRegion')}</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t('confirmPassword')}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                >
                  {showConfirmPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              {t('acceptTerms')}{' '}
              <Link href={`/${locale}/terms`} className="text-green-600 hover:text-green-700 underline" target="_blank">
                {t('readTerms')}
              </Link>
            </label>
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg">
            {t('submit')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t('hasAccount')}{' '}
            <Link href={`/${locale}/login`} className="text-green-600 font-medium hover:text-green-700">
              {t('login')}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

