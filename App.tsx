
import React, { useState, useEffect, useContext } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePageMobile } from './pages/HomePageMobile';
import { HomePageDesktop } from './pages/HomePageDesktop';
import { BrowsePage } from './pages/BrowsePage';
import { SpaceDetailPage } from './pages/SpaceDetailPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ProfilePage } from './pages/ProfilePage';
import { NewListingPage } from './pages/NewListingPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { HostDashboardPage } from './pages/HostDashboardPage';
import { ManageAvailabilityPage } from './pages/ManageAvailabilityPage';
import { mockSpaces as initialSpaces, mockUsers, mockReviews, mockBookings as initialBookings } from './data/mockData';
import { Space, User, Review, FiltersState, Booking, BookingSummary } from './types';
import { UserContext } from './contexts/UserContext';
import { supabase } from './utils/supabaseClient';

export type View = 'home' | 'browse' | 'detail' | 'login' | 'signup' | 'profile' | 'new-listing' | 'booking-confirmation' | 'host-dashboard' | 'manage-availability';

const App: React.FC = () => {
    const [view, setView] = useState<View>('home');
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [homeViewMode, setHomeViewMode] = useState<'auto' | 'mobile' | 'desktop'>(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const param = urlParams.get('view');
        if (param === 'desktop' || param === 'mobile') return param as 'desktop' | 'mobile';
        return 'auto';
    });
    const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(null);
    const [spaceToManageId, setSpaceToManageId] = useState<number | null>(null);
    const [initialBrowseFilters, setInitialBrowseFilters] = useState<Partial<FiltersState> | null>(null);
    const [lastBooking, setLastBooking] = useState<BookingSummary | null>(null);

    // App state for data that can be modified
    const [spaces, setSpaces] = useState<Space[]>(initialSpaces);
    const [bookings, setBookings] = useState<Booking[]>(initialBookings);
    
    const { login, user } = useContext(UserContext);

    // This effect persists the user session on page load
    useEffect(() => {
        if (!user) {
            const storedUser = localStorage.getItem('zenSpotsUser');
            if (storedUser) {
                login(JSON.parse(storedUser));
            }
        }
    }, [login, user]);

    // Detect viewport to choose mobile/desktop homepage
    useEffect(() => {
        const updateIsMobile = () => setIsMobile(window.innerWidth < 768);
        updateIsMobile();
        window.addEventListener('resize', updateIsMobile);
        return () => window.removeEventListener('resize', updateIsMobile);
    }, []);

    const handleNavigate = (newView: View, contextId?: number) => {
        window.scrollTo(0, 0);
        if (newView === 'manage-availability' && contextId) {
            setSpaceToManageId(contextId);
        }
        if (newView === 'detail' && contextId) {
            setSelectedSpaceId(contextId);
        }
        if (newView === 'new-listing' && !user) {
            setView('login');
        } else {
            setView(newView);
        }
    };

    const handleSelectSpace = (space: Space) => {
        setSelectedSpaceId(space.id);
        handleNavigate('detail');
    };

    const handleNavigateHome = () => {
        handleNavigate('home');
        setSelectedSpaceId(null);
    };

    const handleNavigateToBrowse = (filters: Partial<FiltersState> | null = null) => {
        setInitialBrowseFilters(filters);
        handleNavigate('browse');
        setSelectedSpaceId(null);
    };

    const handleBackToBrowse = () => {
        handleNavigate('browse');
        setSelectedSpaceId(null);
    };

    const handleCreateBooking = (bookingDetails: Omit<Booking, 'id' | 'space'>, recurrence: { type: 'none' | 'weekly' | 'monthly', count: number }) => {
        const space = getSelectedSpace();
        if (!space) return;

        const { date, ...restOfDetails } = bookingDetails;
        let firstBooking: Booking | null = null;
        let totalBookingsPrice = 0;

        const bookingCount = recurrence.type === 'none' ? 1 : recurrence.count;

        for (let i = 0; i < bookingCount; i++) {
            const bookingDate = new Date(date);
            bookingDate.setUTCHours(12); // Avoid timezone issues
            if (recurrence.type === 'weekly') {
                bookingDate.setDate(bookingDate.getDate() + (7 * i));
            } else if (recurrence.type === 'monthly') {
                bookingDate.setMonth(bookingDate.getMonth() + i);
            }

            const newBooking: Booking = {
                id: bookings.length + i + 1,
                date: bookingDate.toISOString().split('T')[0],
                ...restOfDetails,
                space: space,
            };

            if (i === 0) {
                firstBooking = newBooking;
            }
            totalBookingsPrice += newBooking.totalPrice;
            setBookings(prev => [...prev, newBooking]);
        }
        
        if (firstBooking) {
             const bookingSummary: BookingSummary = {
                firstBooking,
                recurrenceType: recurrence.type,
                recurrenceCount: bookingCount,
                totalPrice: totalBookingsPrice,
            };
            setLastBooking(bookingSummary);
            handleNavigate('booking-confirmation');
        }
    };
    
    const handleCreateListing = (newSpaceData: Omit<Space, 'id' | 'rating' | 'reviewCount'>) => {
        const newSpace: Space = {
            ...newSpaceData,
            id: spaces.length + 1,
            rating: 0,
            reviewCount: 0,
        };
        setSpaces(prev => [...prev, newSpace]);
        handleNavigate('profile'); 
    };

    const handleUpdateAvailability = (spaceId: number, newAvailability: { [date: string]: string[] }) => {
        setSpaces(prevSpaces => prevSpaces.map(space => 
            space.id === spaceId ? { ...space, availability: newAvailability } : space
        ));
        handleNavigate('host-dashboard');
    };

    const getSelectedSpace = (): Space | undefined => {
        return spaces.find(s => s.id === selectedSpaceId);
    };

    const getSpaceToManage = (): Space | undefined => {
        return spaces.find(s => s.id === spaceToManageId);
    };

    const getHostForSpace = (space?: Space): User | undefined => {
        if (!space) return undefined;
        return mockUsers.find(u => u.id === space.hostId);
    };
    
    const getBookingsForSpace = (space?: Space): Booking[] => {
        if (!space) return [];
        return bookings.filter(b => b.space.id === space.id);
    };

    const getReviewsForSpace = (space?: Space): Review[] => {
        if (!space) return [];
        return mockReviews.filter(r => r.spaceId === space.id);
    };

    // Cargar reseñas desde Supabase para el espacio seleccionado, con respaldo a mock
    const [spaceReviews, setSpaceReviews] = useState<Review[]>([]);

    useEffect(() => {
        const selected = getSelectedSpace();
        if (!selected) {
            setSpaceReviews([]);
            return;
        }

        // Inicializar con reseñas mock como respaldo
        setSpaceReviews(getReviewsForSpace(selected));

        const loadReviews = async () => {
            try {
                const { data, error } = await supabase
                    .from('reviews')
                    .select('*')
                    .eq('space_id', selected.id)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.warn('Supabase reviews error:', error);
                    return; // mantener respaldo mock
                }

                if (!data) {
                    return; // mantener respaldo mock
                }

                const mapped: Review[] = data.map((row: any) => ({
                    id: row.id,
                    spaceId: row.space_id,
                    userId: row.user_id,
                    rating: Number(row.rating ?? 0),
                    comment: row.comment ?? '',
                    createdAt: row.created_at ?? new Date().toISOString(),
                }));

                setSpaceReviews(mapped);
            } catch (err) {
                console.error('Error loading reviews:', err);
            }
        };

        loadReviews();
    }, [selectedSpaceId]);

    const selectedSpace = getSelectedSpace();
    const spaceToManage = getSpaceToManage();

    const renderContent = () => {
        const forceDesktop = homeViewMode === 'desktop';
        const forceMobile = homeViewMode === 'mobile';
        switch (view) {
            case 'home':
                if (forceDesktop) {
                    return <HomePageDesktop onSearch={handleNavigateToBrowse} onNavigate={handleNavigate} />;
                }
                if (forceMobile) {
                    return <HomePageMobile onSearch={handleNavigateToBrowse} onNavigate={handleNavigate} />;
                }
                return isMobile 
                    ? <HomePageMobile onSearch={handleNavigateToBrowse} onNavigate={handleNavigate} />
                    : <HomePageDesktop onSearch={handleNavigateToBrowse} onNavigate={handleNavigate} />;
            case 'browse':
                return <BrowsePage onSelectSpace={handleSelectSpace} initialFilters={initialBrowseFilters} />;
            case 'detail':
                if (selectedSpace) {
                    return <SpaceDetailPage
                        space={selectedSpace}
                        host={getHostForSpace(selectedSpace)}
                        reviews={spaceReviews}
                        bookingsForSpace={getBookingsForSpace(selectedSpace)}
                        onBack={handleBackToBrowse}
                        onBook={handleCreateBooking}
                    />;
                }
                handleNavigateToBrowse();
                return null;
            case 'login':
                return <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleNavigateHome} />;
            case 'signup':
                return <SignUpPage onNavigate={handleNavigate} />;
            case 'profile':
                return <ProfilePage onNavigate={handleNavigate} allSpaces={spaces} allBookings={bookings} />;
            case 'new-listing':
                return <NewListingPage onNavigate={handleNavigate} onCreateListing={handleCreateListing} />;
            case 'booking-confirmation':
                return <BookingConfirmationPage bookingSummary={lastBooking} onNavigateHome={handleNavigateHome} />;
            case 'host-dashboard':
                return <HostDashboardPage allSpaces={spaces} allBookings={bookings} onNavigate={handleNavigate} />;
            case 'manage-availability':
                if (spaceToManage) {
                    return <ManageAvailabilityPage space={spaceToManage} onSave={handleUpdateAvailability} onBack={() => handleNavigate('host-dashboard')} />;
                }
                 handleNavigate('host-dashboard');
                 return null;
            default:
                return <HomePage onSearch={handleNavigateToBrowse} onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header 
                onNavigateHome={handleNavigateHome} 
                onNavigateToBrowse={() => handleNavigateToBrowse()} 
                onNavigate={handleNavigate} 
                onToggleHomeView={() => setHomeViewMode(prev => prev === 'desktop' ? 'mobile' : prev === 'mobile' ? 'auto' : 'desktop')}
                homeViewMode={homeViewMode}
            />
            <main className="flex-grow">
                {renderContent()}
            </main>
            <Footer />
        </div>
    );
};

export default App;