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
