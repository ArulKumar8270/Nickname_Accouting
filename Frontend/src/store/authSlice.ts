import { createSlice } from "@reduxjs/toolkit";

type Role = "admin" | "user" | null;

interface AuthState {
  isLoggedIn: boolean;
  username: string;
  role: Role;
}

const initialState: AuthState = {
  isLoggedIn: false,
  username: "",
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.username = action.payload.username;
      state.role = action.payload.role;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.username = "";
      state.role = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;