import React, { useEffect, useState } from "react";
import { getAllThemes, getThemeCategories } from "../services/themeService";
import ThemeCard from "../component/ThemeCard";
import { Link } from "react-router-dom";
import '../styles/Themes.css';

const Themes = () => {
  const [themes, setThemes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const cats = await getThemeCategories();
        setCategories(cats || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchThemes() {
      setLoading(true);
      try {
        const filters = selectedCategory ? { category: selectedCategory } : {};
        const allThemes = await getAllThemes(filters);
        setThemes(allThemes || []);
      } catch (error) {
        console.error("Failed to fetch themes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchThemes();
  }, [selectedCategory]);

  const filteredThemes = themes.filter(theme =>
    theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (theme.category && theme.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedThemes = [...filteredThemes].sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price;
    if (sortOrder === 'desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="ep-themes-page" id="themes-catalog-page">
      {/* Header Banner */}
      <div className="ep-themes-hero">
        <div className="ep-container">
          <span className="ep-badge ep-badge-primary">Curated Collection</span>
          <h1 className="ep-themes-title">Event Packages & Experience Themes</h1>
          <p className="ep-themes-subtitle">
            Explore our production-ready event packages designed for weddings, corporate summits, galas, and celebrations.
          </p>
        </div>
      </div>

      <div className="ep-container ep-themes-body">
        {/* Filters Toolbar */}
        <div className="ep-filters-bar ep-card">
          <div className="ep-filter-group">
            <label htmlFor="search-input">Search Packages</label>
            <input
              id="search-input"
              type="text"
              className="ep-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by package name or keyword..."
            />
          </div>

          <div className="ep-filter-group">
            <label htmlFor="category-select">Category</label>
            <select
              id="category-select"
              className="ep-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="ep-filter-group">
            <label htmlFor="sort-select">Sort by Price</label>
            <select
              id="sort-select"
              className="ep-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="">Featured</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="ep-themes-grid" aria-label="Loading themes catalog">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="ep-skeleton-card">
                <div className="ep-skeleton-img" />
                <div className="ep-skeleton-body">
                  <div className="ep-skeleton-line title" />
                  <div className="ep-skeleton-line sub" />
                  <div className="ep-skeleton-line" style={{ width: '40%', marginTop: 'auto' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ep-themes-grid">
            {sortedThemes.length > 0 ? (
              sortedThemes.map((theme) => (
                <div key={theme.id} className="ep-theme-card-wrapper">
                  <ThemeCard theme={theme} />
                </div>
              ))
            ) : (
              <div className="ep-no-results ep-card">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--ep-gray-400)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <h3>No matching themes found</h3>
                <p>Try resetting your search query or selecting a different category filter.</p>
                <button
                  className="ep-btn ep-btn-outline ep-btn-sm"
                  onClick={() => { setSearchTerm(''); setSelectedCategory(''); setSortOrder(''); }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Themes;
