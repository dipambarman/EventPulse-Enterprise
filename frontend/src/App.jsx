import React from 'react';
import './App.css';
import './styles/header.css';
import './styles/header.css';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import Home from './page/Home';
import Themes from './page/Themes';
import Booking from './page/Booking';
import Payment from './page/Payment';
import Confirmation from './page/Confirmation';
import Error from './page/Error';
import Login from './page/Login';
import Register from './page/Register';
import AboutUsPage from './page/AboutUs';
import ContactUs from './page/ContactUs';
import Terms from './page/Terms';
import Privacy from './page/Privacy';
import ThemeDetails from './page/ThemeDetails';
import { Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <div className="App" style={{ paddingTop: '70px' }}>
      <h2>GU Event Planner</h2>
      <header>
        <Navbar />
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/themes" element={<Themes />} />
        <Route path="/themes/:id" element={<ThemeDetails />} />
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

      <p>Please contact us for any queries at info@gueventplanner.com.</p>
     

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default App;
