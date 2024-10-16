import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSupabaseBrowserClient } from "@/libs/supabase/browser-client";
import { toast } from "@/hooks/useToast";
import { debounce } from "lodash";
import { productsType } from "../types/products.type";
import { ProductSchemaType } from "../schema/product.schema";
import { uploadFile } from "@/libs/supabase/s3";

const supabase = createSupabaseBrowserClient();

export const getAllProductsByStoreId = createAsyncThunk(
  "products/getAllProductsByStoreIdProducts",
  async ({ storeId }: { storeId: number }) => {
    const { data, error } = await supabase
      .from("PRODUCTS_STORE")
      .select("PRODUCT(*, PRODUCTS_TAGS(TAG(*)),PRODUCT_VARIANTS(*))")
      .eq("STORE_ID", storeId);

    if (error && !data) {
      toast({
        title: "Error",
        description: "Hubo un error al obtener los productos Productses",
        duration: 2000,
        variant: "destructive",
      });
    }
    return (data as any[]) ?? [];
  },
);

export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async () => {
    const { data, error } = await supabase.from("PRODUCT").select(
      `
        *,
        PRODUCTS_TAGS(*, TAG(*)),
        VARIANTS(*)
      `,
      //PRODUCT STORE -> LA RALACION CON PRODUCT STORE
      //EN LAS VARIANTES TRAER LA RELACIÓN CON LA SUCURSAL
    );
    if (error && !data) {
      toast({
        title: "Error",
        description: "Hubo un error al obtener los productos Productses",
        duration: 2000,
        variant: "destructive",
      });
    }
    return (data as productsType[]) ?? [];
  },
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (
    { data, stroeId }: { data: Omit<ProductSchemaType, "id">; stroeId: number },
    { dispatch, getState, rejectWithValue },
  ) => {
    if(!data.images_files?.length) return rejectWithValue(null)

    // ? Register basic data to products

    const { data:ProductData, error:ProductError } = await supabase.from("PRODUCT").insert({
      name: data.name, 
      description: data.description,
      brand: data.brand,   
    }).select()

    if(ProductError || !ProductData) {
      toast({title:"Error al crear productos", description:"Los datos del producto no fueron registrados", variant:"destructive"})
      return rejectWithValue(null)
    }

    // ? Register products_store

    const { data:StoreProductData, error:StoreProductError } = await supabase.from("PRODUCTS_STORE").insert({
      PRODUCT_ID: ProductData[0].id,
      STORE_ID: stroeId
    }).select()

    if(StoreProductError || !StoreProductData) {
      toast({title:"Error al crear productos", description:"Los datos del producto no fueron registrados", variant:"destructive"})
      return rejectWithValue(null)
    }


    // ? Register products tags 
    await Promise.all(data.MAIN_TAG.map( async (tag: any)=>{
      const { data: ProductTagsData, error: ProductTagsError } = await supabase.from("PRODUCTS_TAGS").insert({
        PRODUCT_ID: ProductData[0].id,
        TAG_ID: tag.id,
        type: "CATEGORY"
      })  
    }))

    // ? Register products variants
    await Promise.all(data.VARIANTS.map( async (variant: any)=>{
      const { data: ProductVariantsData, error: ProductVariantsError } = await supabase.from("PRODUCT_VARIANTS").insert({
        PRODUCT_ID: ProductData[0].id,
        presentation: variant.presentation,
      })  
    }))

    // ? Register products files
    await Promise.all(data.images_files.map( async (file: any)=>{
      const { data: ProductFilesData, error: ProductFilesError } = await supabase.from("PRODUCT_FILES").insert({
        PRODUCT_ID: ProductData[0].id,
        path: file.path,
        file_name: file.name,
      })  

      uploadFile(file, `/stores/${stroeId}/products` )

    }))

  }
);

export const getProductBySubsidiaryId = createAsyncThunk(
  "products/getProductBySubsidiaryId",
  async ({
    subsidiaryId,
    productId,
  }: {
    subsidiaryId: number;
    productId: string;
  }) => {
    const { data: ProductsData, error: ProductError } = await supabase
      .from("PRODUCT")
      .select(
        `
        *,
        PRODUCTS_TAGS(*, TAG(*)),
        PRODUCT_VARIANTS(*)
      `,
      );
    const { data, error } = await supabase
      .from("PRODUCT")
      .select(
        `
        *,
        PRODUCTS_TAGS(*, TAG(*)),
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

export const onSearchProducts = createAsyncThunk<
  productsType[],
  { query: string }
>("products/searchProductsProducts", async ({ query }) => {
  let data;
  let error;

  const trimmedQuery = query.trim();

  if (trimmedQuery !== "") {
    const response = await supabase
      .from("PRODUCT")
      .select("*,PRODUCTS_TAGS(*, TAG(*))")
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
      variant: "destructive",
    });
  }

  return (data as productsType[]) ?? [];
});

const productsSlice = createSlice({
  name: "ProductsProducts",
  initialState: {
    products: [] as productsType[],
    loadingProducts: false as boolean,
    searchProducts: [] as productsType[],
    loadingSearchProducts: false as boolean,
    loadingProduct: false as boolean,
    selectedProduct: null as productsType | null,
    loadingCreateProduct: false as boolean,
  },
  reducers: {
    setProductsProducts: (state, action) => {
      state.products = action.payload;
    },
    setSearchProductsProducts: (state, action) => {
      state.searchProducts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllProductsByStoreId.pending, (state, action) => {
      state.loadingProducts = true;
    });
    builder.addCase(getAllProductsByStoreId.fulfilled, (state, action) => {
      const formatedData = action.payload?.map((product: any) => {
        const productTags =
          product.PRODUCT.PRODUCTS_TAGS?.map((tag: any) => tag.TAG) || [];
        const productVariants =
          product.PRODUCT.PRODUCT_VARIANTS?.map((variant: any) => variant) ||
          [];
        return {
          ...product.PRODUCT,
          PRODUCTS_TAGS: productTags,
          PRODUCT_VARIANTS: productVariants,
        };
      });
      state.products = formatedData;
      state.loadingProducts = false;
    });
    builder.addCase(getAllProductsByStoreId.rejected, (state, action) => {
      state.loadingProducts = false;
    });
    builder.addCase(onSearchProducts.pending, (state, action) => {
      state.loadingSearchProducts = true;
    });
    builder.addCase(onSearchProducts.fulfilled, (state, action) => {
      state.searchProducts = action.payload;
      state.loadingSearchProducts = false;
    });
    builder.addCase(onSearchProducts.rejected, (state, action) => {
      state.loadingSearchProducts = false;
    });
    builder.addCase(getProductBySubsidiaryId.pending, (state, action) => {
      state.loadingProduct = true;
    });
    builder.addCase(getProductBySubsidiaryId.fulfilled, (state, action) => {
      console.log(action.payload);
      state.selectedProduct = action.payload[0];
      state.loadingProduct = false;
    });
    builder.addCase(getProductBySubsidiaryId.rejected, (state, action) => {
      state.loadingProduct = false;
    });
    builder.addCase(createProduct.pending, (state, action) => {
      state.loadingCreateProduct = true;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.loadingCreateProduct = false;
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loadingCreateProduct = false;
    });
  },
});

export const { setProductsProducts, setSearchProductsProducts } =
  productsSlice.actions;

export default productsSlice.reducer;
