import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ChakraProvider } from "@/components/ui/provider";
import { PersistGate } from 'redux-persist/integration/react';

// import { theme } from './components/Theme.js';
// import { ThemeProvider } from 'styled-components';
import { persistor, store } from './redux/store.ts';
import { Provider } from 'react-redux';
import { App } from './App.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor} >
      <ChakraProvider>
        {/* <ThemeProvider theme={theme}> */}
          <App />
        {/* </ThemeProvider> */}
      </ChakraProvider>
    </PersistGate>
    </Provider>
  </StrictMode>,
);
