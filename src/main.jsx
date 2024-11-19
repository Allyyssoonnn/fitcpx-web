import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './scss/index.scss';
import './scss/css/styles.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './App.jsx';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </RecoilRoot>
  // </StrictMode>,
)
