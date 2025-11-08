// Utility functions for ZenSpots application

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FiltersState } from '../types';

// Combine Tailwind classes with conditional logic
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency for Spanish locale
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

// Format date for Spanish locale
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

// Format time to 24-hour format
export function formatTime(time: string): string {
  return time;
}

// Calculate duration in hours
export function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

// Calculate total price
export function calculateTotalPrice(pricePerHour: number, duration: number): number {
  return pricePerHour * duration;
}

// Generate time slots for a day
export function generateTimeSlots(startHour: number = 8, endHour: number = 20, interval: number = 60): string[] {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(time);
    }
  }
  return slots;
}

// Check if a date is available
export function isDateAvailable(date: string, availability: { [date: string]: string[] }): boolean {
  return availability.hasOwnProperty(date) && availability[date].length > 0;
}

// Get available time slots for a specific date
export function getAvailableSlots(date: string, availability: { [date: string]: string[] }): string[] {
  return availability[date] || [];
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate Spanish phone number
export function isValidSpanishPhone(phone: string): boolean {
  const phoneRegex = /^[679]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Generate a unique ID (for demo purposes)
export function generateUniqueId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Throttle function for scroll events
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Get user location using browser geolocation
export function getUserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  });
}

// Calculate distance between two coordinates (in km)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Sort spaces by distance from user location
export function sortSpacesByDistance(
  spaces: any[],
  userLat: number,
  userLng: number
): any[] {
  return spaces
    .map(space => ({
      ...space,
      distance: calculateDistance(
        userLat,
        userLng,
        space.location.lat,
        space.location.lng
      ),
    }))
    .sort((a, b) => a.distance - b.distance);
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Validate image file
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return validTypes.includes(file.type) && file.size <= maxSize;
}

// Capitalize first letter
export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substr(0, 2);
}

// Check if time slot is in the past
export function isTimeSlotPast(date: string, time: string): boolean {
  const now = new Date();
  const slotDateTime = new Date(`${date}T${time}:00`);
  return slotDateTime < now;
}

// Get next available date
export function getNextAvailableDate(availability: { [date: string]: string[] }): string | null {
  const today = new Date();
  const dates = Object.keys(availability).sort();
  
  for (const date of dates) {
    const dateObj = new Date(date);
    if (dateObj >= today && availability[date].length > 0) {
      return date;
    }
  }
  
  return null;
}

// Convert rating to stars
export function getStarRating(rating: number): string[] {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push('★');
  }
  
  if (hasHalfStar) {
    stars.push('☆');
  }
  
  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push('☆');
  }
  
  return stars;
}

// Filter spaces based on filters
export function filterSpaces(spaces: any[], filters: FiltersState): any[] {
  return spaces.filter(space => {
    // Location filter
    if (filters.location && filters.location.trim() !== '') {
      const locationStr = `${space.location.address}, ${space.location.city}, ${space.location.region}`.toLowerCase();
      const searchTerm = filters.location.toLowerCase();
      if (!locationStr.includes(searchTerm)) {
        return false;
      }
    }

    // Price range filter
    if (filters.priceRange && filters.priceRange.length === 2) {
      const [minPrice, maxPrice] = filters.priceRange;
      if (space.pricePerHour < minPrice || space.pricePerHour > maxPrice) {
        return false;
      }
    }

    // Space types filter
    if (filters.spaceTypes && filters.spaceTypes.length > 0) {
      if (!filters.spaceTypes.includes(space.type)) {
        return false;
      }
    }

    // Capacity filter
    if (filters.capacity && filters.capacity > 1) {
      if (space.capacity < filters.capacity) {
        return false;
      }
    }

    // Date availability filter
    if (filters.date && filters.date !== '') {
      if (!space.availability || !space.availability[filters.date] || space.availability[filters.date].length === 0) {
        return false;
      }
    }

    return true;
  });
}