import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axiosInstance';  // Make sure axios is correctly configured

interface Order {
  id: string;
  total_price: string;
  daily_price: string;
  paid_total: string;
  IsActive: string;
  data_sequence: string;
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
  totalPriceSum: number;
  totalPaidSum: number;
}

interface ApiResponse {
  results: Order[];
  pagination: Pagination;
  totals: Totals;
}

interface OrderState {
  orders: Order[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: Pagination;
  totals: Totals;
}

const initialState: OrderState = {
  orders: [],
  status: 'idle',
  error: null,
  pagination: {
    currentPage: '1',
    totalPages: '1',
    pageSize: '10',
    totalItems: '0',
  },
  totals: {
    totalPriceSum: 0,
    totalPaidSum: 0,
  },
};

// Fetch Order Statistics
export const fetchOrders = createAsyncThunk<ApiResponse, { pageNumber: number; pageSize: number }>(
  'orders/fetchOrders',
  async ({ pageNumber, pageSize }) => {
    const response = await axiosInstance.get<ApiResponse>('/order/statistic', {
      params: { pageNumber, pageSize },
    });
    return response.data;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.status = 'succeeded';
        state.orders = action.payload.results;
        state.pagination = action.payload.pagination;
        state.totals = action.payload.totals;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch orders';
      });
  },
});

export default orderSlice.reducer;
