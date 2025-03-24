import { BrowserRouter } from 'react-router';
import './App.css'
import AppRoutes from './routes/AppRoutes';
import ThemeWrapper from './theme/ThemeWrapper';
import { APIProvider } from '@vis.gl/react-google-maps';
import { ApiProvider } from './hooks/useApi';

function App() {

  return (
    <ThemeWrapper>
      <ApiProvider>
        <BrowserRouter>
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <AppRoutes />
          </APIProvider>
        </BrowserRouter>
      </ApiProvider>
    </ThemeWrapper>
  );
}

export default App
