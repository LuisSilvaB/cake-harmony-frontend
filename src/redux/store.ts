import { configureStore } from '@reduxjs/toolkit'
import StoreReducers from '@/app/dashboard/store/feature/store.feature'
import UserReducers from '@/app/auth/user/features/user.feature'
export const store = configureStore({
  reducer: {
    store: StoreReducers,
    user: UserReducers,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch