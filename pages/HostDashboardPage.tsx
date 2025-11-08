
import React, { useContext, useMemo } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Space, Booking } from '../types';
import { View } from '../App';

interface HostDashboardPageProps {
    allSpaces: Space[];
    allBookings: Booking[];
    onNavigate: (view: View, contextId?: number) => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-zen-border flex items-center">
        <div className="bg-zen-secondary p-3 rounded-full mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-zen-charcoal">{value}</p>
        </div>
    </div>
);

export const HostDashboardPage: React.FC<HostDashboardPageProps> = ({ allSpaces, allBookings, onNavigate }) => {
    const { user } = useContext(UserContext);

    const hostListings = useMemo(() => {
        if (!user) return [];
        return allSpaces.filter(s => s.hostId === user.id);
    }, [user, allSpaces]);

    const upcomingBookings = useMemo(() => {
        const hostListingIds = hostListings.map(l => l.id);
        const now = new Date();
        now.setHours(0,0,0,0);
        return allBookings
            .filter(b => hostListingIds.includes(b.space.id) && new Date(b.date) >= now)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [hostListings, allBookings]);

    const totalRevenue = useMemo(() => {
        const hostListingIds = hostListings.map(l => l.id);
        return allBookings
            .filter(b => hostListingIds.includes(b.space.id))
            .reduce((sum, b) => sum + b.totalPrice, 0);
    }, [hostListings, allBookings]);

    if (!user || !user.isHost) {
        return <div className="container mx-auto p-8">Acceso denegado. Debes ser anfitrión para ver esta página.</div>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <h1 className="text-3xl font-bold text-zen-charcoal">Panel de Anfitrión</h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Ingresos Totales" value={`€${totalRevenue.toFixed(2)}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zen-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                <StatCard title="Reservas Próximas" value={upcomingBookings.length.toString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zen-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
                <StatCard title="Espacios Activos" value={hostListings.length.toString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zen-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
            </div>
            
            {/* Upcoming Bookings */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-zen-border">
                <h2 className="text-xl font-bold text-zen-charcoal mb-4">Próximas Reservas</h2>
                {upcomingBookings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Espacio</th>
                                    <th scope="col" className="px-6 py-3">Fecha</th>
                                    <th scope="col" className="px-6 py-3">Hora</th>
                                    <th scope="col" className="px-6 py-3">Ingreso</th>
                                </tr>
                            </thead>
                            <tbody>
                                {upcomingBookings.map(booking => (
                                    <tr key={booking.id} className="bg-white border-b">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{booking.space.title}</th>
                                        <td className="px-6 py-4">{new Date(booking.date + 'T00:00:00').toLocaleDateString('es-ES')}</td>
                                        <td className="px-6 py-4">{booking.startTime} - {booking.endTime}</td>
                                        <td className="px-6 py-4">€{booking.totalPrice.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500">No tienes ninguna reserva próxima.</p>
                )}
            </div>

            {/* My Listings */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-zen-border">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-zen-charcoal">Mis Espacios</h2>
                    <button onClick={() => onNavigate('new-listing')} data-testid="btn-add-listing" className="bg-zen-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-zen-primary-dark transition-colors text-sm">
                        + Añadir Espacio
                    </button>
                </div>
                 {hostListings.length > 0 ? (
                    <div className="space-y-4">
                        {hostListings.map(space => (
                            <div key={space.id} className="border border-zen-border p-4 rounded-lg flex items-center justify-between">
                                <div className="flex items-center">
                                    <img src={space.images[0]} alt={space.title} className="w-16 h-16 object-cover rounded-md mr-4" />
                                    <div>
                                        <h3 className="font-bold text-lg">{space.title}</h3>
                                        <p className="text-sm text-gray-500">{space.location.city} - €{space.pricePerHour}/hora</p>
                                    </div>
                                </div>
                                <div>
                                    <button onClick={() => onNavigate('manage-availability', space.id)} data-testid="btn-manage-availability" className="bg-zen-secondary text-zen-primary-dark font-bold py-2 px-4 rounded-md hover:bg-zen-primary hover:text-white transition-colors">
                                        Gestionar Calendario
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                 ) : (
                    <p className="text-gray-500">Aún no has publicado ningún espacio.</p>
                 )}
            </div>
        </div>
    );
};