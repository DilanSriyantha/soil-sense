import { BrowserRouter } from 'react-router';
import './App.css'
import AppRoutes from './routes/AppRoutes';
import ThemeWrapper from './theme/ThemeWrapper';

function App() {

  return (
    <ThemeWrapper>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeWrapper>
  );
}

export default App
