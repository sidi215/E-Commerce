'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Card from './Card';
import Button from './Button';

interface CardProductProps {
  id: string;
  name: string;
  price: number;
  unit: string;
  image?: string;
  farmer: string;
  location: string;
  quantity: number;
  rating?: number;
  onAddToCart?: (id: string) => void;
}

export default function CardProduct({
  id,
  name,
  price,
  unit,
  image,
  farmer,
  location,
  quantity,
  rating,
  onAddToCart,
}: CardProductProps) {
  const t = useTranslations('marketplace');
  const locale = useLocale();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof onAddToCart === 'function') {
      onAddToCart(id);
      return;
    }

    // Fallback: no cart handler provided — navigate to product page
    router.push(`/${locale}/marketplace/${id}`);
  };
  
  return (
    <Card hover className="group">
      <Link href={`/${locale}/marketplace/${id}`}>
        <div className="relative h-48 w-full mb-4 bg-gray-200 rounded-lg overflow-hidden group-hover:shadow-lg transition-shadow duration-300">
          {image ? (
            <Image src={image} alt={name} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
          ) : (
            <div className="flex items-center justify-center h-full text-6xl group-hover:scale-110 transition-transform duration-300">🥬</div>
          )}
          {quantity < 10 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              {t('limitedStock')}
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-2">👨‍🌾 {farmer}</p>
        <p className="text-xs text-gray-500 mb-3">📍 {location}</p>
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-green-600">{price} MRU</span>
            <span className="text-sm text-gray-600"> / {unit}</span>
          </div>
          {rating && (
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500">⭐</span>
              <span className="text-sm text-gray-600">{rating}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-4">{t('availableStock')}: {quantity} {unit}</p>
        <Button
          fullWidth
          variant="primary"
          onClick={handleAddToCart}
          className="group-hover:shadow-lg"
        >
          {t('addToCart')}
        </Button>
      </Link>
    </Card>
  );
}

