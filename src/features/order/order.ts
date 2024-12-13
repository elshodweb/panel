import axiosInstance from "@/utils/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

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

interface Order {
  id: string;
  total_price: string;
  daily_price: string;
  paid_total: string;
  isActive: string;
  data_sequence: string;
  update_date: string;
  create_data: string;
  user_id: User;
  carServices: [];
}

interface OrderState {
  orders: Order[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  status: "idle",
  error: null,
};

export const fetchOrders = createAsyncThunk<Order[]>(
  "orders/fetchOrders",
  async (params) => {
    const response = await axiosInstance.get<Order[]>("/order/all", {
      headers: {
        accept: "*/*",
      },
    });

    return response.data;
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.status = "succeeded";
          state.orders = action.payload;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch orders";
      });
  },
});

export default orderSlice.reducer;
