import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { createSupabaseBrowserClient } from '@/libs/supabase/browser-client'
import { toast } from '@/hooks/useToast'
import { GlobalProductsType } from '../types/global-products.type'

const supabase = createSupabaseBrowserClient()

export const getAllGlobalProducts = createAsyncThunk(
  "globalProducts/getAllGlobalProducts", 
  async () => {
    const { data, error } = await supabase
      .from("GLOBAL_PRODUCTS")
      .select("*,GLOBAL_PRODUCTS_TAG(*, TAG(*))")
    if (error && !data) {
      toast({
        title: "Error",
        description: "Hubo un error al obtener los productos globales",
        duration: 2000,
        variant: "destructive"
      })
    }
    return data as GlobalProductsType[] ?? []
  }
)

export const searchGlobalProducts = createAsyncThunk(
  "globalProducts/searchGlobalProducts", 
  async ({ query }: { query: string }) => {
    const { data, error } = await supabase
      .from("GLOBAL_PRODUCTS")
      .select("*,GLOBAL_PRODUCTS_TAG(*, TAG(*))")
      .ilike("name", `%${query}%`);
    if (error && !data) {
      toast({
        title: "Error",
        description: "Hubo un error al buscar productos globales",
        duration: 2000,
        variant: "destructive"
      })
    }
    return data as GlobalProductsType[] ?? []
  }
)

const globalProductsSlice = createSlice({
  name: "globalProducts", 
  initialState:{
    globalProducts: [] as GlobalProductsType[],
    loadingGlobalProducts: false as boolean,
    searchGlobalProducts: [] as GlobalProductsType[],
    loadingSearchGlobalProducts: false as boolean,
  }, 
  reducers: {
    setGlobalProducts: (state, action) => {
      state.globalProducts = action.payload
    }
  }, 
  extraReducers: (builder) => {
    builder.addCase(getAllGlobalProducts.pending, (state, action) => {
      state.loadingGlobalProducts = true
    })
    builder.addCase(getAllGlobalProducts.fulfilled, (state, action) => {
      state.globalProducts = action.payload
      state.loadingGlobalProducts = false
    })
    builder.addCase(getAllGlobalProducts.rejected, (state, action) => {
      state.loadingGlobalProducts = false
    })  
    builder.addCase(searchGlobalProducts.pending, (state, action) => {
      state.loadingSearchGlobalProducts = true
    })
    builder.addCase(searchGlobalProducts.fulfilled, (state, action) => {
      state.searchGlobalProducts = action.payload
      state.loadingSearchGlobalProducts = false
    })
    builder.addCase(searchGlobalProducts.rejected, (state, action) => {
      state.loadingSearchGlobalProducts = false
    })
  }
})

export const { setGlobalProducts } = globalProductsSlice.actions

export default globalProductsSlice.reducer