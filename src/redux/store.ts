import { configureStore } from '@reduxjs/toolkit'
import StoreReducers from '@/app/dashboard/store/feature/store.feature'
import UserReducers from '@/app/auth/user/features/user.feature'
import SubsidiaryReducers from '@/app/dashboard/subsidiary/feature/subsidiary.feature'

export const store = configureStore({
  reducer: {
    store: StoreReducers,
    user: UserReducers,
    subsidiary: SubsidiaryReducers,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch