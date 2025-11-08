
export type SpaceType = 'Consultorio' | 'Estudio de Yoga' | 'Oficina Privada' | 'Terapia' | 'Sala de Reuniones' | 'Espacio de Masajes' | 'Medicina Natural';

export type Amenity = 'Wifi' | 'AC' | 'Proyector' | 'Pizarra' | 'Material de Yoga' | 'Camilla de Masaje' | 'Música Ambiental' | 'Privacidad' | 'Utensilios básicos' | 'Botiquín' | 'Calefacción' | 'Insonorización Superior' | 'Diseño Minimalista y Tranquilo' | 'Abundante Luz Natural' | 'Conectividad Wi-Fi de Alta Velocidad' | 'Estacion de Té Herbal' | 'Cojines de Meditación';

export interface Space {
  id: number;
  title: string;
  type: SpaceType;
  description: string;
  location: {
    address: string;
    city: string;
    lat: number;
    lng: number;
  };
  capacity: number;
  pricePerHour: number;
  amenities: Amenity[];
  images: string[];
  hostId: number;
  rating: number;
  reviewCount: number;
  availability?: {
    [date: string]: string[]; // e.g., { '2024-12-25': ['09:00', '10:00', '14:00'] }
  };
}

export interface FiltersState {
    location: string;
    priceRange: [number, number];
    spaceTypes: SpaceType[];
    capacity: number;
    date?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
    isHost: boolean;
    bio: string;
}

export interface Review {
    id: number;
    spaceId: number;
    userId: number;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface Booking {
    id: number;
    userId: number;
    space: Space;
    date: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
}

export interface BookingSummary {
    firstBooking: Booking;
    recurrenceType: 'none' | 'weekly' | 'monthly';
    recurrenceCount: number;
    totalPrice: number;
}

export interface Testimonial {
    id: number;
    quote: string;
    author: {
        name: string;
        role: string;
        avatarUrl: string;
    };
}

export interface PopularLocation {
    id: number;
    city: string;
    availableSpaces: number;
    imageUrl: string;
}