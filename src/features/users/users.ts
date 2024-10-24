import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

interface UserState {
  users: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  };
}

const initialState: UserState = {
  users: [],
  status: "idle",
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    pageSize: 10,
    totalItems: 0,
  },
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (params: {
    pageNumber: number;
    pageSize: number;
    phone: string | null;
    role: string;
  }) => {
    const { pageNumber, pageSize, phone, role } = params;
    const response = await axiosInstance.get(`/Auth/getUser/all`, {
      params: {
        pageNumber,
        pageSize,
        phone: phone ? phone : "null",
        role: role ? role : "null",
      },
    });
    return response.data;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.results;
        state.pagination = {
          currentPage: Number(action.payload.pagination.currentPage),
          totalPages: Number(action.payload.pagination.totalPages),
          pageSize: Number(action.payload.pagination.pageSize),
          totalItems: Number(action.payload.pagination.totalItems),
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch users";
      });
  },
});

export default userSlice.reducer;
