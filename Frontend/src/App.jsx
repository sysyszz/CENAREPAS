import { BrowserRouter } from 'react-router-dom';
import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Importar Provider
import { ThemeProvider } from './shared/contexts/ThemeContext';
import { PermissionProvider } from './shared/contexts/PermissionContext';
import { ConfiguracionProvider } from './shared/contexts/ConfiguracionContext';
import { Toaster } from './shared/components/Toaster';
import { AppRoutes } from './routes';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // TEMP: dev preview bypass — tell Claude when done so this can be reverted

  // Reemplaza esto con tu Client ID real de Google Cloud
  const GOOGLE_CLIENT_ID = "241085126353-arfjd2ij4qhuc7033u169ip1psrhjktl.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <PermissionProvider>
          <ConfiguracionProvider>
            <BrowserRouter>
              <AppRoutes
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
              <Toaster />
            </BrowserRouter>
          </ConfiguracionProvider>
        </PermissionProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}