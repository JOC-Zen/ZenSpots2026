import React, { useContext } from 'react';
import { Space } from '../types';
import { UserContext } from '../contexts/UserContext';
import { formatCurrency, getStarRating, truncateText } from '../utils';
import { LocationPinIcon } from './icons/LocationPinIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ClockIcon } from './icons/ClockIcon';
import { HeartIcon as HeartOutline } from 'lucide-react';
import { HeartIcon as HeartSolid } from 'lucide-react';

interface SpaceCardProps {
  space: Space;
  onSelect: (id: number) => void;
  className?: string;
}

export const SpaceCardEnhanced: React.FC<SpaceCardProps> = ({ space, onSelect, className = '' }) => {
  const { user, toggleFavorite } = useContext(UserContext);
  const isFavorite = user?.favoriteSpaceIds?.includes(space.id) || false;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      toggleFavorite(space.id);
    }
  };

  const handleCardClick = () => {
    onSelect(space.id);
  };

  const stars = getStarRating(space.rating);

  return (
    <div 
      className={`card cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}
      onClick={handleCardClick}
      data-testid="space-card"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={space.images[0]}
          alt={space.title}
          className="w-full h-40 sm:h-56 lg:h-64 xl:h-72 object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.src = '/images/space-placeholder.svg'; }}
        />
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200"
          aria-label={isFavorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
        >
          {isFavorite ? (
            <HeartSolid className="h-5 w-5 text-red-500 fill-current" />
          ) : (
            <HeartOutline className="h-5 w-5 text-gray-600" />
          )}
        </button>

        {/* Space Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="badge badge-info">
            {space.type}
          </span>
  </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-zen-charcoal line-clamp-2">
            {space.title}
          </h3>
          <div className="text-right ml-2">
            <div className="text-xl font-bold text-zen-primary">
              {formatCurrency(space.pricePerHour)}
            </div>
            <div className="text-sm text-gray-500">/hora</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-zen-charcoal-light mb-4 line-clamp-3">
          {truncateText(space.description, 120)}
        </p>

        {/* Location */}
        <div className="flex items-center text-sm text-zen-charcoal-light mb-3">
          <LocationPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">
            {space.location.address}, {space.location.city}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-zen-charcoal-light mb-4">
          <div className="flex items-center">
            <UsersIcon className="h-4 w-4 mr-1" />
            <span>Hasta {space.capacity} personas</span>
          </div>
          <div className="flex items-center">
            <div className="flex mr-1">
              {stars.map((star, index) => (
                <span key={index} className="text-yellow-400 text-sm">
                  {star}
                </span>
              ))}
            </div>
            <span>({space.reviewCount})</span>
          </div>
        </div>

        {/* Amenities Preview */}
        {space.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {space.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="text-xs bg-zen-secondary text-zen-charcoal px-2 py-1 rounded-full"
                >
                  {amenity}
                </span>
              ))}
              {space.amenities.length > 3 && (
                <span className="text-xs text-zen-charcoal-light">
                  +{space.amenities.length - 3} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button className="w-full btn btn-primary" data-testid="btn-ver-disponibilidad">
          <ClockIcon className="h-4 w-4 mr-2" />
          Ver disponibilidad
        </button>
      </div>
    </div>
  );
};

export default SpaceCardEnhanced;