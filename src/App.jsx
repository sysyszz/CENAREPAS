import { BrowserRouter } from 'react-router-dom';
import { useState } from 'react';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import { AppRoutes } from './routes';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}
