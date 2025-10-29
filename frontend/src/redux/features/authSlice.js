import { createSlice } from "@reduxjs/toolkit";
import { registerUser, userLogin, verifyUser, fetchUser } from "./authThunks";

const initialState = {
  user: null,
  isAuthenticated: null,
  isLoading: false,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      ((state.user = null),
        (state.isAuthenticated = false),
        (state.error = null));
    },
  },
  extraReducers: (builder) => {
    // --- Login cases ---

    builder
      .addCase(userLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(userLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(userLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // --- Register cases ---

    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // --- Verify cases ---

    builder
      .addCase(verifyUser.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(verifyUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // fetch user

    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
