
import React, { useState, useContext } from 'react';
import { Space, User, Review, Booking, Amenity } from '../types';
import { ImageGallery } from '../components/ImageGallery';
import { BookingWidget } from '../components/BookingWidget';
import { ReviewList } from '../components/ReviewList';
import { LocationPinIcon } from '../components/icons/LocationPinIcon';
import { UsersIcon } from '../components/icons/UsersIcon';
import { GenericIcon } from '../components/icons/GenericIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import { StarIcon } from '../components/icons';
import { formatCurrency, getStarRating, calculateDistance } from '../utils';
import { UserContext } from '../contexts/UserContext';

interface SpaceDetailPageProps {
    space: Space;
    host?: User;
    reviews: Review[];
    bookingsForSpace: Booking[];
    onBack: () => void;
    onBook: (bookingDetails: Omit<Booking, 'id' | 'space'>, recurrence: { type: 'none' | 'weekly' | 'monthly', count: number }) => void;
}

const AmenityItem: React.FC<{ amenity: Amenity }> = ({ amenity }) => (
    <div className="flex items-center text-zen-charcoal-light">
        <GenericIcon type="check" />
        <span className="ml-3">{amenity}</span>
    </div>
);

export const SpaceDetailPage: React.FC<SpaceDetailPageProps> = ({ space, host, reviews, bookingsForSpace, onBack, onBook }) => {
    const { user } = useContext(UserContext);
    const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    
    // Get user location for distance calculation
    React.useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setUserLocation(location);
                    
                    // Calculate distance to space
                    const dist = calculateDistance(
                        location.lat,
                        location.lng,
                        space.location.lat,
                        space.location.lng
                    );
                    setDistance(dist);
                },
                (error) => {
                    console.warn('Error getting location:', error);
                }
            );
        }
    }, [space.location.lat, space.location.lng]);
    
    // Split amenities for different sections
    const mainFeatures: Amenity[] = ['Insonorización Superior', 'Diseño Minimalista y Tranquilo', 'Abundante Luz Natural', 'Conectividad Wi-Fi de Alta Velocidad'];
    const includedServices: Amenity[] = ['Wifi', 'AC', 'Proyector', 'Pizarra', 'Material de Yoga', 'Camilla de Masaje', 'Música Ambiental', 'Privacidad', 'Utensilios básicos', 'Botiquín', 'Calefacción', 'Estacion de Té Herbal', 'Cojines de Meditación'];

    const spaceMainFeatures = space.amenities.filter(a => mainFeatures.includes(a));
    const spaceIncludedServices = space.amenities.filter(a => includedServices.includes(a));
    
    const stars = getStarRating(space.rating);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
                <button onClick={onBack} className="mb-6 text-sm font-medium text-zen-primary-dark hover:underline flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Volver a los resultados
                </button>
                
                <div className="mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-zen-charcoal mb-2">{space.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-zen-charcoal-light mb-3">
                                <div className="flex items-center">
                                    <LocationPinIcon className="w-4 h-4 mr-1" />
                                    <span>{space.location.address}, {space.location.city}</span>
                                </div>
                                {distance && (
                                    <div className="flex items-center">
                                        <ClockIcon className="w-4 h-4 mr-1" />
                                        <span>A {distance.toFixed(1)} km de ti</span>
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <UsersIcon className="w-4 h-4 mr-1" />
                                    <span>Hasta {space.capacity} personas</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                    {stars.map((star, index) => (
                                        <StarIcon key={index} className="w-4 h-4 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <span className="text-sm text-zen-charcoal-light">
                                    {space.rating.toFixed(1)} ({space.reviewCount} reseñas)
                                </span>
                            </div>
                        </div>
                        <div className="text-right ml-4">
                            <div className="text-2xl md:text-3xl font-bold text-zen-primary">
                                {formatCurrency(space.pricePerHour)}
                            </div>
                            <div className="text-sm text-gray-500">por hora</div>
                        </div>
                    </div>
                </div>

                <ImageGallery images={space.images} title={space.title} />

                <div className="mt-12 lg:grid lg:grid-cols-3 lg:gap-12">
                    <div className="lg:col-span-2">
                        <div className="pb-8 border-b border-zen-border">
                            <p className="text-zen-charcoal-light leading-relaxed">{space.description}</p>
                        </div>
                        
                        {spaceMainFeatures.length > 0 && (
                            <div className="py-8 border-b border-zen-border">
                                <h3 className="text-xl font-semibold text-zen-charcoal mb-4">Características Principales</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {spaceMainFeatures.map(amenity => <AmenityItem key={amenity} amenity={amenity} />)}
                                </div>
                            </div>
                        )}

                        {spaceIncludedServices.length > 0 && (
                            <div className="py-8 border-b border-zen-border">
                                <h3 className="text-xl font-semibold text-zen-charcoal mb-4">Servicios Incluidos</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {spaceIncludedServices.map(amenity => <AmenityItem key={amenity} amenity={amenity} />)}
                                </div>
                            </div>
                        )}

                        <div id="reviews" className="py-8">
                            <ReviewList reviews={reviews} averageRating={space.rating} reviewCount={space.reviewCount} />
                        </div>
                    </div>

                    <aside className="lg:col-span-1">
                        <div className="space-y-6">
                            <BookingWidget space={space} onBook={onBook} bookings={bookingsForSpace} />
                            
                            {host && (
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-zen-charcoal mb-4">Anfitrión</h3>
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-zen-secondary rounded-full flex items-center justify-center text-zen-charcoal font-semibold">
                                            {host.name.charAt(0)}
                                        </div>
                                        <div className="ml-3">
                                            <div className="font-medium text-zen-charcoal">{host.name}</div>
                                            <div className="text-sm text-zen-charcoal-light">
                                                Miembro desde {new Date(host.joinDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full btn btn-secondary">
                                        Contactar con el anfitrión
                                    </button>
                                </div>
                            )}
                            
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-zen-charcoal mb-4">Información importante</h3>
                                <div className="space-y-3 text-sm text-zen-charcoal-light">
                                    <div className="flex items-start">
                                        <ClockIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>Horario flexible de entrada y salida</span>
                                    </div>
                                    <div className="flex items-start">
                                        <GenericIcon type="check" />
                                        <span className="ml-2">Cancelación gratuita hasta 24h antes</span>
                                    </div>
                                    <div className="flex items-start">
                                        <GenericIcon type="info" />
                                        <span className="ml-2">Se requiere identificación válida</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};