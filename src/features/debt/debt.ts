import axiosInstance from "@/utils/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  id: string;
  first_name: string;
  name: string;
  last_name: string;
  password: string;
  role: string;
  phone: string;
  img: string | null;
  comment: string;
  update_date: string;
  create_data: string;
}

interface Debt {
  id: string;
  remaining_debt: string;
  isActive: string;
  comment: string;
  dayToBeGiven: string;
  dayGiven: string;
  update_date: string;
  create_data: string;
  user_id: User;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

interface ApiResponse {
  results: Debt[];
  pagination: Pagination;
}

interface DebtState {
  debts: Debt[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: Pagination;
}

const initialState: DebtState = {
  debts: [],
  status: "idle",
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    pageSize: 10,
    totalItems: 0,
  },
};

export const fetchDebts = createAsyncThunk<
  ApiResponse,
  { pageNumber: number; pageSize: number }
>("debts/fetchDebts", async (params) => {
  const { pageNumber, pageSize } = params;
  const response = await axiosInstance.get<ApiResponse>(
    `/debt/all`,
    {
      params: {
        pageNumber,
        pageSize,
      },
      headers: {
        accept: "*/*",
      },
    }
  );
  return response.data;
});

const debtSlice = createSlice({
  name: "debts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDebts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDebts.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.status = "succeeded";
        state.debts = action.payload.results;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDebts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch debts";
      });
  },
});

export default debtSlice.reducer;
