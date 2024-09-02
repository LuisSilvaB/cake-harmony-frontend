import { configureStore } from '@reduxjs/toolkit'
import StoreReducers from '@/app/dashboard/[storeId]/feature/store.feature'
export const store = configureStore({
  reducer: {
    store: StoreReducers,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch