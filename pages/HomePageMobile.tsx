import React, { useState, useContext } from 'react';
import { FiltersState } from '../types';
import { View } from '../App';
import { UserContext } from '../contexts/UserContext';
import { LocationPinIcon } from '../components/icons/LocationPinIcon';
import { SearchIcon } from '../components/icons/SearchIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { ClockIcon } from '../components/icons/ClockIcon';

interface HomePageMobileProps {
  onSearch: (filters: Partial<FiltersState>) => void;
  onNavigate: (view: View) => void;
}

export const HomePageMobile: React.FC<HomePageMobileProps> = ({ onSearch, onNavigate }) => {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const { user } = useContext(UserContext);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch({ location, date });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Mobile */}
      <section className="px-4 py-10 text-center">
        <h1 className="text-3xl font-extrabold text-zen-charcoal">ZenSpots</h1>
        <p className="mt-2 text-base text-zen-charcoal-light">Encuentra tu espacio ideal, rápido y fácil.</p>

        {/* Mobile Search */}
        <form onSubmit={handleSearchSubmit} className="mt-6 space-y-3">
          <div className="relative">
            <LocationPinIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ubicación"
              className="w-full bg-gray-100 border-transparent rounded-lg focus:ring-0 focus:border-zen-primary pl-10 py-3"
            />
          </div>
          <div className="relative">
            <CalendarIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-100 border-transparent rounded-lg focus:ring-0 focus:border-zen-primary pl-10 py-3 text-gray-500"
            />
          </div>
          <div className="relative">
            <ClockIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
            <select className="w-full bg-gray-100 border-transparent rounded-lg focus:ring-0 focus:border-zen-primary pl-10 py-3 text-gray-500">
              <option>Hora</option>
              <option>09:00</option>
              <option>12:00</option>
              <option>15:00</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-zen-primary text-white font-bold py-3 rounded-lg hover:bg-zen-primary-dark transition flex items-center justify-center gap-2">
            <SearchIcon className="w-5 h-5" />
            Buscar espacios
          </button>
        </form>

        {/* Quick actions */}
        <div className="mt-4">
          <button onClick={() => onNavigate('new-listing')} className="w-full bg-white text-zen-charcoal font-semibold py-3 rounded-lg hover:bg-gray-100 transition border border-zen-border">
            Listar mi espacio
          </button>
        </div>
      </section>

      {/* Compact Highlights */}
      <section className="px-4 py-8 bg-zen-secondary">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-semibold">Encuentra tu espacio</h3>
            <p className="text-sm text-zen-charcoal-light">Salas y estudios cerca de ti.</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-semibold">Reserva fácil</h3>
            <p className="text-sm text-zen-charcoal-light">Confirma en minutos.</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-semibold">Ambiente zen</h3>
            <p className="text-sm text-zen-charcoal-light">Perfecto para tu práctica.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageMobile;