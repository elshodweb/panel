import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";

import productCategoryReducer from "@/features/productCategory/productCategorySlice";
import productReducer from "@/features/products/products";
import allCategoriesReducer from "@/features/productCategory/allCategories";

const rootReducer = combineReducers({
  productCategories: productCategoryReducer,
  allCategories: allCategoriesReducer,
  products: productReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store };
