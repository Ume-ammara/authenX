import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "@/api/axiosClient";

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
