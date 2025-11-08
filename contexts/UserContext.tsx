
import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { User } from '../types';

interface UserWithFavorites extends User {
    favoriteSpaceIds?: number[];
}

interface UserContextType {
    user: UserWithFavorites | null;
    login: (userData: User) => void;
    logout: () => void;
    toggleFavorite: (spaceId: number) => void;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    login: () => {},
    logout: () => {},
    toggleFavorite: () => {},
});

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserWithFavorites | null>(null);

    const login = useCallback((userData: User) => {
        const storedFavorites = JSON.parse(localStorage.getItem(`zenSpotsFavorites_${userData.id}`) || '[]');
        const userWithFavorites: UserWithFavorites = { ...userData, favoriteSpaceIds: storedFavorites };
        setUser(userWithFavorites);
        localStorage.setItem('zenSpotsUser', JSON.stringify(userData));
    }, []);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('zenSpotsUser');
    };

    const toggleFavorite = (spaceId: number) => {
        setUser(currentUser => {
            if (!currentUser) return null;

            const currentFavorites = currentUser.favoriteSpaceIds || [];
            const isFavorite = currentFavorites.includes(spaceId);
            const newFavorites = isFavorite
                ? currentFavorites.filter(id => id !== spaceId)
                : [...currentFavorites, spaceId];

            const updatedUser = { ...currentUser, favoriteSpaceIds: newFavorites };
            
            // Persist favorites to localStorage specific to the user
            localStorage.setItem(`zenSpotsFavorites_${currentUser.id}`, JSON.stringify(newFavorites));
            
            return updatedUser;
        });
    };

    return (
        <UserContext.Provider value={{ user, login, logout, toggleFavorite }}>
            {children}
        </UserContext.Provider>
    );
};