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
  img: string | null;
  comment: string;
  update_date: string;
  create_data: string;
}

interface CarService {
  id: string;
  profit_or_expense: "profit" | "expense"; // Учитывая, что это может быть только "profit" или "expense"
  price: string; // Похоже, что это строка в ответе
  comment: string;
  create_data: string; // Дата создания в строковом формате
  user_id: User; // Вложенный объект для пользователя
  order_id: string | null; // Значение может быть null
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

interface ApiResponse {
  results: CarService[];
  pagination: Pagination;
}

interface CarServiceState {
  carServices: CarService[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: Pagination;
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

export const fetchCarServices = createAsyncThunk<
  ApiResponse,
  { pageNumber: number; pageSize: number; profit_or_expense: string | null }
>(
  "carServices/fetchCarServices",
  async (params) => {
    const { pageNumber, pageSize, profit_or_expense } = params;
    const response = await axiosInstance.get<ApiResponse>(`/car-service/all`, {
      params: {
        pageNumber,
        pageSize,
        profit_or_expense: profit_or_expense || "null",
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
      .addCase(fetchCarServices.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.status = "succeeded";
        state.carServices = action.payload.results;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCarServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch car services";
      });
  },
});

export default carServiceSlice.reducer;
