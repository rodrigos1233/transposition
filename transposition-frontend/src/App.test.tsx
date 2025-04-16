import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
    it('renders without crashing', () => {
        render(<App />);
        const linkElement = screen.getByText(/welcome/i);
        expect(linkElement).toBeInTheDocument();
    });
});
