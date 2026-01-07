import Image from 'next/image';
import Link from 'next/link';
import Card from './Card';

interface CardPlantProps {
  id: string;
  name: string;
  type: string;
  image?: string;
  healthStatus: 'healthy' | 'sick' | 'warning';
  lastWatered?: string;
  location?: string;
}

export default function CardPlant({
  id,
  name,
  type,
  image,
  healthStatus,
  lastWatered,
  location,
}: CardPlantProps) {
  const statusColors = {
    healthy: 'bg-green-100 text-green-800',
    sick: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };

  const statusText = {
    healthy: 'En bonne santé',
    sick: 'Malade',
    warning: 'Attention',
  };

  return (
    <Card hover className="cursor-pointer">
      <Link href={`/my-plants/${id}`}>
        <div className="relative h-48 w-full mb-4 bg-gray-200 rounded-lg overflow-hidden">
          {image ? (
            // Use a regular <img> for data URLs (uploaded from the client).
            // Keep `next/image` for external/remote URLs for optimization.
            image.startsWith('data:') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <Image src={image} alt={name} fill className="object-cover" />
            )
          ) : (
            <div className="flex items-center justify-center h-full text-6xl">🌱</div>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-3">{type}</p>
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[healthStatus]}`}>
            {statusText[healthStatus]}
          </span>
          {location && (
            <span className="text-xs text-gray-500">📍 {location}</span>
          )}
        </div>
        {lastWatered && (
          <p className="text-xs text-gray-500 mt-2">💧 Arrosé: {lastWatered}</p>
        )}
      </Link>
    </Card>
  );
}

