import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import ProtectedRoute from './component/ProtectedRoute';

// Lazy loading page routes for optimal initial bundle size and speed
const Home = lazy(() => import('./page/Home'));
const Themes = lazy(() => import('./page/Themes'));
const ThemeDetails = lazy(() => import('./page/ThemeDetails'));
const EventCalculator = lazy(() => import('./page/EventCalculator'));
const ClientPortal = lazy(() => import('./page/ClientPortal'));
const AdminDashboard = lazy(() => import('./page/AdminDashboard'));
const Booking = lazy(() => import('./page/Booking'));
const Payment = lazy(() => import('./page/Payment'));
const Confirmation = lazy(() => import('./page/Confirmation'));
const Login = lazy(() => import('./page/Login'));
const Register = lazy(() => import('./page/Register'));
const ForgotPassword = lazy(() => import('./page/ForgotPassword'));
const ResetPassword = lazy(() => import('./page/ResetPassword'));
const AboutUsPage = lazy(() => import('./page/AboutUs'));
const ContactUs = lazy(() => import('./page/ContactUs'));
const Terms = lazy(() => import('./page/Terms'));
const Privacy = lazy(() => import('./page/Privacy'));
const Error = lazy(() => import('./page/Error'));

const PageLoader = () => (
  <div className="ep-loader" role="status" aria-label="Loading page content">
    <div className="ep-loader-spinner" />
    <span className="ep-loader-text">Loading EventPulse...</span>
  </div>
);

const App = () => {
  return (
    <div className="app-wrapper">
      <header>
        <Navbar />
      </header>

      <main className="app-main">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/themes" element={<Themes />} />
            <Route path="/themes/:id" element={<ThemeDetails />} />
            <Route path="/calculator" element={<EventCalculator />} />
            <Route path="/client-portal" element={<ProtectedRoute><ClientPortal /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
            <Route path="/booking/:themeId" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/payment/:bookingId" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/confirmation" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Suspense>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default App;

