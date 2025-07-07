import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect, Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import LoadingSpinner from './components/UI/LoadingSpinner';
import Breadcrumb from './components/UI/Breadcrumb';

// Pages (code splitting)
const Home = lazy(() => import('./pages/Home'));
const Destinations = lazy(() => import('./pages/Destinations'));
const DestinationDetail = lazy(() => import('./pages/DestinationDetail'));
const Events = lazy(() => import('./pages/Events'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const Accommodations = lazy(() => import('./pages/Accommodations'));
const AccommodationDetail = lazy(() => import('./pages/AccommodationDetail'));
const Restaurants = lazy(() => import('./pages/Restaurants'));
const RestaurantDetail = lazy(() => import('./pages/RestaurantDetail'));
const Search = lazy(() => import('./pages/Search'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminTest = lazy(() => import('./pages/AdminTest'));
const ImageDemo = lazy(() => import('./pages/ImageDemo'));
const GalataTower = lazy(() => import('./pages/GalataTower'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

// Styles
import './App.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />
      {!isHome && <Breadcrumb />}
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner text="Yükleniyor..." />}>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Search */}
            <Route path="/search" element={<Search />} />
            {/* Destinations */}
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetail />} />
            <Route path="/galata-tower" element={<GalataTower />} />
            {/* Events */}
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            {/* Accommodations */}
            <Route path="/accommodations" element={<Accommodations />} />
            <Route path="/accommodations/:id" element={<AccommodationDetail />} />
            {/* Restaurants */}
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            {/* Admin */}
            <Route path="/admin" element={<AdminPanel />} />
            {/* Other */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin-test" element={<AdminTest />} />
            <Route path="/image-demo" element={<ImageDemo />} />
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HelmetProvider>
        <Router>
            <AppContent />
          {/* Toast notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </Router>
        </HelmetProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
