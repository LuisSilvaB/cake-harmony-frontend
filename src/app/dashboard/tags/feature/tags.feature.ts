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

export const createTag = createAsyncThunk(
  "tags/createTag",
  async (tagToCreate: TagsType, { dispatch, getState }) => {
    try {
      const { data, error } = await supabase.from("TAG").insert(tagToCreate).select()
      if (error && !data) {
        toast({
          title: "Error al crear etiqueta",
          description: error.message,
          variant: "destructive",
        })
        return
      }
      toast({
        title: "Etiqueta creada",
        description: "Etiqueta creada con éxito",
        duration: 5000,
        variant: "default",
      })
      return data

    } catch (error) {
      toast({
        title: "Error al crear etiqueta",
        description: "Hubo un error al crear la etiqueta",
        variant: "destructive",
      })
    }
  },
)

const tagsSlice = createSlice({
  name: "tags",
  initialState: {
    tags: [] as TagsType[],
    loading: false,
    mainTags: [] as TagsType[],
    loadingMainTags: false,
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
    builder.addCase(createTag.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(createTag.fulfilled, (state, action) => {
      if( Array.isArray(action.payload)) state.tags.push(action.payload[0]);

      state.loading = false
    })
    builder.addCase(createTag.rejected, (state, action) => {
      state.loading = false
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