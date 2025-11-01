import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "@/api/axiosClient";

export const fetchUserById = createAsyncThunk(
  "admin/fetchUserById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/admin/user/${id}`);
      console.log("User fetched by Id", res.data?.data?.user);
      return res.data?.data;
    } catch (error) {}
  }
);

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/admin/users");
      console.log("Fetched all users", res.data?.data?.user);
      return res.data?.data?.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);
