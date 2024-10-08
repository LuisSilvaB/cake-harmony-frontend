'use client'
import { toast } from "@/hooks/useToast"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserType } from "../types/user.type"
import { createSupabaseBrowserClient } from "@/libs/supabase/browser-client"
import { PermissionType } from "../types/permissions.type";
import Cookies from "js-cookie"

const supabase = createSupabaseBrowserClient(); 


export const getUserByIdFeature = createAsyncThunk(
  "user/getUserById",
  async (id: string, { dispatch, getState }) => {
      const user = await supabase.from("USER").select("*").eq("id", id).single(); 
      if (!user) return null;
      await dispatch(getPermissionsByUserIdFeature(id));
      return user.data;
  }
);


export const getPermissionsByUserIdFeature = createAsyncThunk(
  "user/getUserPermissionsByUserId",
  async (id: string, { dispatch, getState }) => {
    const { data: userData, error: userError } = await supabase
      .from("USER")
      .select("ROL_ID")
      .eq("id", id)
      .single();

    if (userError) {
      toast({
        title: "Error al obtener el rol del usuario",
        description: userError.message,
        variant: "destructive",
      });
      return null;
    }

    const rolId = userData?.ROL_ID;

    if (!rolId) {
      toast({
        title: "Error",
        description: "El usuario no tiene un rol asignado",
        variant: "destructive",
      });
      return null;
    }

    const { data: permissionsData, error: permissionsError } = await supabase
      .from("ROL")
      .select(`
        id,
        name,
        description,
        icon,
        ROL_PERMISSION (
          PERMISSION (*)
        )
      `)
      .eq("id", rolId)
      .single();

    if (permissionsError) {
      toast({
        title: "Error al obtener los permisos del rol",
        description: permissionsError.message,
        variant: "destructive",
      });
      return null;
    }

    const permissions: PermissionType[] = permissionsData?.ROL_PERMISSION?.flatMap(rp => rp.PERMISSION) || [];
    localStorage.setItem("permissions", JSON.stringify(permissions));
    Cookies.set("permissions", permissions.toString());
    return {
      rol: {
        id: permissionsData.id,
        name: permissionsData.name,
        description: permissionsData.description,
        icon: permissionsData.icon,
      },
      permissions: permissions as PermissionType[]
    };
  }
);

const userFeaturesSlice = createSlice({
  name: "userFeatures",
  initialState: {
    user: null as UserType | null,
    isLoadingUser: false as boolean,
    permissions: [] as PermissionType[],
    isLoadingPermissions: false as boolean,
  },
  reducers: {
    setPermissions: (state, action: any) => {
      state.permissions = action.payload;
    }, 
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUserByIdFeature.pending, (state, action) => {
      state.isLoadingUser = true;
    })
    builder.addCase(getUserByIdFeature.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoadingUser = false;
    })
    builder.addCase(getUserByIdFeature.rejected, (state, action) => {
      state.isLoadingUser = false;
    })
    builder.addCase(getPermissionsByUserIdFeature.pending, (state, action) => {
      state.isLoadingPermissions = true;
    })
    builder.addCase(getPermissionsByUserIdFeature.fulfilled, (state, action) => {
      state.permissions = action.payload?.permissions || [];
      state.isLoadingPermissions = false;
    })
    builder.addCase(getPermissionsByUserIdFeature.rejected, (state, action) => {
      state.isLoadingPermissions = false;
    })
  }
});

export const { setPermissions, setUser } = userFeaturesSlice.actions;

export default userFeaturesSlice.reducer;


