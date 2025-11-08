
import React, { useState, useMemo, useContext, useEffect } from 'react';
import { Space, Booking } from '../types';
import { UserContext } from '../contexts/UserContext';
import { ClockIcon } from './icons/ClockIcon';
import { CalendarIcon } from './icons/CalendarIcon';

interface BookingWidgetProps {
    space: Space;
    bookings: Booking[];
    onBook: (bookingDetails: Omit<Booking, 'id' | 'space'>, recurrence: { type: 'none' | 'weekly' | 'monthly', count: number }) => void;
}

const generateFullDaySlots = (startHour: number, endHour: number): string[] => {
    const slots = [];
    for (let i = startHour; i <= endHour; i++) {
        slots.push(`${String(i).padStart(2, '0')}:00`);
    }
    return slots;
};

export const BookingWidget: React.FC<BookingWidgetProps> = ({ space, bookings, onBook }) => {
    const { user } = useContext(UserContext);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [error, setError] = useState<string>('');

    const availableTimeSlots = useMemo(() => {
        let hostSlots = space.availability?.[selectedDate] || generateFullDaySlots(8, 20);
        const bookedSlots = bookings
            .filter(b => b.date === selectedDate)
            .flatMap(b => {
                const start = parseInt(b.startTime.split(':')[0]);
                const end = parseInt(b.endTime.split(':')[0]);
                const slots = [];
                for (let i = start; i < end; i++) {
                    slots.push(`${String(i).padStart(2, '0')}:00`);
                }
                return slots;
            });
        return hostSlots.filter(slot => !bookedSlots.includes(slot));
    }, [selectedDate, space.availability, bookings]);

    const availableEndTimes = useMemo(() => {
        if (!startTime || !availableTimeSlots.includes(startTime)) return [];
        const startIndex = availableTimeSlots.indexOf(startTime);
        const subsequentSlots = availableTimeSlots.slice(startIndex + 1);
        const endTimes = [];
        let lastHour = parseInt(startTime.split(':')[0]);

        for (const slot of subsequentSlots) {
            const currentHour = parseInt(slot.split(':')[0]);
            if (currentHour === lastHour + 1) {
                endTimes.push(slot);
                lastHour = currentHour;
            } else {
                break;
            }
        }
        endTimes.push(`${String(lastHour + 1).padStart(2, '0')}:00`);
        return endTimes;
    }, [startTime, availableTimeSlots]);

    useEffect(() => {
        if (!availableTimeSlots.includes(startTime)) {
            setStartTime(availableTimeSlots[0] || '');
        }
    }, [selectedDate, availableTimeSlots, startTime]);

    useEffect(() => {
        if (startTime) {
            const currentEndTimeIsValid = availableEndTimes.includes(endTime);
            if (!currentEndTimeIsValid) {
                setEndTime(availableEndTimes[0] || '');
            }
        } else {
            setEndTime('');
        }
    }, [startTime, availableEndTimes, endTime]);

    const duration = useMemo(() => {
        if (!startTime || !endTime) return 0;
        const start = parseInt(startTime.split(':')[0]);
        const end = parseInt(endTime.split(':')[0]);
        const diff = end - start;
        return diff > 0 ? diff : 0;
    }, [startTime, endTime]);
    
    const totalPrice = duration * space.pricePerHour;

    const handleBooking = () => {
        if (!user) {
            alert('Por favor, inicia sesión para reservar.');
            return;
        }
        if (duration <= 0) {
            setError('La hora de fin debe ser posterior a la hora de inicio.');
            return;
        }
        setError('');
        onBook({
            userId: user.id,
            date: selectedDate,
            startTime,
            endTime,
            totalPrice,
        }, { type: 'none', count: 1 }); // Simplified for new design
    };

    return (
        <div className="sticky top-24 bg-white p-6 rounded-xl shadow-lg border border-zen-border">
            <h2 className="text-xl font-bold text-zen-charcoal mb-4">Reserva Este Espacio</h2>
            <p className="text-2xl font-bold text-zen-charcoal mb-4">
                {space.pricePerHour.toFixed(2)}€
                <span className="text-base font-normal text-gray-500"> / hora</span>
            </p>
            
            <div className="space-y-4">
                <div className="relative">
                    <label htmlFor="date" className="sr-only">Fecha</label>
                    <CalendarIcon className="pointer-events-none w-5 h-5 text-gray-400 absolute top-1/2 transform -translate-y-1/2 left-3" />
                     <input 
                        type="date"
                        id="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border-gray-200 rounded-lg shadow-sm focus:border-zen-primary focus:ring-zen-primary bg-gray-100 pl-10"
                    />
                </div>
                
                <div className="relative">
                     <label htmlFor="start-time" className="sr-only">Hora</label>
                     <ClockIcon className="pointer-events-none w-5 h-5 text-gray-400 absolute top-1/2 transform -translate-y-1/2 left-3" />
                     <select id="start-time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full text-sm border-gray-200 rounded-lg shadow-sm focus:border-zen-primary focus:ring-zen-primary bg-gray-100 pl-10" disabled={availableTimeSlots.length === 0}>
                        <option value="" disabled>Selecciona Hora</option>
                        {availableTimeSlots.map(time => <option key={time} value={time}>{time}</option>)}
                    </select>
                </div>
                
                 {/* Simplified End Time for this UI */}
                 {startTime &&
                    <div className="relative">
                         <label htmlFor="end-time" className="sr-only">Hora de fin</label>
                         <ClockIcon className="pointer-events-none w-5 h-5 text-gray-400 absolute top-1/2 transform -translate-y-1/2 left-3" />
                         <select id="end-time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full text-sm border-gray-200 rounded-lg shadow-sm focus:border-zen-primary focus:ring-zen-primary bg-gray-100 pl-10" disabled={availableEndTimes.length === 0}>
                            <option value="" disabled>Selecciona Hora Fin</option>
                            {availableEndTimes.map(time => <option key={time} value={time}>{time}</option>)}
                        </select>
                    </div>
                }

            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            {availableTimeSlots.length === 0 && <p className="text-amber-600 text-xs mt-2 text-center bg-amber-50 p-2 rounded-md">No hay horas disponibles.</p>}

            <button onClick={handleBooking} className="mt-6 w-full bg-zen-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-zen-primary-dark transition-colors disabled:bg-gray-400">
                {user ? `Reservar Ahora (${totalPrice.toFixed(2)}€)` : 'Inicia sesión para reservar'}
            </button>

            <p className="text-center text-xs text-gray-500 mt-3">No se te cobrará nada aún</p>
        </div>
    );
};