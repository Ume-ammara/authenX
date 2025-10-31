import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "@/api/axiosClient";

export const userLogin = createAsyncThunk(
  "auth/userLogin",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/auth/login", formData);
      console.log(" Login successful:", res.data?.data);
      return res.data?.data || res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    console.log("Thunk called ", formData);
    try {
      const res = await axiosClient.post("/auth/register", formData);
      console.log(" Successfully registered:", res.data?.data);
      return res.data?.data || res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      return rejectWithValue(message);
    }
  }
);

export const verifyUser = createAsyncThunk(
  "auth/verify",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/auth/verify/${token}`);
      console.log("verify email user", res.data?.data?.messages);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Email verification failed"
      );
    }
  }
);

export const fetchUser = createAsyncThunk(
  "admin/profile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/admin/profile");
      console.log("User profile fetched successfully", res.data?.data?.user);
      return res.data?.data?.user;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch user. Please try again.";
      return rejectWithValue(message);
    }
  }
);

export const updateAvatar = createAsyncThunk(
  "admin/profile/avatar",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await axiosClient.post("/admin/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(" Avatar upload success:", res.data);
      return res.data.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Avatar upload failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.delete("/auth/logout");
      return res.data?.data?.message;
    } catch (error) {
      const message = error.response?.data?.message || "Logout failed";
      return rejectWithValue(message);
    }
  }
);
