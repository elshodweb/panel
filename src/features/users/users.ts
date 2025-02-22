import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

interface User {
  id: string;
  first_name: string;
  name: string;
  last_name: string;
  password: string;
  role: string;
  phone: string;
  img: string | null; // This can be null or a string if there's an image
  comment: string;
  update_date: string; // ISO 8601 string for date
  create_data: string; // ISO 8601 string for date
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

interface ApiResponse {
  results: User[];
  pagination: Pagination;
}

interface UserState {
  users: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: Pagination;
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

export const fetchUsers = createAsyncThunk<
  ApiResponse,
  { pageNumber: number; pageSize: number; search: string | null;  }
>(
  "users/fetchUsers",
  async (params) => {
    const { pageNumber, pageSize, search } = params;
    const response = await axiosInstance.get<ApiResponse>(`/Auth/getUser/all`, {
      params: {
        pageNumber,
        pageSize,
        search: search || "null",
        role: "user",
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
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.status = "succeeded";
        state.users = action.payload.results;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch users";
      });
  },
});

export default userSlice.reducer;
