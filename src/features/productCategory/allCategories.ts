import axiosInstance from "@/utils/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface ProductCategory {
  id: string;
  title: string;
}

interface ApiResponse {
  results: ProductCategory[];
}

interface ProductCategoryState {
  categories: ProductCategory[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductCategoryState = {
  categories: [],
  status: "idle",
  error: null,
};

export const fetchAllCategories = createAsyncThunk<ApiResponse>(
  "AllCategories/fetchAllCategories",
  async (): Promise<ApiResponse> => {
    const response = await axiosInstance.get<ApiResponse>(
      `/product-categories/all-with-sort?title=null&pageNumber=1&pageSize=200`
    );
    return response.data;
  }
);


const productCategorySlice = createSlice({
  name: "AllCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCategories.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.status = "succeeded";
        state.categories = action.payload.results;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch categories";
      });
  },
});

export default productCategorySlice.reducer;
