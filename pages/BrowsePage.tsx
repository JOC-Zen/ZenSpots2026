
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Space, FiltersState } from '../types';
import { SpaceCardEnhanced } from '../components/SpaceCardEnhanced';
import { SearchAndFilter } from '../components/SearchAndFilter';
import { LoadingPage, LoadingCards } from '../components/Loading';
import { UserContext } from '../contexts/UserContext';
import { mockSpaces } from '../data/mockData';
import { supabase } from '../utils/supabaseClient';
import { SpaceType } from '../types';
import { filterSpaces, sortSpacesByDistance } from '../utils';

interface BrowsePageProps {
  onSelectSpace: (space: Space) => void;
  initialFilters?: Partial<FiltersState> | null;
}

export const BrowsePage: React.FC<BrowsePageProps> = ({ onSelectSpace, initialFilters }) => {
  const { user } = useContext(UserContext);
  const userLoading = false; // User context doesn't have loading state
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [filters, setFilters] = useState<FiltersState>({
    location: initialFilters?.location || '',
    priceRange: [0, 100],
    spaceTypes: initialFilters?.spaceTypes || [],
    capacity: initialFilters?.capacity || 1,
    date: initialFilters?.date || '',
  });

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Error getting location:', error);
          // Default to Madrid
          setUserLocation({ lat: 40.4168, lng: -3.7038 });
        }
      );
    } else {
      // Default to Madrid
      setUserLocation({ lat: 40.4168, lng: -3.7038 });
    }
  }, []);

  // Load spaces from Supabase with fallback to mockSpaces
  useEffect(() => {
    const loadSpaces = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('spaces')
          .select('*');

        if (error) {
          console.error('Supabase error:', error);
          setSpaces(mockSpaces);
          return;
        }

        if (!data || data.length === 0) {
          setSpaces(mockSpaces);
          return;
        }

        const mapped: Space[] = data.map((row: any) => ({
          id: row.id,
          title: row.title,
          type: row.type as SpaceType,
          description: row.description ?? '',
          location: {
            address: row.address ?? '',
            city: row.city ?? '',
            lat: row.lat ?? 0,
            lng: row.lng ?? 0,
          },
          capacity: row.capacity ?? 1,
          pricePerHour: Number(row.price_per_hour ?? 0),
          amenities: (row.amenities ?? []) as string[],
          images: (row.images ?? []) as string[],
          hostId: row.host_id ?? 0,
          rating: Number(row.rating ?? 0),
          reviewCount: Number(row.review_count ?? 0),
          availability: row.availability ?? {},
        }));

        setSpaces(mapped);
      } catch (err) {
        console.error('Error loading spaces:', err);
        setSpaces(mockSpaces);
      } finally {
        setLoading(false);
      }
    };

    loadSpaces();
  }, []);

  // Filter and sort spaces
  const filteredSpaces = useMemo(() => {
    let filtered = filterSpaces(spaces, filters);
    
    // Sort by distance if user location is available
    if (userLocation) {
      filtered = sortSpacesByDistance(filtered, userLocation.lat, userLocation.lng);
    }
    
    return filtered;
  }, [spaces, filters, userLocation]);

  if (userLoading) {
    return <LoadingPage message="Cargando usuario..." />;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingCards count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-zen-primary text-white rounded-lg hover:bg-zen-primary-dark transition-colors"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-zen-charcoal mb-2">
            Encuentra tu espacio perfecto
          </h1>
          <p className="text-gray-600">
            {filteredSpaces.length} espacios disponibles en tu zona
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <SearchAndFilter
          spaces={spaces}
          onFiltersChange={setFilters}
          initialFilters={filters}
        />

        {/* Results */}
        {filteredSpaces.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-xl mb-4">
              No se encontraron espacios con esos filtros
            </div>
            <p className="text-gray-400 mb-6">
              Intenta ajustar tus criterios de búsqueda
            </p>
            <button
              onClick={() => setFilters({
                location: '',
                priceRange: [0, 100],
                spaceTypes: [],
                capacity: 1,
                date: '',
              })}
              className="px-6 py-3 bg-zen-secondary text-zen-charcoal rounded-lg hover:bg-zen-primary hover:text-white transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSpaces.map((space) => (
              <SpaceCardEnhanced
                key={space.id}
                space={space}
                onSelect={(id) => onSelectSpace(space)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};