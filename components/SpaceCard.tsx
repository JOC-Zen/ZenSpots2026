
import React from 'react';
import { Space, Amenity } from '../types';
import { LocationPinIcon } from './icons/LocationPinIcon';
import { UsersIcon } from './icons/UsersIcon';
import { WifiIcon } from './icons/WifiIcon';
import { GenericIcon } from './icons/GenericIcon';

interface SpaceCardProps {
    space: Space;
    onSelectSpace: (id: number) => void;
}

const AmenityIcon: React.FC<{ amenity: Amenity }> = ({ amenity }) => {
    const iconMap: { [key in Amenity]?: React.ReactNode } = {
        'Wifi': <WifiIcon className="w-4 h-4 text-gray-500" />,
        'AC': <GenericIcon type="snowflake" />,
        'Calefacción': <GenericIcon type="fire" />,
        'Proyector': <GenericIcon type="projector" />,
        'Pizarra': <GenericIcon type="board" />,
        'Privacidad': <GenericIcon type="lock" />,
        'Material de Yoga': <GenericIcon type="yoga" />,
        'Camilla de Masaje': <GenericIcon type="bed" />,
        'Música Ambiental': <GenericIcon type="music" />,
        'Utensilios básicos': <GenericIcon type="tools" />,
        'Botiquín': <GenericIcon type="firstaid" />,
    };

    const icon = iconMap[amenity];

    if (!icon) return null;

    return (
        <div className="flex items-center text-xs text-zen-charcoal-light">
            {icon}
            <span className="ml-1.5">{amenity}</span>
        </div>
    );
};

export const SpaceCard: React.FC<SpaceCardProps> = ({ space, onSelectSpace }) => {
    return (
        <div className="bg-white rounded-xl shadow-md border border-zen-border overflow-hidden transform hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="relative">
                <img
                    className="w-full h-40 sm:h-48 lg:h-56 xl:h-64 object-cover"
                    src={space.images[0]}
                    alt={space.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.src = '/images/space-placeholder.svg'; }}
                />
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-zen-charcoal leading-tight">{space.title}</h3>
                <div className="mt-2 flex items-center text-sm text-zen-charcoal-light">
                    <LocationPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                    <span>{space.location.city}</span>
                </div>
                <div className="mt-3 flex items-center text-sm text-zen-charcoal-light space-x-4">
                     <span className="flex items-center"><UsersIcon className="w-4 h-4 mr-1.5 flex-shrink-0" /> {space.capacity}</span>
                    {space.amenities.slice(0, 2).map(amenity => (
                        <AmenityIcon key={amenity} amenity={amenity} />
                    ))}
                </div>
                
                <div className="mt-auto pt-4 flex justify-between items-center">
                    <p className="text-xl font-bold text-zen-charcoal">
                        €{space.pricePerHour}<span className="text-sm font-normal text-gray-500">/hora</span>
                    </p>
                    <button onClick={() => onSelectSpace(space.id)} className="bg-zen-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-zen-primary-dark transition-colors duration-300">
                        Ver Detalles
                    </button>
                </div>
            </div>
        </div>
    );
};