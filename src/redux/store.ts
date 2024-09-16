import { configureStore } from '@reduxjs/toolkit'
import StoreReducers from '@/app/dashboard/store/feature/store.feature'
import UserReducers from '@/app/auth/user/features/user.feature'
import SubsidiaryReducers from '@/app/dashboard/subsidiary/feature/subsidiary.feature'
import tagsReducers from '@/app/dashboard/tags/feature/tags.feature'
import globalProductsReducers from '@/app/dashboard/global-products/feature/global-products.feature'

export const store = configureStore({
  reducer: {
    store: StoreReducers,
    user: UserReducers,
    subsidiary: SubsidiaryReducers,
    tags: tagsReducers,
    globalProducts: globalProductsReducers,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch