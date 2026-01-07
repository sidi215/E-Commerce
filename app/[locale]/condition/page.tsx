'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Card from '@/components/Card';

export default function TermsPage() {
  const t = useTranslations('terms');
  const locale = useLocale();

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href={`/${locale}/register`} className="text-green-600 hover:text-green-700 mb-4 inline-block">
            ← Retour à l'inscription
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📋 {t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        <Card>
          <div className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section1.title')}</h2>
              <p className="text-gray-700 leading-relaxed">{t('section1.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section2.title')}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{t('section2.content')}</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>{t('section2.item1')}</li>
                <li>{t('section2.item2')}</li>
                <li>{t('section2.item3')}</li>
                <li>{t('section2.item4')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section3.title')}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{t('section3.content')}</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>{t('section3.item1')}</li>
                <li>{t('section3.item2')}</li>
                <li>{t('section3.item3')}</li>
                <li>{t('section3.item4')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section4.title')}</h2>
              <p className="text-gray-700 leading-relaxed">{t('section4.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section5.title')}</h2>
              <p className="text-gray-700 leading-relaxed">{t('section5.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('section6.title')}</h2>
              <p className="text-gray-700 leading-relaxed">{t('section6.content')}</p>
            </section>

            <section className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('acceptance.title')}</h2>
              <p className="text-gray-700">{t('acceptance.content')}</p>
            </section>

            <div className="pt-6 border-t">
              <p className="text-sm text-gray-500">
                {t('lastUpdated')}: {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <Link href={`/${locale}/register`}>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              {t('backToRegister')}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

