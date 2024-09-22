import { createSupabaseBrowserClient } from "@/libs/supabase/browser-client"
import { toast } from "@/hooks/useToast"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { StoreType } from "../types/store.type"

const supabase = createSupabaseBrowserClient()

export const createStoreFeature = createAsyncThunk(
  "store/createStore",
  async (
    { storeToCreate, userId }: { storeToCreate: Omit<StoreType, "id" | "created_at"> ; userId: string },
    { dispatch, getState },
  ) => {
    try {
      const { data:dataStore, error:errorStore } = await supabase
      .from("USER_STORE")
      .select("STORE(*)")
      .eq("USER_ID", userId);

      if(!dataStore) return null

      const storeExists = dataStore.find(
        (store: { STORE: any }) => store.STORE.name === storeToCreate.name,
      );

      if(storeExists) {
        toast({
          title: "Ocurrio un error al crear la tienda",
          description: "Ya existe una tienda con ese nombre registrada",
          variant: "destructive",
        });
        return null;
      }
      const { data, error } = await supabase.from("STORE").insert(storeToCreate).select();
      if (error && !data) {
        toast({
          title: "Error al crear tienda",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      dispatch(createUserStoreFeature({ storeId: data[0].id, userId }));
      toast({
        title: "Tienda creada",
        description: "Tienda creada con éxito",
        duration: 5000,
        variant: "default",
      })
      return data;
    } catch (error) {
      toast({
        title: "Error al crear tienda",
        description: "Hubo un error al crear la tienda",
        variant: "destructive",
      });
    }
  },
);

export const createUserStoreFeature = createAsyncThunk(
  "store/createUserStore",
  async (
    { storeId, userId }: { storeId: number; userId: string },
    { dispatch },
  ) => {
    try {
      const { data, error } = await supabase.from("USER_STORE").insert({
        USER_ID: userId,
        STORE_ID: storeId,
      });
      if (error) {
        toast({
          title: "Error al crear tienda",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
    } catch (error) {
      toast({
        title: "Error al crear tienda",
        description: "Hubo un error al crear la tienda",
        variant: "destructive",
      });
    }
  },
);

export const updateStoreFeature = createAsyncThunk(
  "store/updateStore",
  async (
    { changes, storeId, userId }: { changes: Omit<StoreType, "id" | "created_at"> ; storeId: number; userId: string },
    { dispatch, getState },
  ) => {
    try {
      const { data:dataStore, error:errorStore } = await supabase
      .from("USER_STORE")
      .select("STORE(*)")
      .eq("USER_ID", userId);

      if(!dataStore) return null

      const storeExists: { STORE: any } | undefined = dataStore.find(
        (store: { STORE: any }) => store.STORE.name === changes.name,
      );

      if (storeExists && storeExists.STORE.id !== storeId) {
        toast({
          title: "Ocurrio un error al crear la tienda",
          description: "Ya existe una tienda con ese nombre registrada",
          variant: "destructive",
        });
        return null;
      }
      const { data, error } = await supabase.from("STORE").update(changes).eq("id", storeId).select();

      if (error && !data) {
        toast({
          title: "Error al crear tienda",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Tienda actualizada",
        description: "Tienda actualizada con éxito",
        duration: 5000,
        variant: "default",
      })
      return data;
    } catch (error) {
      toast({
        title: "Error al crear tienda",
        description: "Hubo un error al crear la tienda",
        variant: "destructive",
      });
    }
  },
);

export const getStoresFeature = createAsyncThunk(
  "store/getStore",
  async (
    { userId }: { userId: string },
    { dispatch },
  ) => {
    try {
      // Realizar la consulta filtrando por el userId en la relación USER_STORE
      const { data, error } = await supabase
        .from("USER_STORE")
        .select("STORE(*)")
        .eq("USER_ID", userId);

      if (error) {
        toast({
          title: "No se encontraron tiendas",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Extraer las tiendas del resultado
      const stores = data.map((userStore: any) => userStore.STORE);

      return stores;
    } catch (error) {
      toast({
        title: "Error al obtener tiendas",
        description: "Hubo un error al obtener las tiendas",
        variant: "destructive",
      });
    }
  }
);


const storeFeaturesSlice = createSlice({
  name: "storeFeatures",
  initialState: {
    stores: [] as StoreType[],
    loading: false,
    selectedStore: null as StoreType | null,
    loadingCreateStore: false,
    loadingUpdateStore: false,
  },
  reducers: {
    resetStates: (state) => {
      state.stores = [];
      state.loading = false;
      state.selectedStore = null;
    },
    setSelectedStore: (state, action) => {
      state.selectedStore = action.payload;
    },
    setStores: (state, action) => {
      state.stores = action.payload;
    },
  },
  extraReducers: (builder: any) => {
    builder.addCase(createStoreFeature.pending, (state: any) => {
      state.loadingCreateStore = true;
    });
    builder.addCase(createStoreFeature.rejected, (state: any) => {
      state.loadingCreateStore = false;
    });
    builder.addCase(createStoreFeature.fulfilled, (state: any, action: any) => {
      // create sore
      if( Array.isArray(action.payload)) state.stores = state.stores.push(action.payload[0]);
      state.loadingCreateStore = false;

      // update local storage
      const stores = localStorage.getItem("stores")
      if(!stores) return;
      const storesData = JSON.parse(stores ?? '[]')
      localStorage.setItem("stores", JSON.stringify([...storesData, action.payload[0]]));
    });
    builder.addCase(updateStoreFeature.pending, (state: any) => {
      state.loadingUpdateStore = true;
    });
    builder.addCase(updateStoreFeature.rejected, (state: any) => {
      state.loadingUpdateStore = false;
    });
    builder.addCase(updateStoreFeature.fulfilled, (state: any, action: any) => {
      
      //Upadate state 
      if( Array.isArray(action.payload)) state.stores = state.stores.map((store: any) => {
        if (store.id === action.payload[0].id) return action.payload[0];
        return store;
      });

      //Update local storage

      const stores = localStorage.getItem("stores")
      const storesData = JSON.parse(stores ?? '[]')
      if(!storesData) return;
      state.loadingUpdateStore = false;
      const newStores = storesData.map((store: any) => {
        if (store.id === action.payload[0].id) return action.payload[0];
        return store;
      });
      localStorage.setItem("stores", JSON.stringify(newStores));
    });
    
    builder.addCase(getStoresFeature.pending, (state: any) => {
      state.loading = true;
    });
    builder.addCase(getStoresFeature.rejected, (state: any) => {
      state.loading = false;
    });
    builder.addCase(getStoresFeature.fulfilled, (state: any, action: any) => {
      localStorage.setItem("stores", JSON.stringify(action.payload));
      state.stores = action.payload;
      state.loading = false;
    });
  },
});

export const { setSelectedStore, resetStates, setStores } = storeFeaturesSlice.actions

export default storeFeaturesSlice.reducer