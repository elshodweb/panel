import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

interface CarServiceState {
  carServices: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  };
}

const initialState: CarServiceState = {
  carServices: [],
  status: "idle",
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    pageSize: 10,
    totalItems: 0,
  },
};

// Async thunk for fetching car service data
export const fetchCarServices = createAsyncThunk(
  "carServices/fetchCarServices",
  async (params: {
    pageNumber: number;
    pageSize: number;
    profit_or_expense: string | null;
  }) => {
    const { pageNumber, pageSize, profit_or_expense } = params;
    const response = await axiosInstance.get(`/car-service/all`, {
      params: {
        pageNumber,
        pageSize,
        profit_or_expense: profit_or_expense ? profit_or_expense : "null",
      },
    });
    return response.data;
  }
);

const carServiceSlice = createSlice({
  name: "carServices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarServices.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCarServices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.carServices = action.payload.results;
        state.pagination = {
          currentPage: Number(action.payload.pagination.currentPage),
          totalPages: Number(action.payload.pagination.totalPages),
          pageSize: Number(action.payload.pagination.pageSize),
          totalItems: Number(action.payload.pagination.totalItems),
        };
      })
      .addCase(fetchCarServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch car services";
      });
  },
});

export default carServiceSlice.reducer;
