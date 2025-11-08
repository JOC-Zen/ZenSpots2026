
import React from 'react';
import { Review, User } from '../types';
import { mockUsers } from '../data/mockData';
import { GenericIcon } from './icons/GenericIcon';

interface ReviewListProps {
    reviews: Review[];
    averageRating: number;
    reviewCount: number;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center">
            {Array.from({ length: 5 }, (_, i) => (
                <svg key={i} className={`w-5 h-5 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            ))}
        </div>
    );
};

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, averageRating, reviewCount }) => {
    
    const findUser = (userId: number): User | undefined => mockUsers.find(u => u.id === userId);

    return (
        <div>
            <div className="flex items-center mb-6">
                 <h3 className="text-xl font-semibold text-zen-charcoal">Opiniones de Usuarios</h3>
                 <div className="flex items-center ml-4">
                    <GenericIcon type="star" />
                    <span className="ml-1 font-bold">{averageRating.toFixed(1)}</span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="text-sm text-zen-charcoal-light">{reviewCount} reseñas</span>
                 </div>
            </div>

            <div className="space-y-8">
                {reviews.slice(0, 3).map(review => {
                    const user = findUser(review.userId);
                    const reviewDate = new Date(review.createdAt + 'T00:00:00');
                    const formattedDate = reviewDate.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    });

                    return (
                        <div key={review.id} className="flex items-start">
                            <img src={user?.avatarUrl} alt={user?.name} className="w-12 h-12 rounded-full mr-4" />
                            <div className="w-full">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-zen-charcoal">{user?.name}</h4>
                                    <p className="text-xs text-gray-500">{formattedDate}</p>
                                </div>
                                <StarRating rating={review.rating} />
                                <p className="mt-2 text-zen-charcoal-light leading-relaxed">{review.comment}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
