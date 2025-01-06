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

interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

interface ApiResponse {
  results: Order[];
  pagination: Pagination;
}

interface OrderState {
  orders: Order[];
  pagination: Pagination;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0,
  },
  status: "idle",
  error: null,
};

export const fetchOrdersWithFilter = createAsyncThunk<
  ApiResponse,
  {
    title?: string;
    pageNumber: number;
    pageSize: number;
    isActive?: boolean;
    nomer?: string;
    name?: string;
    startDate?: string;
    endDate?: string;
  }
>("orders/fetchOrdersWithFilter", async (params) => {
  const queryParams = new URLSearchParams();

  // Добавляем параметры к запросу, если они переданы
  queryParams.append("pageNumber", params.pageNumber.toString());
  queryParams.append("pageSize", params.pageSize.toString());
  if (params.title) queryParams.append("title", params.title);
  if (params.isActive !== undefined)
    queryParams.append("isActive", params.isActive.toString());
  if (params.nomer) queryParams.append("nomer", params.nomer);
  if (params.name) queryParams.append("name", params.name);
  if (params.startDate) queryParams.append("startDate", params.startDate);
  if (params.endDate) queryParams.append("endDate", params.endDate);

  const response = await axiosInstance.get<ApiResponse>(
    `/order/all?${queryParams.toString()}`,
    {
      headers: {
        accept: "*/*",
      },
    }
  );

  return response.data;
});


const orderSliceWithFilter = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersWithFilter.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchOrdersWithFilter.fulfilled,
        (state, action: PayloadAction<ApiResponse>) => {
          state.status = "succeeded";
          state.orders = action.payload.results;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchOrdersWithFilter.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch orders";
      });
  },
});

export default orderSliceWithFilter.reducer;
