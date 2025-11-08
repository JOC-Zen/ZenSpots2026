
import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-zen-border">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-4">
                         <div className="flex items-center space-x-2">
                            <LogoIcon className="h-7 w-7 text-zen-primary" />
                            <span className="text-xl font-bold text-zen-charcoal">
                                ZenSpots
                            </span>
                        </div>
                        <div className="text-sm text-gray-500">
                            &copy; {new Date().getFullYear()} ZenSpots. All rights reserved.
                        </div>
                    </div>
                     <div className="flex mt-4 md:mt-0 space-x-6">
                        <a href="#" className="text-sm text-gray-500 hover:text-zen-charcoal">About Us</a>
                        <a href="#" className="text-sm text-gray-500 hover:text-zen-charcoal">Contact</a>
                        <a href="#" className="text-sm text-gray-500 hover:text-zen-charcoal">Privacy Policy</a>
                        <a href="#" className="text-sm text-gray-500 hover:text-zen-charcoal">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};