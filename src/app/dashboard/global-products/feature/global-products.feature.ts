import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { createSupabaseBrowserClient } from '@/libs/supabase/browser-client'
import { toast } from '@/hooks/useToast'
import { GlobalProductsType } from '../types/global-products.type'
import { debounce } from 'lodash';

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

export const onSearchGlobalProducts = createAsyncThunk<GlobalProductsType[], { query: string }>(
  "globalProducts/searchGlobalProducts", 
  async ({ query }) => {
    let data;
    let error;

    const trimmedQuery = query.trim(); 

    if (trimmedQuery !== "") {
      const response = await supabase
        .from("GLOBAL_PRODUCTS")
        .select("*,GLOBAL_PRODUCTS_TAG(*, TAG(*))")
        .ilike("name", `%${trimmedQuery}%`);

      data = response.data;
      error = response.error;
    } else {
      data = [];
    }

    if (error && !data) {
      toast({
        title: "Error",
        description: "Hubo un error al buscar productos globales",
        duration: 2000,
        variant: "destructive"
      });
    }

    return data as GlobalProductsType[] ?? [];
  }
);

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
    },
    setSearchGlobalProducts: (state, action) => {
      state.searchGlobalProducts = action.payload
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
    builder.addCase(onSearchGlobalProducts.pending, (state, action) => {
      state.loadingSearchGlobalProducts = true
    })
    builder.addCase(onSearchGlobalProducts.fulfilled, (state, action) => {
      state.searchGlobalProducts = action.payload
      state.loadingSearchGlobalProducts = false
    })
    builder.addCase(onSearchGlobalProducts.rejected, (state, action) => {
      state.loadingSearchGlobalProducts = false
    })
  }
})

export const { setGlobalProducts, setSearchGlobalProducts } = globalProductsSlice.actions

export default globalProductsSlice.reducer