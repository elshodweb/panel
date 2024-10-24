import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


interface DebtState {
  debts: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  };
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


export const fetchDebts = createAsyncThunk(
  "debts/fetchDebts",
  async (params: { pageNumber: number; pageSize: number }) => {
    const { pageNumber, pageSize } = params;
    const response = await axios.get(
      `https://control.coachingzona.uz/api/v1/debt/all`,
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
  }
);

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
      .addCase(fetchDebts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.debts = action.payload.results;
        state.pagination = {
          currentPage: Number(action.payload.pagination.currentPage),
          totalPages: Number(action.payload.pagination.totalPages),
          pageSize: Number(action.payload.pagination.pageSize),
          totalItems: Number(action.payload.pagination.totalItems),
        };
      })
      .addCase(fetchDebts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch debts";
      });
  },
});

export default debtSlice.reducer;
