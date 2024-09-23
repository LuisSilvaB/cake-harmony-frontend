import { createSupabaseBrowserClient } from "@/libs/supabase/browser-client"
import { toast } from "@/hooks/useToast"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { SubsidiaryType } from "@/app/dashboard/subsidiaries/store/[storeId]/types/subsidiary.type"

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
    { dispatch, getState, rejectWithValue },
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
        return rejectWithValue(null);
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
        return rejectWithValue(null);
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
        return rejectWithValue(null);
      }

      toast({
        title: "Sucursal creada",
        description: "Sucursal creada con éxito.",
        duration: 5000,
        variant: "default",
      });
      dispatch(setSelectedSubsidiary(newSubsidiary[0]));
      return newSubsidiary; 
    } catch (error) {
      console.error("Error al crear la sucursal:", error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error inesperado al crear la sucursal.",
        variant: "destructive",
      });
      return rejectWithValue(null);
    }
  }
);

export const  updateSubsidiaryFeature = createAsyncThunk(
  "subsidiary/updateSubsidiary",
  async (
    { changes, subsidiaryId }: { changes: Omit<SubsidiaryType, "id" | "created_at"> ; subsidiaryId: number },
    { dispatch, rejectWithValue, getState },
  ) => {
    try{
      const { data, error} = await supabase.from("SUBSIDIARY").select("*").ilike("name", `${changes.name}`).eq("STORE_ID", changes.STORE_ID);
      if(error){
        toast({
          title: "Error al actualizar sucursal",
          description: error.message,
          variant: "destructive",
        });
        return rejectWithValue(null);
      }

      const subsidiaryExists = data.find((subsidiary) => subsidiary.name === changes.name);

      if(subsidiaryExists && subsidiaryExists.id !== subsidiaryId){
        toast({
          title: "Error al actualizar sucursal",
          description: "Ya existe una sucursal con ese nombre registrada.",
          variant: "destructive",
        });
        return rejectWithValue(null);
      }
      const { data: newSubsidiary, error: updateError } = await supabase
        .from("SUBSIDIARY")
        .update(changes)
        .eq("id", subsidiaryId)
        .select();

      if (updateError) {
        toast({
          title: "Error al actualizar sucursal",
          description: updateError.message,
          variant: "destructive",
        });
        return rejectWithValue(null);
      }

      toast({
        title: "Sucursal actualizada",
        description: "Sucursal actualizada con éxito.",
        duration: 5000,
        variant: "default",
      });
      dispatch(setSelectedSubsidiary(newSubsidiary[0]));
      return newSubsidiary;
    } catch(error){
      toast({
        title: "Error al actualizar sucursal",
        description: "Hubo un error al actualizar la sucursal",
        variant: "destructive",
      });
      return rejectWithValue(null);
    }
  },
);



const subsidiaryFeaturesSlice = createSlice({
  name: "subsidiaryFeatures",
  initialState: {
    subsidiaries: [] as SubsidiaryType[],
    selectedSubsidiary: null as SubsidiaryType | null,
    loading: false,
    loadingCreateSubsidiary: false, 
    loadingUpdateSubsidiary: false, 
    loadingDeleteSubsidiary: false,
  },
  reducers: {
    resetSubsidiaryStates: (state) => {
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
      localStorage.setItem("subsidiaries", JSON.stringify(action.payload));
      state.subsidiaries = action.payload ?? [];
      state.loading = false;
    })
    builder.addCase(getSubsidiaries.rejected, (state, action) => {
      state.loading = false;
    })
    builder.addCase(createSubsidiaryFeature.pending, (state, action) => {
      state.loadingCreateSubsidiary = true;
    });
    builder.addCase(createSubsidiaryFeature.rejected, (state, action) => {
      state.loadingCreateSubsidiary = false;
    });
    builder.addCase(createSubsidiaryFeature.fulfilled, (state, action) => {
      if( Array.isArray(action.payload)) state.subsidiaries = [... state.subsidiaries, action.payload[0]];
      state.loadingCreateSubsidiary = false;

      // update local storage
      const subsidiaries = localStorage.getItem("subsidiaries")
      if(!subsidiaries) return;
      const subsidiariesData = JSON.parse(subsidiaries ?? '[]')
      localStorage.setItem("selectedSubsidiary", JSON.stringify(action.payload[0]));
      localStorage.setItem("subsidiaries", JSON.stringify([...subsidiariesData, action.payload[0]]));
    });

    builder.addCase(updateSubsidiaryFeature.pending, (state, action) => {
      state.loadingUpdateSubsidiary = true;
    });
    builder.addCase(updateSubsidiaryFeature.rejected, (state, action) => {
      state.loadingUpdateSubsidiary = false;
    });
    builder.addCase(updateSubsidiaryFeature.fulfilled, (state, action) => {
      state.selectedSubsidiary = action.payload[0];
      localStorage.setItem(
        "selectedSubsidiary",
        JSON.stringify(action.payload[0]),
      );
      //Upadate state
      if (Array.isArray(action.payload))
        state.subsidiaries = state.subsidiaries.map((subsidiary: any) => {
          if (subsidiary.id === action.payload[0].id) return action.payload[0];
          return subsidiary;
        });
      //Update local storage
      const subsidiaries = localStorage.getItem("subsidiaries");
      const subsidiariesData = JSON.parse(subsidiaries ?? "[]");
      if (!subsidiariesData) return;
      state.loadingUpdateSubsidiary = false;
      localStorage.setItem("subsidiaries", JSON.stringify(state.subsidiaries));
    });

  }
});

export const { resetSubsidiaryStates, setSelectedSubsidiary, setSubsidiaries } = subsidiaryFeaturesSlice.actions

export default subsidiaryFeaturesSlice.reducer