
import React, { useState } from 'react';

interface ImageGalleryProps {
    images: string[];
    title: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
    if (!images || images.length === 0) {
        return <div className="bg-gray-200 w-full h-96 rounded-xl"></div>;
    }

    const [mainImage, setMainImage] = useState(images[0]);

    return (
        <div>
            <div className="h-96 w-full mb-2">
                <img src={mainImage} alt={title} className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="grid grid-cols-5 gap-2">
                {images.slice(0, 5).map((img, index) => (
                     <div key={index} className="h-24">
                         <img 
                            src={img} 
                            alt={`${title} ${index + 1}`} 
                            onClick={() => setMainImage(img)}
                            className={`w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-all ${mainImage === img ? 'ring-2 ring-zen-primary' : 'opacity-70'}`}
                         />
                     </div>
                ))}
            </div>
        </div>
    );
};