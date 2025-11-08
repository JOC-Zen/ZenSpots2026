
import React from 'react';
import { FiltersState, SpaceType } from '../types';
import { LocationPinIcon } from './icons/LocationPinIcon';

interface FilterSidebarProps {
    filters: FiltersState;
    setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
}

const spaceTypeOptions: SpaceType[] = [
    'Consultorio', 'Estudio de Yoga', 'Oficina Privada', 'Terapia'
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters }) => {
    
    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, location: e.target.value }));
    };
    
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], value] }));
    };

    const handleSpaceTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFilters(prev => {
            const newSpaceTypes = checked 
                ? [...prev.spaceTypes, value as SpaceType]
                : prev.spaceTypes.filter(type => type !== value);
            return { ...prev, spaceTypes: newSpaceTypes };
        });
    };

    const handleCapacityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, capacity: parseInt(e.target.value, 10) }));
    };
    
    const useCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // This is a placeholder. A real app would use a geocoding service.
                    setFilters(prev => ({ ...prev, location: `Coords: ${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}` }));
                },
                (error) => {
                    console.error("Error getting location", error);
                    alert("No se pudo obtener la ubicación.");
                }
            );
        } else {
            alert("La geolocalización no es compatible con este navegador.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-zen-border sticky top-24">
            <h3 className="text-xl font-bold text-zen-charcoal mb-6">
                Filtros de Búsqueda
            </h3>
            
            <div className="space-y-6">
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-zen-charcoal-light">Ubicación</label>
                    <div className="mt-1">
                        <input type="text" name="location" id="location" value={filters.location} onChange={handleLocationChange} className="bg-gray-100 shadow-sm focus:ring-zen-primary focus:border-zen-primary block w-full sm:text-sm border-gray-200 rounded-lg" placeholder="Ciudad, Código Postal o Dirección" />
                    </div>
                    <button onClick={useCurrentLocation} className="mt-2 text-sm text-zen-primary-dark hover:text-zen-primary-dark/80 font-medium flex items-center">
                        <LocationPinIcon className="w-4 h-4 mr-1" />
                        Usar ubicación actual
                    </button>
                </div>

                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-zen-charcoal-light">Rango de Precios (€/hora)</label>
                    <div className="mt-1">
                        <input type="range" min="10" max="100" value={filters.priceRange[1]} onChange={handlePriceChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-zen-primary" />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>€10</span>
                            <span>€{filters.priceRange[1]}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-zen-charcoal-light">Tipo de Espacio</h4>
                    <div className="mt-2 space-y-2">
                        {spaceTypeOptions.map(type => (
                            <div key={type} className="flex items-center">
                                <input id={type} name="spaceType" type="checkbox" value={type} checked={filters.spaceTypes.includes(type)} onChange={handleSpaceTypeChange} className="h-4 w-4 text-zen-primary border-gray-300 rounded focus:ring-zen-primary" />
                                <label htmlFor={type} className="ml-3 text-sm text-gray-600">{type}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-zen-charcoal-light">Capacidad de Personas</label>
                    <select id="capacity" name="capacity" value={filters.capacity} onChange={handleCapacityChange} className="bg-gray-100 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-zen-primary focus:border-zen-primary sm:text-sm rounded-lg">
                        <option value="0">Cualquiera</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="5">5+</option>
                        <option value="10">10+</option>
                    </select>
                </div>
            </div>
        </div>
    );
};