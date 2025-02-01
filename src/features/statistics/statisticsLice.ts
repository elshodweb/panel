// src/features/statistics/statisticsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance"; // Assuming axios instance is correctly configured

interface CarServiceData {
  profit_or_expense: string;
  price: string;
  comment: string;
  create_data: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

interface ApiResponse {
  results: CarServiceData[];
  pagination: Pagination;
  totals: {
    totalProfitSum: number;
    totalExpenseSum: number;
  };
}

interface CarServiceState {
  data: CarServiceData[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: Pagination;
  totals: {
    totalProfit: number;
    totalExpense: number;
  };
}

const initialState: CarServiceState = {
  data: [],
  status: "idle",
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    pageSize: 10,
    totalItems: 0,
  },
  totals: {
    totalProfit: 0,
    totalExpense: 0,
  },
};

export const fetchCarServiceStatistics = createAsyncThunk<ApiResponse, { pageNumber: number; pageSize: number }>(
  "carService/fetchStatistics",
  async ({ pageNumber, pageSize }) => {
    const response = await axiosInstance.get<ApiResponse>("/car-service/statistic", {
      params: { pageNumber, pageSize },
    });
    return response.data;
  }
);

const carServiceSlice = createSlice({
  name: "carService",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarServiceStatistics.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCarServiceStatistics.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.status = "succeeded";
        state.data = action.payload.results;
        state.pagination = action.payload.pagination;
        state.totals = {
          totalProfit: action.payload.totals.totalProfitSum,
          totalExpense: action.payload.totals.totalExpenseSum,
        };
      })
      .addCase(fetchCarServiceStatistics.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch car service statistics";
      });
  },
});

export default carServiceSlice.reducer;
