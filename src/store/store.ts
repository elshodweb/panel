import { configureStore, combineReducers } from "@reduxjs/toolkit";
import productCategoryReducer from "@/features/productCategory/productCategorySlice";
import productReducer from "@/features/products/products";
import allCategoriesReducer from "@/features/productCategory/allCategories";
import userReducer from "@/features/users/users";
import carServiceReducer from "@/features/cars/cars";
import debtReducer from "@/features/debt/debt"; // Импортируйте debtSlice.reducer

const rootReducer = combineReducers({
  productCategories: productCategoryReducer,
  allCategories: allCategoriesReducer,
  products: productReducer,
  users: userReducer,
  carServices: carServiceReducer,
  debts: debtReducer, // Добавляем редьюсер для debt
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
