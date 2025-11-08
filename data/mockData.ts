
import { Space, User, Review, Booking, Testimonial, PopularLocation } from '../types';

export const mockUsers: User[] = [
    { id: 1, name: 'Ana García', email: 'ana@zenspots.com', avatarUrl: 'https://i.pravatar.cc/150?u=ana', isHost: true, bio: 'Apasionada por crear espacios que inspiren calma y bienestar. ¡Bienvenidos a mi rincón de paz!' },
    { id: 2, name: 'Dr. Carlos Ruiz', email: 'carlos@zenspots.com', avatarUrl: 'https://i.pravatar.cc/150?u=carlos', isHost: true, bio: 'Profesional con más de 10 años de experiencia en la gestión de espacios para terapeutas y profesionales.' },
    { id: 3, name: 'Sofia Martinez', email: 'laura@zenspots.com', avatarUrl: 'https://i.pravatar.cc/150?u=laura', isHost: false, bio: 'Terapeuta buscando siempre los mejores lugares para atender a mis pacientes.' },
    { id: 4, name: 'David Rodríguez', email: 'david@zenspots.com', avatarUrl: 'https://i.pravatar.cc/150?u=david', isHost: false, bio: 'Instructor de Yoga y meditación.' },
    { id: 5, name: 'Sofia Lopez', email: 'sofia@zenspots.com', avatarUrl: 'https://i.pravatar.cc/150?u=sofia', isHost: true, bio: 'Creo en el poder de un buen ambiente para la sanación.' },
];

export const mockReviews: Review[] = [
    { id: 1, spaceId: 1, userId: 3, rating: 5, comment: 'Un espacio impecable, tranquilo y muy profesional. Mis pacientes se sintieron muy cómodos. Ana es una anfitriona excelente.', createdAt: '2023-10-15' },
    { id: 2, spaceId: 1, userId: 4, rating: 4, comment: 'Muy buena ubicación y el consultorio tiene todo lo necesario. La reserva fue sencilla y rápida.', createdAt: '2023-10-12' },
    { id: 3, spaceId: 2, userId: 3, rating: 5, comment: 'La sala de yoga es espectacular. Mucha luz natural y el material es de primera calidad. Repetiré sin duda.', createdAt: '2023-09-20' },
    { id: 4, spaceId: 3, userId: 4, rating: 5, comment: 'Perfecto para sesiones individuales. La privacidad es total y el ambiente invita a la relajación.', createdAt: '2023-11-01' },
];

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfterTomorrow = new Date();
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export let mockSpaces: Space[] = [
    {
        id: 1,
        title: "Consultorio Moderno 'Serenidad'",
        type: 'Consultorio',
        description: "Un espacio elegante y profesional diseñado para terapeutas, psicólogos y coaches. Equipado con mobiliario cómodo y una atmósfera que promueve la confianza y la tranquilidad. Ideal para sesiones individuales o de pareja.",
        location: { address: 'Calle de la Paz, 15', city: 'Madrid', lat: 40.415, lng: -3.702 },
        capacity: 2,
        pricePerHour: 25,
        amenities: ['Wifi', 'AC', 'Calefacción', 'Privacidad'],
        images: ['/images/space-consultorio.svg'],
        hostId: 1,
        rating: 4.8,
        reviewCount: 12,
        availability: {
            [formatDate(tomorrow)]: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
            [formatDate(dayAfterTomorrow)]: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
        }
    },
    {
        id: 2,
        title: "Estudio de Yoga 'Armonía'",
        type: 'Estudio de Yoga',
        description: "Amplio y luminoso estudio de yoga con suelo de madera y grandes ventanales. Perfecto para clases grupales, talleres o prácticas personales. Incluye esterillas, bloques y todo el material necesario.",
        location: { address: 'Avenida del Sol, 8', city: 'Barcelona', lat: 41.387, lng: 2.168 },
        capacity: 10,
        pricePerHour: 40,
        amenities: ['Wifi', 'Material de Yoga', 'Proyector', 'Música Ambiental'],
        images: ['/images/space-yoga.svg'],
        hostId: 2,
        rating: 4.9,
        reviewCount: 25,
    },
    {
        id: 3,
        title: "Oficina Terapéutica 'Calma'",
        type: 'Oficina Privada',
        description: "Un despacho íntimo y acogedor, ideal para consultas que requieren máxima discreción. Su decoración minimalista y su excelente aislamiento acústico garantizan un entorno seguro y profesional.",
        location: { address: 'Plaza Mayor, 3', city: 'Valencia', lat: 39.475, lng: -0.376 },
        capacity: 1,
        pricePerHour: 20,
        amenities: ['Wifi', 'Privacidad', 'AC'],
        images: ['/images/space-oficina.svg'],
        hostId: 1,
        rating: 5.0,
        reviewCount: 8,
         availability: {
            [formatDate(tomorrow)]: ['12:00', '13:00', '14:00'],
            [formatDate(dayAfterTomorrow)]: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
        }
    },
    {
        id: 4,
        title: "Sala de Reuniones 'Conocimiento'",
        type: 'Sala de Reuniones',
        description: "Espacio versátil para talleres, formaciones o reuniones de equipo. Equipado con proyector de alta definición, pizarra blanca y una cómoda zona de café. Fomenta la creatividad y la colaboración.",
        location: { address: 'Paseo de Gracia, 20', city: 'Sevilla', lat: 37.389, lng: -5.984 },
        capacity: 6,
        pricePerHour: 35,
        amenities: ['Wifi', 'Proyector', 'Pizarra', 'AC'],
        images: ['/images/space-reunion.svg'],
        hostId: 2,
        rating: 4.7,
        reviewCount: 5,
    },
    {
        id: 5,
        title: "Espacio de Masajes 'Zen'",
        type: 'Espacio de Masajes',
        description: "Cabina de masajes totalmente equipada con camilla profesional, aceites esenciales y un sistema de música ambiental. La iluminación cálida y regulable permite crear la atmósfera perfecta para cada tratamiento.",
        location: { address: 'Rúa Nova, 7', city: 'Santiago de Compostela', lat: 42.880, lng: -8.545 },
        capacity: 1,
        pricePerHour: 30,
        amenities: ['Wifi', 'Camilla de Masaje', 'Música Ambiental', 'Calefacción'],
        images: ['/images/space-masajes.svg'],
        hostId: 1,
        rating: 4.9,
        reviewCount: 18,
    },
    {
        id: 6,
        title: "Sala de Medicina Natural 'Vida'",
        type: 'Medicina Natural',
        description: "Un entorno natural y orgánico para consultas de naturopatía, acupuntura o herbolaria. Decorado con plantas y materiales naturales, este espacio transmite una sensación de salud y vitalidad.",
        location: { address: 'Gran Vía, 50', city: 'Bilbao', lat: 43.263, lng: -2.935 },
        capacity: 3,
        pricePerHour: 28,
        amenities: ['Wifi', 'Utensilios básicos', 'Botiquín'],
        images: ['/images/space-medicina.svg'],
        hostId: 2,
        rating: 4.8,
        reviewCount: 9,
    },
];

