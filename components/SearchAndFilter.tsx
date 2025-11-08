import React, { useState, useEffect, useMemo } from 'react';
import { Space, SpaceType, FiltersState } from '../types';
import { formatCurrency, debounce } from '../utils';
import { SearchIcon, LocationPinIcon, CalendarIcon } from './icons';

interface SearchAndFilterProps {
  spaces: Space[];
  onFiltersChange: (filters: FiltersState) => void;
  initialFilters?: Partial<FiltersState>;
}

const spaceTypes: SpaceType[] = [
  'Consultorio',
  'Estudio de Yoga',
  'Oficina Privada',
  'Terapia',
  'Sala de Reuniones',
  'Espacio de Masajes',
  'Medicina Natural',
];

const capacityOptions = [
  { value: 1, label: '1 persona' },
  { value: 2, label: '2 personas' },
  { value: 5, label: 'Hasta 5 personas' },
  { value: 10, label: 'Hasta 10 personas' },
  { value: 20, label: 'Más de 10 personas' },
];

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  spaces,
  onFiltersChange,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<FiltersState>({
    location: initialFilters?.location || '',
    priceRange: initialFilters?.priceRange || [0, 100],
    spaceTypes: initialFilters?.spaceTypes || [],
    capacity: initialFilters?.capacity || 1,
    date: initialFilters?.date || '',
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [showFilters, setShowFilters] = useState(false);

  // Get price range from spaces
  useEffect(() => {
    if (spaces.length > 0) {
      const prices = spaces.map(space => space.pricePerHour);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
      setFilters(prev => ({
        ...prev,
        priceRange: [minPrice, maxPrice],
      }));
    }
  }, [spaces]);

  // Debounced filter change
  const debouncedFilterChange = useMemo(
    () => debounce((newFilters: FiltersState) => {
      onFiltersChange(newFilters);
    }, 300),
    [onFiltersChange]
  );

  const handleFilterChange = (key: keyof FiltersState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    debouncedFilterChange(newFilters);
  };

  const handleSpaceTypeToggle = (spaceType: SpaceType) => {
    const newTypes = filters.spaceTypes.includes(spaceType)
      ? filters.spaceTypes.filter(type => type !== spaceType)
      : [...filters.spaceTypes, spaceType];
    handleFilterChange('spaceTypes', newTypes);
  };

  const clearFilters = () => {
    const clearedFilters: FiltersState = {
      location: '',
      priceRange,
      spaceTypes: [],
      capacity: 1,
      date: '',
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFiltersCount = [
    filters.location && 1,
    filters.spaceTypes.length > 0 && 1,
    filters.capacity > 1 && 1,
    filters.date && 1,
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      {/* Main Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <LocationPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="¿Dónde buscas un espacio?"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-zen-primary focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
            className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-zen-primary focus:border-transparent"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="relative px-6 py-3 bg-zen-secondary text-zen-charcoal rounded-lg hover:bg-zen-primary hover:text-white transition-colors flex items-center gap-2"
        >
          <SearchIcon className="h-5 w-5" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-zen-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t pt-6 space-y-6">
          {/* Price Range */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Rango de precio</h3>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {formatCurrency(priceRange[0])}
              </span>
              <input
                type="range"
                min={priceRange[0]}
                max={priceRange[1]}
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [priceRange[0], parseInt(e.target.value)])}
                className="flex-1"
              />
              <span className="text-sm text-gray-600">
                {formatCurrency(filters.priceRange[1])}
              </span>
            </div>
          </div>

          {/* Space Types */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Tipo de espacio</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {spaceTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleSpaceTypeToggle(type)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.spaceTypes.includes(type)
                      ? 'bg-zen-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Capacity */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Capacidad</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {capacityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('capacity', option.value)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.capacity === option.value
                      ? 'bg-zen-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Limpiar todos los filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;