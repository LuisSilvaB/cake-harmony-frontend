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
      console.log(tagToCreate)

      if(sameTag.length){
        toast({
          title: "Error al crear etiqueta",
          description: "Ya existe una etiqueta con ese nombre creada",
          variant: "destructive",
        });
        return rejectWithValue(null);
      }

      const { data, error } = await supabase
        .from("TAG")
        .insert({
          ...tagToCreate,
          id_main_tag: !!tagToCreate.id_main_tag
            ? tagToCreate.id_main_tag
            : null,
        })
        .select();

      if (error && !data) {

        toast({
          title: "Error al crear etiqueta",
          description: error.message,
          variant: "destructive",
        });

        return rejectWithValue(null);
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

export const updateTagFeature = createAsyncThunk(
  "tags/updateTag",
  async (
    { tagToUpdate, tagId }: { tagToUpdate: Omit<TagsType, "id" | "created_at"> ; tagId: number },
    { dispatch, getState, rejectWithValue },
  ) => {
    try {
      const { data: sameTag, error: sameTagError } = await supabase
        .from("TAG")
        .select("*")
        .ilike("name", `%${tagToUpdate.name}%`);
      if (sameTagError) {
        toast({
          title: "Error al obtener las etiquetas",
          description: sameTagError.message,
          variant: "destructive",
        });
        return rejectWithValue(null);
      }

      if (sameTag.length && sameTag[0].id !== tagId) {
        toast({
          title: "Error al actualizar etiqueta",
          description: "Ya existe una etiqueta con ese nombre creada",
          variant: "destructive",
        });
        return rejectWithValue(null);
      }


      const { data, error } = await supabase
        .from("TAG")
        .update({
          name: tagToUpdate.name,
          color: tagToUpdate.color,
          id_main_tag: tagToUpdate.id_main_tag
            ? tagToUpdate.id_main_tag
            : null,
        })
        .eq("id", tagId)
        .select();
        console.log(data)
      if (error && !data) {
        toast({
          title: "Error al actualizar etiqueta",
          description: error.message,
          variant: "destructive",
        });
        return rejectWithValue(null);
      }
      toast({
        title: "Etiqueta actualizada",
        description: "Etiqueta actualizada con éxito",
        duration: 5000,
        variant: "default",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error al actualizar etiqueta",
        description: "Hubo un error al actualizar la etiqueta",
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
    // Create Tag //
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

    // Update Tag //
    builder.addCase(updateTagFeature.pending, (state, action) => {
      state.loadingUpdateTag = true
    })
    builder.addCase(updateTagFeature.fulfilled, (state, action: any) => {
      console.log(action.payload)
      if (Array.isArray(action.payload) && action.payload.length){
        state.tags.map((tag: any) => {
          if (action.payload[0]?.id === tag.id) return action.payload[0];
          return tag;
        });
      }

      state.loadingUpdateTag = false;
    });
    builder.addCase(updateTagFeature.rejected, (state, action) => {
      state.loadingUpdateTag = false
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