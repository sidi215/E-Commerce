'use client';

import { useEffect } from 'react';

interface LocaleAttributesProps {
  locale: string;
}

export default function LocaleAttributes({ locale }: LocaleAttributesProps) {
  useEffect(() => {
    // Set lang and dir attributes on html and body elements
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
      document.body.dir = locale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale]);

  return null;
}

