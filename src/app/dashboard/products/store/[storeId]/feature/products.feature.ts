import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { createSupabaseBrowserClient } from '@/libs/supabase/browser-client'
import { toast } from '@/hooks/useToast'
import { debounce } from 'lodash';
import { productsType } from '../types/products.type'

const supabase = createSupabaseBrowserClient()

export const getAllProducts = createAsyncThunk(
  "products/getAllProductsProducts", 
  async () => {
    const { data, error } = await supabase.from("PRODUCT").select(
      `
        *,
        PRODUCTS_TAG(*, TAG(*)),
        PRODUCT_VARIANTS(*)
      `,
      //PRODUCT STORE -> LA RALACION CON PRODUCT STORE
      //EN LAS VARIANTES TRAER LA RELACIÓN CON LA SUCURSAL
    );
    if (error && !data) {
      toast({
        title: "Error",
        description: "Hubo un error al obtener los productos Productses",
        duration: 2000,
        variant: "destructive"
      })
    }
    return data as productsType[] ?? []
  }
)

export const getProductBySubsidiaryId = createAsyncThunk(
  "products/getProductBySubsidiaryIdProducts",
  async ({
    subsidiaryId,
    productId,
  }: {
    subsidiaryId: number;
    productId: string;
  }) => {
    const { data: ProductsData, error: ProductError } = await supabase.from("PRODUCT").select(
      `
        *,
        PRODUCTS_TAG(*, TAG(*)),
        PRODUCT_VARIANTS(*)
      `,
    );
    const { data, error } = await supabase
      .from("PRODUCT")
      .select(
        `
        *,
        PRODUCTS_TAG(*, TAG(*)),
        PRODUCT_VARIANTS(*), 
        SUBSIDIARY_PRODUCT_VARIANTS(*)
      `,
      )
      .eq("id", productId)
      .eq("PRODUCT.SUBSIDIARY_PRODUCT_VARIANTS.SUBSIDIARY_ID", subsidiaryId)
      .single(); 
      
    // if (error && !data) {
    //   const { data, error } = await  
    //   // toast({
    //   //   title: "Error",
    //   //   description: "Hubo un error al obtener los productos",
    //   //   duration: 2000,
    //   //   variant: "destructive",
    //   // });
    // }

    return (data as any[]) ?? [];
  },
);

export const onSearchProducts = createAsyncThunk<productsType[], { query: string }>(
  "products/searchProductsProducts", 
  async ({ query }) => {
    let data;
    let error;

    const trimmedQuery = query.trim(); 

    if (trimmedQuery !== "") {
      const response = await supabase
        .from("PRODUCT")
        .select("*,PRODUCTS_TAG(*, TAG(*))")
        .ilike("name", `%${trimmedQuery}%`);

      data = response.data;
      error = response.error;
    } else {
      data = [];
    }

    if (error && !data) {
      toast({
        title: "Error",
        description: "Hubo un error al buscar productos Productses",
        duration: 2000,
        variant: "destructive"
      });
    }

    return data as productsType[] ?? [];
  }
);

const productsSlice = createSlice({
  name: "ProductsProducts", 
  initialState:{
    products: [] as productsType[],
    loadingProducts: false as boolean,
    searchProducts: [] as productsType[],
    loadingSearchProducts: false as boolean,
    loadingProduct: false as boolean,
    selectedProduct: null as productsType | null, 
  }, 
  reducers: {
    setProductsProducts: (state, action) => {
      state.products = action.payload
    },
    setSearchProductsProducts: (state, action) => {
      state.searchProducts = action.payload
    }
  }, 
  extraReducers: (builder) => {
    builder.addCase(getAllProducts.pending, (state, action) => {
      state.loadingProducts = true
    })
    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      state.products = action.payload
      state.loadingProducts = false
    })
    builder.addCase(getAllProducts.rejected, (state, action) => {
      state.loadingProducts = false
    })  
    builder.addCase(onSearchProducts.pending, (state, action) => {
      state.loadingSearchProducts = true
    })
    builder.addCase(onSearchProducts.fulfilled, (state, action) => {
      state.searchProducts = action.payload
      state.loadingSearchProducts = false
    })
    builder.addCase(onSearchProducts.rejected, (state, action) => {
      state.loadingSearchProducts = false
    })
    builder.addCase(getProductBySubsidiaryId.pending, (state, action) => {
      state.loadingProduct = true
    })
    builder.addCase(getProductBySubsidiaryId.fulfilled, (state, action) => {
      console.log(action.payload)
      state.selectedProduct = action.payload[0]
      state.loadingProduct = false
    })
    builder.addCase(getProductBySubsidiaryId.rejected, (state, action) => {
      state.loadingProduct = false
    })
  }
})

export const { setProductsProducts, setSearchProductsProducts } = productsSlice.actions

export default productsSlice.reducer