import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "@/components/ui/provider"


import App from './App.tsx'
import { theme } from './components/Theme.js';
import { ThemeProvider } from 'styled-components';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>

     <ThemeProvider theme={theme}>
    <App />
    </ThemeProvider>
    </Provider>
  </StrictMode>,
)
