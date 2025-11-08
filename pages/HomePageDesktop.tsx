import React, { useState, useContext } from 'react';
import { FiltersState } from '../types';
import { View } from '../App';
import { UserContext } from '../contexts/UserContext';
import { mockTestimonials, mockPopularLocations } from '../data/mockData';
import { LocationPinIcon } from '../components/icons/LocationPinIcon';
import { SearchIcon } from '../components/icons/SearchIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { LeafIcon } from '../components/icons/LeafIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import { UserIcon as ListIcon } from '../components/icons/UserIcon';
import { StarIcon } from '../components/icons';

interface HomePageDesktopProps {
  onSearch: (filters: Partial<FiltersState>) => void;
  onNavigate: (view: View) => void;
}

export const HomePageDesktop: React.FC<HomePageDesktopProps> = ({ onSearch, onNavigate }) => {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const { user } = useContext(UserContext);
  const FALLBACK_IMAGE = 'https://placehold.co/800x600?text=ZenSpots';

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
          
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-zen-border p-3 md:p-3"
            role="search"
            aria-label="Buscar espacios"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
              {/* Location */}
              <div className="relative md:col-span-5">
                <LocationPinIcon
                  className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ubicación (Ej. Barcelona)"
                  className="w-full h-12 bg-gray-100 rounded-xl pl-10 pr-4 text-zen-charcoal placeholder:text-gray-400 border border-transparent focus:bg-white focus:border-zen-primary focus:ring-2 focus:ring-zen-primary/40 transition"
                  aria-label="Ubicación"
                />
              </div>
              {/* Date */}
              <div className="relative md:col-span-4">
                <CalendarIcon
                  className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-12 bg-gray-100 rounded-xl pl-10 pr-4 text-zen-charcoal border border-transparent focus:bg-white focus:border-zen-primary focus:ring-2 focus:ring-zen-primary/40 transition"
                  aria-label="Fecha"
                />
              </div>
              {/* Time */}
              <div className="relative md:col-span-3">
                <ClockIcon
                  className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <select
                  className="w-full h-12 bg-gray-100 rounded-xl pl-10 pr-10 text-zen-charcoal border border-transparent focus:bg-white focus:border-zen-primary focus:ring-2 focus:ring-zen-primary/40 transition appearance-none"
                  aria-label="Hora"
                >
                  <option>Hora</option>
                  <option>09:00</option>
                  <option>12:00</option>
                  <option>15:00</option>
                </select>
                {/* Chevron */}
                <svg
                  className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </form>
          <div className="mt-4 flex justify-center items-center space-x-4">
            <button
              type="submit"
              onClick={handleSearchSubmit}
              className="bg-zen-primary text-white font-bold h-12 px-6 rounded-full hover:bg-zen-primary-dark transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-zen-primary/50"
              aria-label="Buscar un Espacio"
            >
              <SearchIcon className="w-5 h-5" />
              <span>Buscar un Espacio</span>
            </button>
            <button
              onClick={handleListSpace}
              className="bg-white text-zen-charcoal font-bold h-12 px-6 rounded-full hover:bg-gray-100 transition-colors border border-zen-border flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-zen-primary/30"
              aria-label="Listar tu Espacio"
            >
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
            <div className="bg-white p-8 rounded-xl shadow-sm border border-zen-border flex flex-col items-center">
              <div className="bg-zen-secondary p-4 rounded-full mb-4">
                <SearchIcon className="h-8 w-8 text-zen-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Encuentra tu Espacio</h3>
              <p className="text-zen-charcoal-light">Busca entre cientos de salas y estudios en tu área.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-zen-border flex flex-col items-center">
              <div className="bg-zen-secondary p-4 rounded-full mb-4">
                <CalendarIcon className="h-8 w-8 text-zen-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reserva Fácilmente</h3>
              <p className="text-zen-charcoal-light">Selecciona tu horario ideal y confirma tu reserva en minutos.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-zen-border flex flex-col items-center">
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
          {/** Ordenar por espacios disponibles (desc) para resaltar las más populares */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...mockPopularLocations].sort((a,b) => b.availableSpaces - a.availableSpaces).map(location => (
              <div
                key={location.id}
                className="bg-white rounded-xl shadow-sm border border-zen-border overflow-hidden group cursor-pointer"
                onClick={() => onSearch({ location: location.city })}
              >
                <img
                  src={location.imageUrl}
                  alt={location.city}
                  className="w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-zen-charcoal">{location.city}</h3>
                  <p className="text-sm text-zen-charcoal-light">Más de {location.availableSpaces} espacios disponibles</p>
                </div>
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
              <div key={testimonial.id} className="bg-white p-8 rounded-xl shadow-sm border border-zen-border text-center flex flex-col">
                <p className="text-zen-charcoal-light italic mb-6 flex-grow">"{testimonial.quote}"</p>
                <div className="flex flex-col items-center">
                  <img
                    src={testimonial.author.avatarUrl}
                    alt={testimonial.author.name}
                    className="w-12 h-12 rounded-full mb-3"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  />
                  <p className="font-bold text-zen-charcoal">{testimonial.author.name}</p>
                  <p className="text-sm text-zen-charcoal-light">{testimonial.author.role}</p>
                  <div className="flex items-center justify-center mt-3">
                    {[1,2,3,4,5].map((i) => (
                      <StarIcon key={i} className="w-4 h-4 text-amber-400 mr-1" />
                    ))}
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

export default HomePageDesktop;