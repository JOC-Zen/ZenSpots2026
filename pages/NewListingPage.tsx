
import React, { useState, useContext, useRef, useCallback } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Space, SpaceType, Amenity } from '../types';
import { View } from '../App';
import { UploadIcon } from '../components/icons/UploadIcon';

interface NewListingPageProps {
    onNavigate: (view: View) => void;
    onCreateListing: (newSpaceData: Omit<Space, 'id' | 'rating' | 'reviewCount'>) => void;
}

const allSpaceTypes: SpaceType[] = ['Consultorio', 'Estudio de Yoga', 'Oficina Privada', 'Terapia', 'Sala de Reuniones', 'Espacio de Masajes', 'Medicina Natural'];
const allAmenities: Amenity[] = ['Wifi', 'AC', 'Proyector', 'Pizarra', 'Material de Yoga', 'Camilla de Masaje', 'Música Ambiental', 'Privacidad', 'Utensilios básicos', 'Botiquín', 'Calefacción'];

export const NewListingPage: React.FC<NewListingPageProps> = ({ onNavigate, onCreateListing }) => {
    const { user } = useContext(UserContext);
    const [formData, setFormData] = useState({
        title: '',
        type: 'Consultorio' as SpaceType,
        description: '',
        address: '',
        city: '',
        capacity: 1,
        pricePerHour: 20,
        amenities: [] as Amenity[],
        images: [] as string[],
    });
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: name === 'capacity' || name === 'pricePerHour' ? parseInt(value) : value }));
    };

    const handleAmenityChange = (amenity: Amenity) => {
        setFormData(prev => {
            const newAmenities = prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity];
            return { ...prev, amenities: newAmenities };
        });
    };
    
    const processFiles = (files: FileList) => {
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        if (imageFiles.length === 0) return;

        const newImages: string[] = [];
        let filesProcessed = 0;

        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newImages.push(reader.result as string);
                filesProcessed++;
                if (filesProcessed === imageFiles.length) {
                    setFormData(prev => ({...prev, images: [...prev.images, ...newImages]}));
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFiles(e.target.files);
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);
    
    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            processFiles(e.dataTransfer.files);
        }
    }, []);

    const handleRemoveImage = (indexToRemove: number) => {
        setFormData(prev => ({...prev, images: prev.images.filter((_, index) => index !== indexToRemove)}));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert("Debes iniciar sesión para crear un espacio.");
            return;
        }

        const finalImages = formData.images.length > 0 ? formData.images : ['https://picsum.photos/seed/default_space/800/600'];

        const newSpaceData = {
            title: formData.title,
            type: formData.type,
            description: formData.description,
            location: {
                address: formData.address,
                city: formData.city,
                lat: Math.random() * (43 - 36) + 36, // Random lat/lng in Spain
                lng: Math.random() * (-1 - (-9)) + (-9),
            },
            capacity: formData.capacity,
            pricePerHour: formData.pricePerHour,
            amenities: formData.amenities,
            images: finalImages,
            hostId: user.id,
        };
        
        onCreateListing(newSpaceData);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-zen-border">
                <h1 className="text-3xl font-bold text-zen-charcoal mb-6">Crea tu Espacio</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-zen-charcoal-light">Título del Espacio</label>
                        <input type="text" name="title" id="title" required value={formData.title} onChange={handleChange} className="bg-gray-100 mt-1 block w-full border-gray-200 rounded-lg shadow-sm focus:ring-zen-primary focus:border-zen-primary" />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-zen-charcoal-light">Tipo de Espacio</label>
                        <select name="type" id="type" required value={formData.type} onChange={handleChange} className="bg-gray-100 mt-1 block w-full border-gray-200 rounded-lg shadow-sm focus:ring-zen-primary focus:border-zen-primary">
                            {allSpaceTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="images" className="block text-sm font-medium text-zen-charcoal-light">Imágenes</label>
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-zen-primary bg-zen-secondary' : 'hover:border-gray-400'}`}
                        >
                            <div className="space-y-1 text-center">
                                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <p className="relative bg-white rounded-md font-medium text-zen-primary hover:text-zen-primary-dark focus-within:outline-none">
                                        <span>Sube un archivo</span>
                                        <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleFileSelect} />
                                    </p>
                                    <p className="pl-1">o arrastra y suelta</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                            </div>
                        </div>
                         {formData.images.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 gap-4">
                                {formData.images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img src={image} alt={`Preview ${index}`} className="h-24 w-full object-cover rounded-md" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label="Remove image"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-zen-charcoal-light">Descripción</label>
                        <textarea name="description" id="description" rows={4} required value={formData.description} onChange={handleChange} className="bg-gray-100 mt-1 block w-full border-gray-200 rounded-lg shadow-sm focus:ring-zen-primary focus:border-zen-primary"></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="address" className="block text-sm font-medium text-zen-charcoal-light">Dirección</label>
                            <input type="text" name="address" id="address" required value={formData.address} onChange={handleChange} className="bg-gray-100 mt-1 block w-full border-gray-200 rounded-lg shadow-sm focus:ring-zen-primary focus:border-zen-primary" />
                        </div>
                         <div>
                            <label htmlFor="city" className="block text-sm font-medium text-zen-charcoal-light">Ciudad</label>
                            <input type="text" name="city" id="city" required value={formData.city} onChange={handleChange} className="bg-gray-100 mt-1 block w-full border-gray-200 rounded-lg shadow-sm focus:ring-zen-primary focus:border-zen-primary" />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="capacity" className="block text-sm font-medium text-zen-charcoal-light">Capacidad (personas)</label>
                            <input type="number" name="capacity" id="capacity" min="1" required value={formData.capacity} onChange={handleChange} className="bg-gray-100 mt-1 block w-full border-gray-200 rounded-lg shadow-sm focus:ring-zen-primary focus:border-zen-primary" />
                        </div>
                        <div>
                            <label htmlFor="pricePerHour" className="block text-sm font-medium text-zen-charcoal-light">Precio por Hora (€)</label>
                            <input type="number" name="pricePerHour" id="pricePerHour" min="1" required value={formData.pricePerHour} onChange={handleChange} className="bg-gray-100 mt-1 block w-full border-gray-200 rounded-lg shadow-sm focus:ring-zen-primary focus:border-zen-primary" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-zen-charcoal-light">Servicios</h3>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                            {allAmenities.map(amenity => (
                                <div key={amenity} className="flex items-center">
                                    <input id={amenity} name="amenities" type="checkbox" checked={formData.amenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} className="h-4 w-4 text-zen-primary border-gray-300 rounded focus:ring-zen-primary" />
                                    <label htmlFor={amenity} className="ml-2 text-sm text-gray-600">{amenity}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-zen-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-zen-primary-dark transition-colors">
                            Publicar Espacio
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};