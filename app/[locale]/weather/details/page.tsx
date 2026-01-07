'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function WeatherDetailsPage() {
  const t = useTranslations('weatherDetails');
  const locale = useLocale();

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🌤️ {t('title')}
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {t('subtitle')}
          </p>
          <p className="text-sm text-gray-500">
            {t('description')}
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card hover className="text-center">
            <div className="text-5xl mb-4">🌡️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('features.temperature.title')}</h3>
            <p className="text-gray-600">{t('features.temperature.description')}</p>
          </Card>

          <Card hover className="text-center">
            <div className="text-5xl mb-4">💧</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('features.rainfall.title')}</h3>
            <p className="text-gray-600">{t('features.rainfall.description')}</p>
          </Card>

          <Card hover className="text-center">
            <div className="text-5xl mb-4">🌪️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('features.wind.title')}</h3>
            <p className="text-gray-600">{t('features.wind.description')}</p>
          </Card>

          <Card hover className="text-center">
            <div className="text-5xl mb-4">☀️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('features.uv.title')}</h3>
            <p className="text-gray-600">{t('features.uv.description')}</p>
          </Card>
        </div>

        {/* How it works */}
        <Card className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('howItWorks.title')}</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('howItWorks.step1.title')}</h3>
                <p className="text-gray-600">{t('howItWorks.step1.description')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('howItWorks.step2.title')}</h3>
                <p className="text-gray-600">{t('howItWorks.step2.description')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('howItWorks.step3.title')}</h3>
                <p className="text-gray-600">{t('howItWorks.step3.description')}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Benefits */}
        <Card className="mb-8 bg-blue-50">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('benefits.title')}</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span>{t('benefits.item1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span>{t('benefits.item2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span>{t('benefits.item3')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span>{t('benefits.item4')}</span>
            </li>
          </ul>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
            <p className="text-green-50 mb-6 text-lg">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/register`}>
                <Button size="lg" variant="primary" className="transform hover:scale-105 shadow-xl bg-blue-600 hover:bg-blue-700 text-white border-0 font-semibold">
                  {t('cta.createAccount')}
                </Button>
              </Link>
              <Link href={`/${locale}/contact`} className="px-6 py-3 text-lg font-semibold bg-white text-green-700 rounded-lg border-2 border-white transform hover:scale-105 shadow-xl hover:shadow-2xl transition-all duration-200 hover:bg-green-50 hover:border-green-200 inline-block text-center">
                {t('cta.contactUs')}
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

