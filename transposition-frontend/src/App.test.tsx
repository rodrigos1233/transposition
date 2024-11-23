import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
    it('renders without crashing', () => {
        render(<App />);
        // Replace 'Welcome' with some text or element you expect to see in the App component
        const linkElement = screen.getByText(/welcome/i);
        expect(linkElement).toBeInTheDocument();
    });
});
