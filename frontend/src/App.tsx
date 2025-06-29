import { BrowserRouter } from 'react-router';
import './App.css'
import AppRoutes from './routes/AppRoutes';
import ThemeWrapper from './theme/ThemeWrapper';
import { APIProvider } from '@vis.gl/react-google-maps';
import { ApiProvider } from './hooks/useApi';
import { AlertProvider } from './hooks/useAlert';

function App() {

  return (
    <ThemeWrapper>
      <AlertProvider>
        <ApiProvider>
          <BrowserRouter>
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
              <AppRoutes />
            </APIProvider>
          </BrowserRouter>
        </ApiProvider>
      </AlertProvider>
    </ThemeWrapper>
  );
}

export default App
