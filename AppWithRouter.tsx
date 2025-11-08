import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { UserProvider } from '../contexts/UserContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { HomePage } from '../pages/HomePage';
import { BrowsePage } from '../pages/BrowsePage';
import { SpaceDetailPage } from '../pages/SpaceDetailPage';
import { LoginPage } from '../pages/LoginPage';
import { SignUpPage } from '../pages/SignUpPage';
import { ProfilePage } from '../pages/ProfilePage';
import { NewListingPage } from '../pages/NewListingPage';
import { BookingConfirmationPage } from '../pages/BookingConfirmationPage';
import { HostDashboardPage } from '../pages/HostDashboardPage';
import { ManageAvailabilityPage } from '../pages/ManageAvailabilityPage';

// Layout component with Header and Footer
const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Create router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "browse",
        element: <BrowsePage />,
      },
      {
        path: "space/:id",
        element: <SpaceDetailPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "host-dashboard",
        element: <HostDashboardPage />,
      },
      {
        path: "manage-availability/:id",
        element: <ManageAvailabilityPage />,
      },
      {
        path: "new-listing",
        element: <NewListingPage />,
      },
      {
        path: "booking-confirmation",
        element: <BookingConfirmationPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
]);

// Enhanced App component with routing
const App: React.FC = () => {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
};

export default App;