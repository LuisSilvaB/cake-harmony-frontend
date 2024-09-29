import { createSupabaseBrowserClient } from "@/libs/supabase/browser-client"
import { toast } from "@/hooks/useToast"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { TagsType } from "@/app/dashboard/tags/types/tags.type" 

const supabase = createSupabaseBrowserClient()

export const getTags = createAsyncThunk(
  "tags/getTags",
  async () => {
    const { data, error } = await supabase.from("TAG").select("*")
    if (error) {
      toast({
        title: "Error al obtener las etiquetas",
        description: error.message,
        variant: "destructive",
      })
    }
    return data as TagsType[]
  },
)

export const getAllMainTags = createAsyncThunk(
  "tags/getAllMainTags",
  async () => {
    const { data, error } = await supabase.from("TAG").select("*").is("id_main_tag", null)
    if (error) {
      toast({
        title: "Error al obtener las etiquetas",
        description: error.message,
        variant: "destructive",
      })
    }
    return data as TagsType[]
  },
)

export const createTagFeature = createAsyncThunk(
  "tags/createTag",
  async (tagToCreate: Omit<TagsType, "id" | "created_at">, { dispatch, getState, rejectWithValue }) => {
    try {
      const { data: sameTag, error: sameTagError } = await supabase
        .from("TAG")
        .select("id")
        .ilike("name", `%${tagToCreate.name}%`);
      if (sameTagError) {
        toast({
          title: "Error al obtener las etiquetas",
          description: sameTagError.message,
          variant: "destructive",
        });
        return rejectWithValue(null);
      }

      console.log("sameTag", sameTag);

      const { data, error } = await supabase
        .from("TAG")
        .insert(tagToCreate)
        .select();
      if (error && !data) {
        toast({
          title: "Error al crear etiqueta",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Etiqueta creada",
        description: "Etiqueta creada con éxito",
        duration: 5000,
        variant: "default",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error al crear etiqueta",
        description: "Hubo un error al crear la etiqueta",
        variant: "destructive",
      });
    }
  },
);

const tagsSlice = createSlice({
  name: "tags",
  initialState: {
    tags: [] as TagsType[],
    mainTags: [] as TagsType[],
    loading: false,
    loadingMainTags: false,
    loadingCreateTag: false,
    loadingUpdateTag: false,
    loadingDeleteTag: false,
  },
  reducers: {
    resetStates: (state) => {
      state.tags = []
      state.loading = false
      state.mainTags = []
      
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTags.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(getTags.fulfilled, (state, action) => {
      state.tags = action.payload || []
      state.loading = false
    })
    builder.addCase(getTags.rejected, (state, action) => {
      state.loading = false
    })
    builder.addCase(createTagFeature.pending, (state, action) => {
      state.loadingCreateTag = true
    })
    builder.addCase(createTagFeature.fulfilled, (state, action) => {
      if( Array.isArray(action.payload)) state.tags.push(action.payload[0]);

      state.loadingCreateTag = false
    })
    builder.addCase(createTagFeature.rejected, (state, action) => {
      state.loadingCreateTag = false
    })
    builder.addCase(getAllMainTags.pending, (state, action) => {
      state.loadingMainTags = true
    })
    builder.addCase(getAllMainTags.fulfilled, (state, action) => {
      state.mainTags = action.payload || []
      state.loadingMainTags = false
    })
    builder.addCase(getAllMainTags.rejected, (state, action) => {
      state.loadingMainTags = false
    })
  },
})

export const { resetStates } = tagsSlice.actions

export default tagsSlice.reducer  