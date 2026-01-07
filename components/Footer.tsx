'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations('footer');

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <span>🌾</span>
              <span>AgriMauritanie</span>
            </h3>
            <p className="text-gray-400 text-sm">
              {t('description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href={`/${locale}`} className="hover:text-white transition-colors">{t('home')}</Link></li>
              <li><Link href={`/${locale}/about`} className="hover:text-white transition-colors">{t('about')}</Link></li>
              <li><Link href={`/${locale}/marketplace`} className="hover:text-white transition-colors">{t('marketplace')}</Link></li>
              <li><Link href={`/${locale}/diagnostic/details`} className="hover:text-white transition-colors">{t('diagnostic')}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">{t('services')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href={`/${locale}/diagnostic/details`} className="hover:text-white transition-colors">{t('diagnosticML')}</Link></li>
              <li><Link href={`/${locale}/marketplace`} className="hover:text-white transition-colors">{t('digitalMarket')}</Link></li>
              <li><Link href={`/${locale}/weather/details`} className="hover:text-white transition-colors">{t('weatherAdvice')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t('contact')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📧 24024@supnum.mr</li>
              <li>📱 +222 33 00 28 00</li>
              <li>📍 {t('location')}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} AgriMauritanie. {t('rights')}.</p>
        </div>
      </div>
    </footer>
  );
}

