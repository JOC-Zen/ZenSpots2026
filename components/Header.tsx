
import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { View } from '../App';
import { LogoIcon } from './icons/LogoIcon';
import { HomeIcon } from './icons/HomeIcon';
import { SearchIcon } from './icons/SearchIcon';
import { LoginIcon } from './icons/LoginIcon';
import { UserIcon as SignUpIcon } from './icons/UserIcon';

interface HeaderProps {
    onNavigateHome: () => void;
    onNavigateToBrowse: () => void;
    onNavigate: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateHome, onNavigateToBrowse, onNavigate }) => {
    const { user, logout } = useContext(UserContext);

    return (
        <header className="bg-white sticky top-0 z-50 border-b border-zen-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-8">
                        <button onClick={onNavigateHome} data-testid="nav-logo" className="flex-shrink-0 focus:outline-none flex items-center space-x-2">
                            <LogoIcon className="h-8 w-8 text-zen-primary" />
                            <span className="text-2xl font-bold tracking-tight text-zen-charcoal">
                                ZenSpots
                            </span>
                        </button>
                        <nav className="hidden md:flex items-baseline space-x-6">
                            <button onClick={onNavigateHome} data-testid="nav-home" className="text-zen-charcoal-light hover:text-zen-charcoal px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2">
                                <HomeIcon className="h-5 w-5" />
                                <span>Home</span>
                            </button>
                            <button onClick={onNavigateToBrowse} data-testid="nav-browse" className="text-zen-charcoal-light hover:text-zen-charcoal px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2">
                                <SearchIcon className="h-5 w-5" />
                                <span>Browse Spaces</span>
                            </button>
                        </nav>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6 space-x-2">
                            {user ? (
                                <>
                                    <button onClick={() => onNavigate('profile')} data-testid="nav-profile" className="flex items-center text-zen-charcoal hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium">
                                        <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full mr-2" />
                                        Profile
                                    </button>
                                    <button onClick={logout} data-testid="nav-logout" className="ml-2 text-zen-charcoal px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => onNavigate('login')} data-testid="nav-login" className="text-zen-charcoal hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                                        <LoginIcon className="h-5 w-5" />
                                        <span>Login</span>
                                    </button>
                                    <button onClick={() => onNavigate('signup')} data-testid="nav-signup" className="bg-zen-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zen-primary-dark transition flex items-center space-x-2">
                                        <SignUpIcon className="h-5 w-5" />
                                        <span>Sign Up</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button type="button" className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zen-primary">
                            <span className="sr-only">Open main menu</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};