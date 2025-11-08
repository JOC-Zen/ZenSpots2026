
import React, { useState, useContext, useMemo } from 'react';
import { UserContext } from '../contexts/UserContext';
import { View } from '../App';
import { Space, Booking } from '../types';
import { SpaceCardEnhanced } from '../components/SpaceCardEnhanced';

interface ProfilePageProps {
    onNavigate: (view: View, contextId?: number) => void;
    allSpaces: Space[];
    allBookings: Booking[];
}

type ActiveTab = 'bookings' | 'favorites' | 'listings';

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate, allSpaces, allBookings }) => {
    const { user } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState<ActiveTab>('bookings');

    const userBookings = useMemo(() => {
        if (!user) return [];
        return allBookings.filter(b => b.userId === user.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [user, allBookings]);

    const userListings = useMemo(() => {
        if (!user || !user.isHost) return [];
        return allSpaces.filter(s => s.hostId === user.id);
    }, [user, allSpaces]);

    const favoriteSpaces = useMemo(() => {
        if (!user || !user.favoriteSpaceIds) return [];
        const favoriteSet = new Set(user.favoriteSpaceIds);
        return allSpaces.filter(s => favoriteSet.has(s.id));
    }, [user, allSpaces]);

    if (!user) {
        return <div className="text-center p-12 container mx-auto">Por favor, inicia sesión para ver tu perfil.</div>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white p-8 rounded-xl shadow-md border border-zen-border mb-8">
                    <div className="flex flex-col sm:flex-row items-center">
                        <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full mr-0 sm:mr-6 mb-4 sm:mb-0" />
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl font-bold text-zen-charcoal">{user.name}</h1>
                            <p className="text-gray-600">{user.email}</p>
                            <p className="text-gray-500 mt-2 text-sm">{user.bio}</p>
                            {user.isHost && (
                                <span className="mt-2 inline-block bg-zen-secondary text-zen-primary-dark text-xs font-semibold px-2.5 py-0.5 rounded-full">ANFITRIÓN</span>
                            )}
                        </div>
                    </div>
                     {user.isHost && (
                        <div className="mt-6 border-t border-zen-border pt-6">
                            <button onClick={() => onNavigate('host-dashboard')} data-testid="btn-host-dashboard" className="w-full bg-zen-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-zen-primary-dark transition-colors">
                               Ir al Panel de Anfitrión
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <div className="border-b border-zen-border">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('bookings')}
                                className={`${activeTab === 'bookings' ? 'border-zen-primary text-zen-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Mis Reservas ({userBookings.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('favorites')}
                                className={`${activeTab === 'favorites' ? 'border-zen-primary text-zen-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Favoritos ({favoriteSpaces.length})
                            </button>
                            {user.isHost && (
                                 <button
                                    onClick={() => setActiveTab('listings')}
                                    className={`${activeTab === 'listings' ? 'border-zen-primary text-zen-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Mis Espacios ({userListings.length})
                                </button>
                            )}
                        </nav>
                    </div>

                    <div className="mt-8">
                        {activeTab === 'bookings' && (
                            <div>
                                {userBookings.length > 0 ? (
                                    <div className="space-y-4">
                                        {userBookings.map(booking => (
                                            <div key={booking.id} className="bg-white p-4 rounded-lg shadow-sm border border-zen-border flex items-center">
                                                <img src={booking.space.images[0]} alt={booking.space.title} className="w-24 h-24 object-cover rounded-md mr-4"/>
                                                <div>
                                                    <h3 className="font-bold text-lg text-zen-charcoal">{booking.space.title}</h3>
                                                    <p className="text-sm text-gray-600">{new Date(booking.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                    <p className="text-sm text-gray-600">{booking.startTime} - {booking.endTime}</p>
                                                    <p className="text-sm font-semibold mt-1">Total: €{booking.totalPrice.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">Aún no has hecho ninguna reserva.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'favorites' && (
                            <div>
                                {favoriteSpaces.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {favoriteSpaces.map(space => (
                                            <SpaceCardEnhanced
                                                key={space.id}
                                                space={space}
                                                onSelect={(id) => onNavigate('detail', id)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-zen-border">
                                        <h3 className="text-xl font-medium text-zen-charcoal">No tienes espacios favoritos</h3>
                                        <p className="text-zen-charcoal-light mt-2">Explora y marca como favorito los espacios que te gusten.</p>
                                        <div className="mt-4">
                                            <button onClick={() => onNavigate('browse')} className="bg-zen-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-zen-primary-dark transition-colors">
                                                Explorar espacios
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'listings' && user.isHost && (
                             <div>
                                <div className="flex justify-end mb-4">
                                    <button onClick={() => onNavigate('new-listing')} className="bg-zen-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-zen-primary-dark transition-colors">
                                        + Crear Nuevo Espacio
                                    </button>
                                </div>
                                {userListings.length > 0 ? (
                                    <div className="space-y-4">
                                        {userListings.map(space => (
                                            <div key={space.id} className="bg-white p-4 rounded-lg shadow-sm border border-zen-border flex items-center">
                                                <img src={space.images[0]} alt={space.title} className="w-24 h-24 object-cover rounded-md mr-4"/>
                                                <div>
                                                    <h3 className="font-bold text-lg text-zen-charcoal">{space.title}</h3>
                                                    <p className="text-sm text-gray-600">{space.location.city}</p>
                                                    <p className="text-sm text-gray-600">€{space.pricePerHour}/hora</p>
                                                    <p className="text-sm font-semibold mt-1">{space.reviewCount} reseñas ({space.rating.toFixed(1)} ★)</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">Aún no has publicado ningún espacio.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};