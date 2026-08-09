import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PriceCard from './PriceCard';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

describe('PriceCard Component', () => {
  const mockTheme = {
    id: 'b1',
    name: 'Birthday Standard',
    price: 3000,
    category: 'Birthday'
  };

  it('renders theme details correctly', () => {
    render(
      <BrowserRouter>
        <PriceCard theme={mockTheme} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Birthday Standard')).toBeInTheDocument();
    expect(screen.getByText('₹3,000')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view details/i })).toHaveAttribute('href', '/theme/b1');
  });
});
