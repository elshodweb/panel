import { configureStore, combineReducers } from "@reduxjs/toolkit";
import productCategoryReducer from "@/features/productCategory/productCategorySlice";
import productReducer from "@/features/products/products";
import allCategoriesReducer from "@/features/productCategory/allCategories";
import userReducer from "@/features/users/users";
import carServiceReducer from "@/features/cars/cars";
import debtReducer from "@/features/debt/debt"; // Импортируйте debtSlice.reducer
import orderReducer from "@/features/order/order"; // Импортируйте orderSlice.reducer
import ordersWithFilterReducer from "@/features/order/orderWithFilter"; // Импортируйте orderSlice.reducer
import carServiceStatisticsReducer from "@/features/statistics/carSlice"; // Импортируйте orderSlice.reducer
import debtStatisticsReducer from "@/features/statistics/debtSlice"; // Импортируйте orderSlice.reducer
import orderStatisticsReducer from "@/features/statistics/orderSlice"; // Импортируйте orderSlice.reducer

const rootReducer = combineReducers({
  productCategories: productCategoryReducer,
  allCategories: allCategoriesReducer,
  products: productReducer,
  users: userReducer,
  carServices: carServiceReducer,
  debts: debtReducer, // Добавляем редьюсер для debt
  orders: orderReducer,
  ordersWithFilter: ordersWithFilterReducer, // Добавляем редьюсер для ordersWithFilter
  carService: carServiceStatisticsReducer, // Добавляем редьюсер для ordersWithFilter
  debtStatistics: debtStatisticsReducer, // Добавляем редьюсер для ordersWithFilter
  orderStatistics: orderStatisticsReducer, // Добавляем редьюсер для ordersWithFilter
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
