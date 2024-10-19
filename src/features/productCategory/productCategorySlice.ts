import axiosInstance from "@/utils/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface ProductCategory {
  id: string;
  title: string;
  update_date: string;
  create_data: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

interface ProductCategoryState {
  categories: ProductCategory[];
  pagination: Pagination;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductCategoryState = {
  categories: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0,
  },
  status: "idle",
  error: null,
};

export const fetchProductCategories = createAsyncThunk(
  "productCategories/fetchProductCategories",
  async (params: { title: string; pageNumber: number; pageSize: number }) => {
    const response = await axiosInstance.get(
      `/product-categories/all-with-sort?title=${params.title}&pageNumber=${params.pageNumber}&pageSize=${params.pageSize}`
    );
    return response.data;
  }
);

const productCategorySlice = createSlice({
  name: "productCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload.results;
        state.pagination = {
          currentPage: parseInt(action.payload.pagination.currentPage),
          totalPages: action.payload.pagination.totalPages,
          pageSize: parseInt(action.payload.pagination.pageSize),
          totalItems: action.payload.pagination.totalItems,
        };
      })
      .addCase(fetchProductCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch categories";
      });
  },
});

export default productCategorySlice.reducer;
