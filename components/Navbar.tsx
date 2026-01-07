'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // À connecter avec l'état d'authentification
  const t = useTranslations('navbar');
  const locale = useLocale();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-xl">🌾</span>
            </div>
            <span className="text-xl font-bold text-green-700 group-hover:text-green-600 transition-colors">{t('title')}</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href={`/${locale}`} className="text-gray-700 hover:text-green-600 transition-colors relative group">
              {t('home')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href={`/${locale}/about`} className="text-gray-700 hover:text-green-600 transition-colors relative group">
              {t('about')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href={`/${locale}/marketplace`} className="text-gray-700 hover:text-green-600 transition-colors relative group">
              {t('marketplace')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href={`/${locale}/diagnostic/details`} className="text-gray-700 hover:text-green-600 transition-colors relative group">
              {t('diagnostic')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link href={`/${locale}/dashboard`} className="text-gray-700 hover:text-green-600 transition-colors relative group">
                  {t('dashboard')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href={`/${locale}/buyers`} className="text-gray-700 hover:text-green-600 transition-colors relative group">
                  🛒 {t('buyers')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href={`/${locale}/farmers`} className="text-gray-700 hover:text-green-600 transition-colors relative group">
                  👨‍🌾 {t('farmers')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href={`/${locale}/messaging`} className="text-gray-700 hover:text-green-600 transition-colors relative group">
                  💬 {t('messaging')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href={`/${locale}/profile`} className="text-gray-700 hover:text-green-600 transition-colors relative group">
                  {t('profile')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href={`/${locale}/admin/dashboard`} className="text-gray-700 hover:text-green-600 transition-colors relative group">
                  {t('admin')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 hover:shadow-lg active:scale-95">
                  {t('logout')}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href={`/${locale}/login`} className="text-gray-700 hover:text-green-600 transition-colors relative group">
                  {t('login')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href={`/${locale}/register`} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 hover:shadow-lg active:scale-95">
                  {t('register')}
                </Link>
              </div>
            )}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 animate-fade-in">
            <Link href={`/${locale}`} className="block text-gray-700 hover:text-green-600">{t('home')}</Link>
            <Link href={`/${locale}/about`} className="block text-gray-700 hover:text-green-600">{t('about')}</Link>
            <Link href={`/${locale}/marketplace`} className="block text-gray-700 hover:text-green-600">{t('marketplace')}</Link>
            <Link href={`/${locale}/diagnostic/details`} className="block text-gray-700 hover:text-green-600">{t('diagnostic')}</Link>
            {isLoggedIn ? (
              <>
                <Link href={`/${locale}/dashboard`} className="block text-gray-700 hover:text-green-600">{t('dashboard')}</Link>
                <Link href={`/${locale}/buyers`} className="block text-gray-700 hover:text-green-600">🛒 {t('buyers')}</Link>
                <Link href={`/${locale}/farmers`} className="block text-gray-700 hover:text-green-600">👨‍🌾 {t('farmers')}</Link>
                <Link href={`/${locale}/messaging`} className="block text-gray-700 hover:text-green-600">💬 {t('messaging')}</Link>
                <Link href={`/${locale}/profile`} className="block text-gray-700 hover:text-green-600">{t('profile')}</Link>
                <Link href={`/${locale}/admin/dashboard`} className="block text-gray-700 hover:text-green-600">{t('admin')}</Link>
                <button className="block w-full text-left text-red-500">{t('logout')}</button>
              </>
            ) : (
              <>
                <Link href={`/${locale}/login`} className="block text-gray-700 hover:text-green-600">{t('login')}</Link>
                <Link href={`/${locale}/register`} className="block bg-green-600 text-white px-4 py-2 rounded-lg text-center">{t('register')}</Link>
              </>
            )}
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

