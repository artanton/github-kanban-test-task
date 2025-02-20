import {configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { boardReducer } from './taskSlice';
;


const persistConfig = {
  key: 'board',
  storage,
  whitelist: ['boardSections'],
};

const persistedRootReducer = persistReducer(persistConfig, boardReducer);

export const store = configureStore({
  reducer: persistedRootReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;