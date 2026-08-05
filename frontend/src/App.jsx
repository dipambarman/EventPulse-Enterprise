import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import Home from './page/Home';
import Themes from './page/Themes';
import ThemeDetails from './page/ThemeDetails';
import EventCalculator from './page/EventCalculator';
import ClientPortal from './page/ClientPortal';
import AdminDashboard from './page/AdminDashboard';
import Booking from './page/Booking';
import Payment from './page/Payment';
import Confirmation from './page/Confirmation';
import Login from './page/Login';
import Register from './page/Register';
import AboutUsPage from './page/AboutUs';
import ContactUs from './page/ContactUs';
import Terms from './page/Terms';
import Privacy from './page/Privacy';
import Error from './page/Error';

const App = () => {
  return (
    <div className="app-wrapper">
      <header>
        <Navbar />
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/themes" element={<Themes />} />
          <Route path="/themes/:id" element={<ThemeDetails />} />
          <Route path="/calculator" element={<EventCalculator />} />
          <Route path="/client-portal" element={<ClientPortal />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking/:themeId" element={<Booking />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/:bookingId" element={<Payment />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default App;
