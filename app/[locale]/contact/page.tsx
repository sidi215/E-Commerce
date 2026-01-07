
'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function ContactPage() {
  const t = useTranslations('contact');
  const locale = useLocale();

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📧 {t('title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card hover className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('email.title')}</h3>
            <p className="text-gray-600 mb-4">
              {t('email.description')}
            </p>
            <a href="mailto:24024@supnum.mr" className="text-green-600 hover:text-green-700 font-semibold">
              24024@supnum.mr
            </a>
          </Card>

          <Card hover className="text-center">
            <div className="text-5xl mb-4">📞</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('phone.title')}</h3>
            <p className="text-gray-600 mb-4">
              {t('phone.description')}
            </p>
            <a href="tel:+22233002800" className="text-green-600 hover:text-green-700 font-semibold">
              +222 33 00 28 00
            </a>
          </Card>
        </div>

        <div className="mt-6 text-center">
          <Link href={`/${locale}`}>
            <Button variant="outline">
              {t('backToHome')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
