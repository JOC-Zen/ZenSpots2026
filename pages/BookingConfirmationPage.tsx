import React, { useContext } from 'react';
import { BookingSummary } from '../types';
import { UserContext } from '../contexts/UserContext';
import { formatCurrency, formatDate, formatTime } from '../utils';
import { LocationPinIcon } from '../components/icons/LocationPinIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import { UsersIcon } from '../components/icons/UsersIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';

// FIX: Define the props interface for the component.
interface BookingConfirmationPageProps {
    bookingSummary: BookingSummary | null;
    onNavigateHome: () => void;
}

export const BookingConfirmationPage: React.FC<BookingConfirmationPageProps> = ({ bookingSummary, onNavigateHome }) => {
    const { user } = useContext(UserContext);
    
    if (!bookingSummary) {
        return (
            <div className="text-center p-12 container mx-auto">
                <h1 className="text-2xl font-bold">Error en la reserva</h1>
                <p className="mt-4">No se pudo encontrar la información de la reserva.</p>
                <button onClick={onNavigateHome} className="mt-6 bg-zen-primary text-white font-bold py-2 px-6 rounded-lg">
                    Volver al Inicio
                </button>
            </div>
        );
    }

    const { firstBooking, recurrenceType, recurrenceCount, totalPrice } = bookingSummary;
    const { space, date, startTime, endTime } = firstBooking;

    const getRecurrenceText = () => {
        if (recurrenceType === 'none' || recurrenceCount <= 1) return null;
        const typeText = recurrenceType === 'weekly' ? 'semanas' : 'meses';
        return `Reserva recurrente: ${recurrenceCount} ${typeText}.`;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="mb-8">
                    <div className="w-20 h-20 bg-zen-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-zen-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-zen-charcoal mb-2">¡Reserva Confirmada!</h1>
                    <p className="text-lg text-gray-600 mb-2">
                        {user ? `${user.name}, hemos enviado los detalles a tu email.` : 'Hemos enviado los detalles a tu email.'}
                    </p>
                    <p className="text-sm text-gray-500">
                        Número de reserva: #{bookingSummary.firstBooking.id}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-zen-border overflow-hidden">
                    <div className="bg-zen-primary text-white p-4">
                        <h2 className="text-xl font-bold">Detalles de la Reserva</h2>
                    </div>
                    <div className="p-6">
                        {getRecurrenceText() && (
                            <div className="mb-4 p-3 bg-zen-secondary text-zen-primary-dark rounded-lg text-center text-sm font-medium">
                                {getRecurrenceText()}
                            </div>
                        )}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-gray-500">
                                    <LocationPinIcon className="w-5 h-5 mr-2" />
                                    <span>Espacio:</span>
                                </div>
                                <span className="font-semibold text-zen-charcoal">{space.title}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-gray-500">
                                    <LocationPinIcon className="w-5 h-5 mr-2" />
                                    <span>Ubicación:</span>
                                </div>
                                <span className="font-semibold text-zen-charcoal">{space.location.city}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-gray-500">
                                    <CalendarIcon className="w-5 h-5 mr-2" />
                                    <span>{recurrenceType !== 'none' && recurrenceCount > 1 ? 'Primera sesión:' : 'Fecha:'}</span>
                                </div>
                                <span className="font-semibold text-zen-charcoal">
                                    {formatDate(new Date(date + 'T00:00:00'))}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-gray-500">
                                    <ClockIcon className="w-5 h-5 mr-2" />
                                    <span>Hora:</span>
                                </div>
                                <span className="font-semibold text-zen-charcoal">
                                    {formatTime(startTime)} - {formatTime(endTime)}
                                </span>
                            </div>
                            <div className="border-t border-zen-border my-4"></div>
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-600">Total Pagado:</span>
                                <span className="font-extrabold text-zen-primary text-xl">{formatCurrency(totalPrice)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-zen-border overflow-hidden">
                    <div className="bg-zen-secondary text-zen-charcoal p-4">
                        <h2 className="text-xl font-bold">Información del Espacio</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-gray-500">
                                    <LocationPinIcon className="w-5 h-5 mr-2" />
                                    <span>Nombre:</span>
                                </div>
                                <span className="font-semibold text-zen-charcoal">{space.title}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-gray-500">
                                    <LocationPinIcon className="w-5 h-5 mr-2" />
                                    <span>Dirección:</span>
                                </div>
                                <span className="font-semibold text-zen-charcoal">{`${space.location.address}, ${space.location.city}`}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-gray-500">
                                    <CalendarIcon className="w-5 h-5 mr-2" />
                                    <span>Fecha de tu visita:</span>
                                </div>
                                <span className="font-semibold text-zen-charcoal">
                                    {formatDate(new Date(date + 'T00:00:00'))}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    <button 
                        onClick={onNavigateHome} 
                        className="w-full bg-zen-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-zen-primary-dark transition-colors"
                    >
                        Explorar más espacios
                    </button>
                    <button 
                        onClick={() => window.print()} 
                        className="w-full bg-white text-zen-primary font-semibold py-3 px-6 rounded-lg border-2 border-zen-primary hover:bg-zen-primary hover:text-white transition-colors"
                    >
                        Imprimir confirmación
                    </button>
                </div>

                <div className="mt-8 p-6 bg-zen-secondary rounded-xl">
                    <h3 className="text-lg font-semibold text-zen-charcoal mb-3">¿Qué hacer ahora?</h3>
                    <div className="space-y-2 text-sm text-zen-charcoal-light">
                        <p>• Recibirás un email con todos los detalles y la confirmación</p>
                        <p>• El anfitrión te contactará para coordinar los detalles de acceso</p>
                        <p>• Llega 10 minutos antes de tu hora reservada</p>
                        <p>• No olvides llevar tu identificación</p>
                    </div>
                </div>
            </div>
        </div>
    );
};