import { createSupabaseBrowserClient } from "@/libs/supabase/browser-client"
import { toast } from "@/hooks/useToast"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { SubsidiaryType } from "@/app/dashboard/subsidiary/types/subsidiary.type"

const supabase = createSupabaseBrowserClient()

export const getSubsidiaries = createAsyncThunk(
  "subsidiary/getSubsidiaries",
  async ({storeId}: { storeId: number }) => {
    try {
      const { data, error } = await supabase
        .from("SUBSIDIARY")
        .select("*")
        .eq("STORE_ID", storeId);
      if (error && !data) {
        toast({
          title: "Error al obtener las sucursales",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      return data;
    } catch (error) {
      toast({
        title: "Error al obtener las sucursales",
        description: "Hubo un error al obtener las sucursales",
        variant: "destructive",
      });
      return;
    }  
  },
);

export const createSubsidiaryFeature = createAsyncThunk(
  "subsidiary/createSubsidiary",
  async (
    { subsidiaryToCreate }: { subsidiaryToCreate: Omit<SubsidiaryType, "id" | "created_at">  },
    { dispatch, getState },
  ) => {
    try {
      const { data:subsidiaryData, error:errorStore } = await supabase.from("SUBSIDIARY").select("*").eq("STORE_ID", subsidiaryToCreate.STORE_ID);

      if(!subsidiaryData) return null

      const subsidiaryExists = subsidiaryData.find(
        (subsidiary: { SUBSIDIARY: any }) => subsidiary.SUBSIDIARY.name === subsidiaryToCreate.name,
      );

      if(subsidiaryExists) {
        toast({
          title: "Ocurrio un error al crear la sucursal",
          description: "Ya existe una sucursal con ese nombre registrada",
          variant: "destructive",
        });
        return null;
      }
      const { data, error } = await supabase.from("SUBSIDIARY").insert(subsidiaryToCreate).select();
      if (error && !data) {
        toast({
          title: "Error al crear sucursal",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Sucursal creada",
        description: "Sucursal creada con éxito",
        duration: 5000,
        variant: "default",
      })
      return data; 
    }
    catch (error) {
      toast({
        title: "Error al crear sucursal",
        description: "Hubo un error al crear la sucursal",
        variant: "destructive",
      });
    }
  },
);



const subsidiaryFeaturesSlice = createSlice({
  name: "subsidiaryFeatures",
  initialState: {
    subsidiaries: [] as SubsidiaryType[],
    selectedSubsidiary: null as SubsidiaryType | null,
    loading: false,
  },
  reducers: {
    resetStates: (state) => {
      state.subsidiaries = [];
      state.loading = false;
      state.selectedSubsidiary = null;  
    },
    setSelectedSubsidiary: (state, action) => {
      state.selectedSubsidiary = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSubsidiaries.pending, (state, action) => {
      state.loading = true;
    })
    builder.addCase(getSubsidiaries.fulfilled, (state, action) => {
      state.subsidiaries = action.payload || [];
      state.loading = false;
    })
    builder.addCase(getSubsidiaries.rejected, (state, action) => {
      state.loading = false;
    })
    builder.addCase(createSubsidiaryFeature.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createSubsidiaryFeature.fulfilled, (state, action) => {
      if( Array.isArray(action.payload)) state.subsidiaries.push(action.payload[0]  );
      state.loading = false;
    })
    builder.addCase(createSubsidiaryFeature.rejected, (state, action) => {
      state.loading = false;
    })
  }
});

export const { resetStates, setSelectedSubsidiary } = subsidiaryFeaturesSlice.actions

export default subsidiaryFeaturesSlice.reducer