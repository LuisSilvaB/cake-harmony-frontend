import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { createSupabaseBrowserClient } from '@/libs/supabase/browser-client'
import { toast } from '@/hooks/useToast'
import { ProductType } from '../types/product.type'

const supabase = createSupabaseBrowserClient()

export const getAllProductsByStoreId = createAsyncThunk(
  "products/getAllProductsByStoreId", 
  async ({ storeId }: { storeId: number }) => {
    const { data, error } = await supabase
      .from("PRODUCT")
      .select("*,PRODUCT_TAG(*, TAG(*))")
      .eq("STORE_ID", storeId);
    if (error && !data) {
      toast({
        title: "Error",
        description: "Hubo un error al obtener los productos globales",
        duration: 2000,
        variant: "destructive"
      })
    }
    return data as ProductType[] ?? []
  }
)

export const createProduct = createAsyncThunk(
  "products/createProduct", 
  async ({ name, price, description, imageUrl, storeId }: { name: string, price: number, description: string, imageUrl: string[], storeId: number }) => {
    const { data, error } = await supabase
      .from("PRODUCT")
      .insert([
        {
          name: name,
          price: price,
          description: description,
          imageUrl: imageUrl,
          STORE_ID: storeId,
          created_at: new Date(),
          brand: "",
          stock: 0,
          unit: "",
          state: false,
        }
      ]);
    if (error && !data) {
      toast({
        title: "Error",
        description: "Hubo un error al crear el producto",
        duration: 2000,
        variant: "destructive"
      })
    }
    return data
  }
)

const productsSlice = createSlice({
  name: "products", 
  initialState:{
    products: [] as ProductType[],
    loadingProducts: false as boolean,
  }, 
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload
    }
  }, 
  extraReducers: (builder) => {
    builder.addCase(getAllProductsByStoreId.pending, (state, action) => {
      state.loadingProducts = true
    })
    builder.addCase(getAllProductsByStoreId.fulfilled, (state, action) => {
      state.products = action.payload
      state.loadingProducts = false
    })
    builder.addCase(getAllProductsByStoreId.rejected, (state, action) => {
      state.loadingProducts = false
    })  
  }
})

export const { setProducts } = productsSlice.actions

export default productsSlice.reducer  