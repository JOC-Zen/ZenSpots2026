import React, { useState } from 'react';
import { Space } from '../types';

interface MapViewProps {
    spaces: Space[];
    onSelectSpace: (id: number) => void;
}

export const MapView: React.FC<MapViewProps> = ({ spaces, onSelectSpace }) => {
    const [hoveredSpaceId, setHoveredSpaceId] = useState<number | null>(null);

    // These are scaling factors for a conceptual map of Spain.
    // A real implementation would use a library like Leaflet or Google Maps.
    const mapDimensions = { width: 800, height: 600 };
    const bounds = {
        minLat: 36, maxLat: 44, // Spain's approx latitude
        minLng: -9, maxLng: 3,   // Spain's approx longitude
    };

    const convertGeoToPixel = (lat: number, lng: number) => {
        const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * mapDimensions.width;
        const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * mapDimensions.height;
        return { x, y };
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-zen-border h-[600px] relative overflow-hidden">
            {/* Placeholder map background */}
            <div className="absolute inset-0 bg-zen-secondary opacity-50"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-carbon.png')] opacity-5"></div>
            
            <div className="relative w-full h-full">
                {spaces.map(space => {
                    const { x, y } = convertGeoToPixel(space.location.lat, space.location.lng);
                    return (
                        <div
                            key={space.id}
                            className="absolute transform -translate-x-1/2 -translate-y-full"
                            style={{ left: `${x}px`, top: `${y}px` }}
                            onMouseEnter={() => setHoveredSpaceId(space.id)}
                            onMouseLeave={() => setHoveredSpaceId(null)}
                        >
                            <button 
                                onClick={() => onSelectSpace(space.id)}
                                className="bg-white text-zen-primary-dark font-bold text-sm px-3 py-1 rounded-full shadow-lg hover:scale-110 hover:bg-zen-primary hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-zen-primary-dark"
                                aria-label={`Ver detalles de ${space.title}`}
                            >
                                €{space.pricePerHour}
                            </button>
                            <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-white transform -translate-x-1/2 rotate-45 shadow-lg"></div>

                            {/* Tooltip */}
                            {hoveredSpaceId === space.id && (
                                <div className="absolute bottom-full mb-2 w-48 bg-white p-2 rounded-lg shadow-xl border border-zen-border z-10 transform -translate-x-1/2 left-1/2">
                                    <img src={space.images[0]} alt={space.title} className="w-full h-20 object-cover rounded-md mb-2" />
                                    <h4 className="font-bold text-sm text-zen-charcoal truncate">{space.title}</h4>
                                    <p className="text-xs text-zen-charcoal-light">{space.location.city}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
             <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-lg text-xs text-zen-charcoal shadow">
                Mapa de ejemplo. Las posiciones son aproximadas.
            </div>
        </div>
    );
};