import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { ProductCategory } from "../productCategory/productCategorySlice";

interface Product {
  id: string;
  title: string;
  price: number;
  category_id: ProductCategory;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

interface ApiResponse {
  results: Product[];
  pagination: Pagination;
}

interface ProductState {
  products: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: Pagination;
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

export const fetchProducts = createAsyncThunk<
  ApiResponse,
  {
    pageNumber: number;
    pageSize: number;
    searchTitle: string;
    searchable_title_id: string;
    category_id: string;
  }
>(
  "products/fetchProducts",
  async (params) => {
    const { pageNumber, pageSize, searchTitle, searchable_title_id, category_id } = params;
    const response = await axiosInstance.get<ApiResponse>(`/product/all`, {
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
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.status = "succeeded";
        state.products = action.payload.results;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});

export default productSlice.reducer;