export let mockBookings: Booking[] = [
    {
        id: 1,
        userId: 3,
        space: mockSpaces[0],
        date: formatDate(tomorrow),
        startTime: "10:00",
        endTime: "11:00",
        totalPrice: 25,
    },
    {
        id: 2,
        userId: 3,
        space: mockSpaces[2],
        date: "2024-09-01",
        startTime: "16:00",
        endTime: "18:00",
        totalPrice: 40,
    }
];

export const mockTestimonials: Testimonial[] = [
    {
        id: 1,
        quote: "ZenSpots ha transformado mi manera de encontrar espacios. La interfaz es intuitiva y las salas son siempre impecables. ¡Altamente recomendado para cualquier profesional!",
        author: { name: "Ana García", role: "Instructora de Yoga", avatarUrl: "https://i.pravatar.cc/150?u=ana" },
    },
    {
        id: 2,
        quote: "Como terapeuta, la flexibilidad de ZenSpots para reservar por horas es invaluable. Me permite gestionar mi agenda de forma eficiente y ofrecer un servicio de calidad a mis clientes.",
        author: { name: "Dr. Carlos Ruiz", role: "Terapeuta Holístico", avatarUrl: "https://i.pravatar.cc/150?u=carlos" },
    },
    {
        id: 3,
        quote: "La plataforma es increíblemente fácil de usar. He encontrado estudios perfectos para mis clases de meditación sin ningún problema. El soporte al cliente también es excelente.",
        author: { name: "Sofia Martinez", role: "Guía de Meditación", avatarUrl: "https://i.pravatar.cc/150?u=laura" },
    },
];

export const mockPopularLocations: PopularLocation[] = [
    { id: 1, city: "Barcelona", availableSpaces: 30, imageUrl: "https://images.unsplash.com/photo-1523430434497-0245a19353a2?q=80&w=2670&auto=format&fit=crop" },
    { id: 2, city: "Madrid", availableSpaces: 25, imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2670&auto=format&fit=crop" },
    { id: 3, city: "Sevilla", availableSpaces: 18, imageUrl: "https://images.unsplash.com/photo-1563720231945-4233bf483015?q=80&w=2670&auto=format&fit=crop" },
    { id: 4, city: "Valencia", availableSpaces: 20, imageUrl: "https://images.unsplash.com/photo-1544991823-f3629b278a27?q=80&w=2574&auto=format&fit=crop" },
];
