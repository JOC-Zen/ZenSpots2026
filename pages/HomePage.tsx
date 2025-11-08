
import React, { useState, useContext } from 'react';
import { FiltersState, Testimonial, PopularLocation } from '../types';
import { View } from '../App';
import { UserContext } from '../contexts/UserContext';
import { mockTestimonials, mockPopularLocations } from '../data/mockData';
import { LocationPinIcon } from '../components/icons/LocationPinIcon';
import { SearchIcon } from '../components/icons/SearchIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { LeafIcon } from '../components/icons/LeafIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import { UserIcon as ListIcon } from '../components/icons/UserIcon';

interface HomePageProps {
    onSearch: (filters: Partial<FiltersState>) => void;
    onNavigate: (view: View) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSearch, onNavigate }) => {
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const { user } = useContext(UserContext);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({ location, date });
    };

    const handleListSpace = () => {
        onNavigate('new-listing');
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-zen-charcoal">ZenSpots: Tu Santuario a Demanda</h1>
                    <p className="mt-4 text-lg text-zen-charcoal-light max-w-2xl mx-auto">Encuentra el espacio perfecto para tu práctica o consulta.</p>
                    
                    <form onSubmit={handleSearchSubmit} className="mt-8 max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-4 border border-zen-border grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="relative md:col-span-2">
                             <LocationPinIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
                             <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Ubicación (Ej. Barcelona)"
                                className="w-full bg-gray-100 border-transparent rounded-md focus:ring-0 focus:border-zen-primary pl-10"
                            />
                        </div>
                         <div className="relative">
                             <CalendarIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
                             <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-gray-100 border-transparent rounded-md focus:ring-0 focus:border-zen-primary pl-10 text-gray-500"
                            />
                        </div>
                        <div className="relative">
                            <ClockIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
                            <select className="w-full bg-gray-100 border-transparent rounded-md focus:ring-0 focus:border-zen-primary pl-10 text-gray-500">
                                <option>Hora</option>
                                <option>09:00</option>
                                <option>12:00</option>
                                <option>15:00</option>
                            </select>
                        </div>
                    </form>
                     <div className="mt-4 flex justify-center items-center space-x-4">
                        <button type="submit" onClick={handleSearchSubmit} className="bg-zen-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-zen-primary-dark transition flex items-center space-x-2">
                            <SearchIcon className="w-5 h-5" />
                            <span>Buscar un Espacio</span>
                        </button>
                         <button onClick={handleListSpace} className="bg-white text-zen-charcoal font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition border border-zen-border flex items-center space-x-2">
                             <ListIcon className="w-5 h-5" />
                             <span>Listar tu Espacio</span>
                         </button>
                    </div>
                </div>
            </section>
            
            {/* How it Works Section */}
            <section className="py-16 bg-zen-secondary">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-zen-charcoal mb-12">Cómo Funciona ZenSpots</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center">
                            <div className="bg-zen-secondary p-4 rounded-full mb-4">
                               <SearchIcon className="h-8 w-8 text-zen-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Encuentra tu Espacio</h3>
                            <p className="text-zen-charcoal-light">Busca entre cientos de salas y estudios en tu área.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center">
                            <div className="bg-zen-secondary p-4 rounded-full mb-4">
                                <CalendarIcon className="h-8 w-8 text-zen-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Reserva Fácilmente</h3>
                            <p className="text-zen-charcoal-light">Selecciona tu horario ideal y confirma tu reserva en minutos.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center">
                             <div className="bg-zen-secondary p-4 rounded-full mb-4">
                                <LeafIcon className="h-8 w-8 text-zen-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Practica con Paz</h3>
                            <p className="text-zen-charcoal-light">Disfruta de un ambiente tranquilo para tu práctica o consulta.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Locations Section */}
            <section className="py-16 bg-white">
                 <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-zen-charcoal text-center mb-12">Nuestras Ubicaciones Populares</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {mockPopularLocations.map(location => (
                            <div key={location.id} className="group cursor-pointer" onClick={() => onSearch({ location: location.city })}>
                                <div className="rounded-xl overflow-hidden mb-4">
                                    <img src={location.imageUrl} alt={location.city} className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <h3 className="text-xl font-bold">{location.city}</h3>
                                <p className="text-zen-charcoal-light">Más de {location.availableSpaces} espacios disponibles</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Testimonials Section */}
            <section className="py-20 bg-zen-secondary">
                 <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-zen-charcoal mb-12">Lo Que Dicen Nuestros Usuarios</h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {mockTestimonials.map(testimonial => (
                            <div key={testimonial.id} className="bg-white p-8 rounded-xl shadow-md text-left flex flex-col">
                                <p className="text-zen-charcoal-light italic mb-6 flex-grow">"{testimonial.quote}"</p>
                                <div className="flex items-center">
                                    <img src={testimonial.author.avatarUrl} alt={testimonial.author.name} className="w-12 h-12 rounded-full mr-4" />
                                    <div>
                                        <p className="font-bold text-zen-charcoal">{testimonial.author.name}</p>
                                        <p className="text-sm text-zen-charcoal-light">{testimonial.author.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};