import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axiosInstance';  // Make sure axios is correctly configured

interface Debt {
  id: string;
  remaining_debt: string | null;
  isActive: string;
  comment: string | null;
  dayToBeGiven: string | null;
  dayGiven: string;
  update_date: string;
  create_data: string;
}

interface Pagination {
  currentPage: string;
  totalPages: string;
  pageSize: string;
  totalItems: string;
}

interface Totals {
  totalActiveDebtSum: number;
  totalNotActiveDebtSum: number;
}

interface ApiResponse {
  results: Debt[];
  pagination: Pagination;
  totals: Totals;
}

interface DebtState {
  debts: Debt[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: Pagination;
  totals: Totals;
}

const initialState: DebtState = {
  debts: [],
  status: 'idle',
  error: null,
  pagination: {
    currentPage: '1',
    totalPages: '1',
    pageSize: '10',
    totalItems: '0',
  },
  totals: {
    totalActiveDebtSum: 0,
    totalNotActiveDebtSum: 0,
  },
};

// Fetch Debt Statistics
export const fetchDebts = createAsyncThunk<ApiResponse, { pageNumber: number; pageSize: number }>(
  'debts/fetchDebts',
  async ({ pageNumber, pageSize }) => {
    const response = await axiosInstance.get<ApiResponse>('/debt/statistic', {
      params: { pageNumber, pageSize },
    });
    return response.data;
  }
);

const debtSlice = createSlice({
  name: 'debts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDebts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDebts.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.status = 'succeeded';
        state.debts = action.payload.results;
        state.pagination = action.payload.pagination;
        state.totals = action.payload.totals;
      })
      .addCase(fetchDebts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch debts';
      });
  },
});

export default debtSlice.reducer;
