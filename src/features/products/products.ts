import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

interface ProductState {
  products: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  };
}

const initialState: ProductState = {
  products: [],
  status: "idle",
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    pageSize: 10,
    totalItems: 0,
  },
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: {
    pageNumber: number;
    pageSize: number;
    searchTitle: string;
    searchable_title_id: string;
    category_id: string;
  }) => {
    const {
      pageNumber,
      pageSize,
      searchTitle,
      searchable_title_id,
      category_id,
    } = params;
    const response = await axiosInstance.get(`/product/all`, {
      params: {
        pageNumber,
        pageSize,
        searchTitle,
        searchable_title_id,
        category_id: category_id.length > 0 ? category_id : null,
      },
    });
    return response.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.results;
        state.pagination = {
          currentPage: Number(action.payload.pagination.currentPage),
          totalPages: Number(action.payload.pagination.totalPages),
          pageSize: Number(action.payload.pagination.pageSize),
          totalItems: Number(action.payload.pagination.totalItems),
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});

export default productSlice.reducer;
