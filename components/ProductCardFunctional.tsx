import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    unit: string;
    quantity: number;
    category: string;
    status: 'available' | 'outOfStock';
    image: string;
    description: string;
    region: string;
  };
  onAddToCart?: (productId: string) => void;
  cartQuantity?: number;
  isPublic?: boolean;
  locale: string;
}

export default function ProductCard({ 
  product, 
  onAddToCart, 
  cartQuantity = 0, 
  isPublic = false,
  locale 
}: ProductCardProps) {
  const getButtonText = () => {
    if (isPublic) {
      return '🛒 Acheter maintenant';
    }
    return '🛒 Ajouter au panier';
  };

  const getButtonAction = () => {
    if (isPublic) {
      return `/${locale}/register`;
    }
    return onAddToCart ? () => onAddToCart(product.id) : undefined;
  };

  const ButtonComponent = isPublic ? Link : Button;

  return (
    <Card hover className="overflow-hidden border border-gray-200 hover:border-green-400 transition-all duration-300">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          {product.status === 'available' ? '✅ Disponible' : '❌ Rupture'}
        </div>
        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
          📍 {product.region}
        </div>
      </div>
      
      <div className="p-4 bg-white">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 flex-1">{product.name}</h3>
          <div className="text-right ml-2">
            <div className="text-xl font-bold text-green-600">{product.price}</div>
            <div className="text-xs text-gray-500">MRU/{product.unit}</div>
          </div>
        </div>
        
        <p className="text-gray-600 mb-3 text-xs line-clamp-2">{product.description}</p>
        
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <div className="text-xs text-gray-500">Stock</div>
            <div className="font-semibold text-sm">{product.quantity}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Unité</div>
            <div className="font-semibold text-sm">{product.unit}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Catégorie</div>
            <div className="font-semibold text-sm">{product.category}</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          {isPublic ? (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>⭐ 4.8 (127 avis)</span>
              <span>•</span>
              <span>🚚 Livraison gratuite</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onAddToCart(product.id)}
                className="h-8 w-8 p-0 flex items-center justify-center"
              >
                -
              </Button>
              <span className="font-bold text-green-600 min-w-[30px] text-center">{cartQuantity}</span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onAddToCart(product.id)}
                className="h-8 w-8 p-0 flex items-center justify-center"
              >
                +
              </Button>
            </div>
          )}
          <Button 
            variant="primary" 
            size="sm"
            onClick={!isPublic ? getButtonAction() : undefined}
            className="bg-green-600 hover:bg-green-700"
          >
            {getButtonText()}
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-2">
          <span>📦 {product.category}</span>
          <span>🚚 Livraison 24h</span>
        </div>
      </div>
    </Card>
  );
}
