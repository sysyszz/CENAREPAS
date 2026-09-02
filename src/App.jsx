import { BrowserRouter } from 'react-router-dom';
import { useState } from 'react';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import { PermissionProvider } from './shared/contexts/PermissionContext';
import { ConfiguracionProvider } from './shared/contexts/ConfiguracionContext';
import { AppRoutes } from './routes';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ThemeProvider>
      <PermissionProvider>
        <ConfiguracionProvider>
          <BrowserRouter>
            <AppRoutes
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          </BrowserRouter>
        </ConfiguracionProvider>
      </PermissionProvider>
    </ThemeProvider>
  );
}
