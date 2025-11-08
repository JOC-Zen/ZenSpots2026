
import React from 'react';
import { Space } from '../types';
import { SpaceCard } from './SpaceCard';

interface SpaceListProps {
    spaces: Space[];
    sortOrder: string;
    setSortOrder: (order: string) => void;
    onSelectSpace: (id: number) => void;
}

export const SpaceList: React.FC<SpaceListProps> = ({ spaces, sortOrder, setSortOrder, onSelectSpace }) => {
    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-baseline mb-6 pb-4 border-b border-zen-border">
                <h2 className="text-2xl font-bold text-zen-charcoal">{spaces.length} Espacios Encontrados</h2>
                <div className="flex items-center mt-4 sm:mt-0">
                    <label htmlFor="sort" className="text-sm font-medium text-zen-charcoal-light mr-2">Ordenar por:</label>
                    <select
                        id="sort"
                        name="sort"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="bg-gray-100 text-sm border-gray-200 focus:outline-none focus:ring-zen-primary focus:border-zen-primary rounded-lg"
                    >
                        <option value="price_asc">Precio: Más bajo primero</option>
                        <option value="price_desc">Precio: Más alto primero</option>
                        <option value="capacity_desc">Capacidad: Mayor a menor</option>
                    </select>
                </div>
            </div>
            {spaces.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {spaces.map(space => (
                        <SpaceCard key={space.id} space={space} onSelectSpace={onSelectSpace} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-zen-border">
                    <h3 className="text-xl font-medium text-zen-charcoal">No se encontraron espacios</h3>
                    <p className="text-zen-charcoal-light mt-2">Intenta ajustar tus filtros para encontrar el espacio perfecto.</p>
                </div>
            )}
        </div>
    );
};