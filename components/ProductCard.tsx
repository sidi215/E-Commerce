"use client";

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import CardProduct from './CardProduct';

interface ProductCardProps {
  // all CardProduct props
  id: string;
  name: string;
  price: number;
  unit: string;
  image?: string;
  farmer: string;
  location: string;
  quantity: number;
  rating?: number;
  // page-level addToCart handler (only used when isDashboard=true)
  addToCart?: (id: string) => void;
  // Toggle behavior: marketplace (false) => redirect to register; dashboard (true) => add to cart
  isDashboard?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  unit,
  image,
  farmer,
  location,
  quantity,
  rating,
  addToCart,
  isDashboard = false,
}: ProductCardProps) {
  const router = useRouter();
  const locale = useLocale();

  const handleAction = (productId: string) => {
    if (isDashboard) {
      if (typeof addToCart === 'function') {
        addToCart(productId);
        return;
      }
      // fallback: no handler, do nothing (or navigate to product)
      router.push(`/${locale}/marketplace/${productId}`);
      return;
    }

    // Public marketplace: redirect to register/signup
    router.push(`/${locale}/register`);
  };

  return (
    <CardProduct
      id={id}
      name={name}
      price={price}
      unit={unit}
      image={image}
      farmer={farmer}
      location={location}
      quantity={quantity}
      rating={rating}
      onAddToCart={(pid: string) => handleAction(pid)}
    />
  );
}
