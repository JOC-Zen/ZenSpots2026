
import React, { useState, useMemo } from 'react';
import { Space } from '../types';

interface ManageAvailabilityPageProps {
    space: Space;
    onSave: (spaceId: number, newAvailability: { [date: string]: string[] }) => void;
    onBack: () => void;
}

const generateTimeSlots = (startHour: number, endHour: number): string[] => {
    const slots = [];
    for (let i = startHour; i < endHour; i++) {
        slots.push(`${String(i).padStart(2, '0')}:00`);
    }
    return slots;
};

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const TimeSlotManager: React.FC<{
    selectedDate: string;
    availability: { [date: string]: string[] };
    setAvailability: React.Dispatch<React.SetStateAction<{ [date: string]: string[] }>>;
}> = ({ selectedDate, availability, setAvailability }) => {
    const allDaySlots = useMemo(() => generateTimeSlots(8, 21), []);
    const availableSlotsForDate = availability[selectedDate] || [];

    const handleSlotChange = (slot: string, isEnabled: boolean) => {
        setAvailability(prev => {
            const currentSlots = prev[selectedDate] || [];
            const newSlots = isEnabled
                ? [...currentSlots, slot]
                : currentSlots.filter(s => s !== slot);
            newSlots.sort();
            return { ...prev, [selectedDate]: newSlots };
        });
    };

    const handleSelectAll = (select: boolean) => {
         setAvailability(prev => ({
            ...prev,
            [selectedDate]: select ? allDaySlots : []
        }));
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zen-border mt-4 md:mt-0">
            <h3 className="font-bold text-lg">Disponibilidad para {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
            <p className="text-sm text-gray-500 mb-4">Selecciona las horas en las que tu espacio está disponible para alquilar.</p>
            <div className="flex space-x-2 mb-4">
                <button onClick={() => handleSelectAll(true)} data-testid="btn-enable-all" className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md">Habilitar todo</button>
                <button onClick={() => handleSelectAll(false)} data-testid="btn-block-all" className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md">Bloquear todo</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-2">
                {allDaySlots.map(slot => {
                    const isChecked = availableSlotsForDate.includes(slot);
                    return (
                        <div key={slot}>
                            <input 
                                type="checkbox"
                                id={`slot-${slot}`}
                                checked={isChecked}
                                onChange={e => handleSlotChange(slot, e.target.checked)}
                                className="hidden peer"
                            />
                            <label
                                htmlFor={`slot-${slot}`}
                                className={`block w-full text-center p-2 border rounded-lg cursor-pointer text-sm font-medium transition-colors ${isChecked ? 'bg-zen-primary text-white border-zen-primary-dark' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                            >
                                {slot}
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const ManageAvailabilityPage: React.FC<ManageAvailabilityPageProps> = ({ space, onSave, onBack }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
    const [availability, setAvailability] = useState(space.availability || {});

    const daysInMonth = useMemo(() => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const days = [];
        while (date.getMonth() === currentMonth.getMonth()) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }, [currentMonth]);
    
    const firstDayOfMonth = useMemo(() => {
        const day = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
        return day === 0 ? 6 : day - 1; // Monday is 0, Sunday is 6
    }, [currentMonth]);
    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    const handleMonthChange = (offset: number) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };
    
    const getDayStatus = (date: Date) => {
        const dateString = formatDate(date);
        const slots = availability[dateString];
        if (!slots || slots.length === 0) return 'blocked';
        if (slots.length >= 10) return 'available'; // Assuming ~full day is available
        return 'partial';
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-5xl mx-auto">
                <button onClick={onBack} data-testid="btn-back-host" className="mb-6 text-sm font-medium text-zen-primary-dark hover:underline flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Volver al Panel de Anfitrión
                </button>
                <h1 className="text-3xl font-bold text-zen-charcoal mb-2">Gestionar Disponibilidad</h1>
                <h2 className="text-xl text-gray-600 mb-6">{space.title}</h2>
                
                <div className="md:grid md:grid-cols-3 md:gap-8">
                    <div className="md:col-span-1">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-zen-border">
                            <div className="flex items-center justify-between mb-4">
                                <button onClick={() => handleMonthChange(-1)} data-testid="btn-month-prev" className="p-1 rounded-full hover:bg-gray-100">&larr;</button>
                                <h2 className="font-bold text-lg">{currentMonth.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</h2>
                                <button onClick={() => handleMonthChange(1)} data-testid="btn-month-next" className="p-1 rounded-full hover:bg-gray-100">&rarr;</button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                {weekDays.map(day => <div key={day} className="font-semibold text-gray-500">{day}</div>)}
                                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                                {daysInMonth.map(day => {
                                    const dateString = formatDate(day);
                                    const status = getDayStatus(day);
                                    const isSelected = dateString === selectedDate;
                                    
                                    let statusClass = 'bg-gray-50 text-gray-400 line-through';
                                    if (status === 'available') statusClass = 'bg-green-100 text-green-800 hover:bg-green-200';
                                    else if (status === 'partial') statusClass = 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
                                    
                                    return (
                                        <button 
                                            key={dateString}
                                            onClick={() => setSelectedDate(dateString)}
                                            className={`p-2 rounded-full aspect-square transition-colors font-medium ${isSelected ? 'ring-2 ring-zen-primary' : ''} ${statusClass}`}
                                            data-testid={`date-${dateString}`}
                                        >
                                            {day.getDate()}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <TimeSlotManager selectedDate={selectedDate} availability={availability} setAvailability={setAvailability} />
                    </div>
                </div>

                 <div className="mt-8 text-right">
                    <button onClick={() => onSave(space.id, availability)} data-testid="btn-save-availability" className="bg-zen-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-zen-primary-dark transition-colors">
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
};