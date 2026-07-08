import React, { useEffect, useState } from "react";
import { getAllThemes, getThemeCategories } from "../services/themeService";
import ThemeCard from "../component/ThemeCard";
import { Link } from "react-router-dom";
import '../styles/Themes.css';
import standardLogoBirthday from '../assets/standardlogo.jpeg';
import premiumLogoBirthday from '../assets/premiumlogo.jpg';
import exclusiveLogoBirthday from '../assets/exclusivelogo.jpeg';
import standardLogoCorporate from '../assets/standlogo.jpg';
import premiumLogoCorporate from '../assets/prelogo.jpg';
import exclusiveLogoCorporate from '../assets/exclogo.jpg';
import standardLogoWedding from '../assets/standlogowedd.jpg';
import premiumLogoWedding from '../assets/premiumlogowedd.webp';
import exclusiveLogoWedding from '../assets/exelogowedd.avif';
import meghLogo from '../assets/meghlogo.avif';
import aruLogo from '../assets/arulogo.webp';
import sikLogo from '../assets/siklogo.jpeg.jpg';
import manLogo from '../assets/manlogo.jpg';
import delLogo from '../assets/dellogo.jpg';
import kashLogo from '../assets/kashlogo.jpg';

const Themes = () => {
  const [themes, setThemes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(''); // 'asc' or 'desc'

  useEffect(() => {
    async function fetchCategories() {
      try {
        const cats = await getThemeCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchThemes() {
      if (!searchTerm && !selectedCategory) {
        setThemes([]);
        return;
      }
      try {
        const filters = selectedCategory ? { category: selectedCategory } : {};
        const allThemes = await getAllThemes(filters);
        setThemes(allThemes);
      } catch (error) {
        console.error("Failed to fetch themes:", error);
      }
    }
    fetchThemes();
  }, [selectedCategory, searchTerm]);

  // Filter themes by search term
  const filteredThemes = themes.filter(theme =>
    theme.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort themes by price
  const sortedThemes = [...filteredThemes].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.price - b.price;
    } else if (sortOrder === 'desc') {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <div className="themes-container">
      <div className="filters-container">
        <div className="category-filter">
          <label htmlFor="category-select">Filter by Category: </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="search-filter">
          <label htmlFor="search-input">Search Themes: </label>
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name"
          />
        </div>
        <div className="sort-filter">
          <label htmlFor="sort-select">Sort by Price: </label>
          <select
            id="sort-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">None</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
      </div>
      {(searchTerm || selectedCategory) && (
        <div className="themes-list">
          {sortedThemes.length > 0 ? (
            sortedThemes.map((theme) => {
              const imageToUse = theme.id === 'b1' ? standardLogoBirthday :
                theme.id === 'b2' ? premiumLogoBirthday :
                theme.id === 'b3' ? exclusiveLogoBirthday :
                theme.id === 'c1' ? standardLogoCorporate :
                theme.id === 'c2' ? premiumLogoCorporate :
                theme.id === 'c3' ? exclusiveLogoCorporate :
                theme.id === 'w1' ? standardLogoWedding :
                theme.id === 'w2' ? premiumLogoWedding :
                theme.id === 'w3' ? exclusiveLogoWedding :
                theme.id === 't1' ? meghLogo :
                theme.id === 't2' ? aruLogo :
                theme.id === 't3' ? sikLogo :
                theme.id === 't4' ? manLogo :
                theme.id === 't5' ? delLogo :
                theme.id === 't6' ? kashLogo :
                theme.category === 'Standard' ? standardLogoBirthday :
                theme.category === 'Premium' ? premiumLogoBirthday :
                theme.category === 'Exclusive' ? exclusiveLogoBirthday :
                null;
              return (
                <div key={theme.id} className="theme-card-wrapper">
                  <ThemeCard
                    id={theme.id}
                    title={theme.name}
                    description={theme.description || ''}
                    image={imageToUse}
                    price={theme.price}
                    category={theme.category}
                    features={theme.features || []}
                  />
                  <Link to={`/booking/${theme.id}`} className="booking-link">
                    Book Now
                  </Link>
                </div>
              );
            })
          ) : (
            <p>No themes available.</p>
          )}
        </div>
      )}

      <section className="intro-section">
        <h1>Welcome to Our Event Themes</h1>
        <p>Discover the best event themes tailored to your needs. We offer a variety of packages to make your event memorable.</p>
        <div className="features">
          <h2>Our Features</h2>
          <ul>
            <li>Wide range of customizable themes</li>
            <li>Experienced event planners</li>
            <li>Affordable pricing</li>
            <li>Excellent customer support</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Themes;
