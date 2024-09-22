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
    { subsidiaryToCreate }: { subsidiaryToCreate: Omit<SubsidiaryType, "id" | "created_at"> },
    { dispatch, getState },
  ) => {
    try {
      let subsidiaryExists = false;
      const { data: subsidiaryData, error: fetchError } = await supabase
        .from("SUBSIDIARY")
        .select("*")
        .eq("STORE_ID", subsidiaryToCreate.STORE_ID);

      if (fetchError) {
        toast({
          title: "Error al verificar sucursales",
          description: fetchError.message,
          variant: "destructive",
        });
        return null;
      }

      if (subsidiaryData.length) {
        subsidiaryExists = subsidiaryData.some(
          (subsidiary) => subsidiary.name === subsidiaryToCreate.name
        );
      }


      if (subsidiaryExists) {
        toast({
          title: "Error al crear sucursal",
          description: "Ya existe una sucursal con ese nombre registrada.",
          variant: "destructive",
        });
        return null;
      }
      const { data: newSubsidiary, error: insertError } = await supabase
        .from("SUBSIDIARY")
        .insert(subsidiaryToCreate)
        .select();

      if (insertError) {
        toast({
          title: "Error al crear sucursal",
          description: insertError.message,
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Sucursal creada",
        description: "Sucursal creada con éxito.",
        duration: 5000,
        variant: "default",
      });

      return newSubsidiary; 
    } catch (error) {
      console.error("Error al crear la sucursal:", error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error inesperado al crear la sucursal.",
        variant: "destructive",
      });
      return null;
    }
  }
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
    setSubsidiaries: (state, action) => {
      state.subsidiaries = action.payload;
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

export const { resetStates, setSelectedSubsidiary, setSubsidiaries } = subsidiaryFeaturesSlice.actions

export default subsidiaryFeaturesSlice.reducer