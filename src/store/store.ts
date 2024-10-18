// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";

// Импорт вашего слайса
import productCategoryReducer from "@/features/productCategory/productCategorySlice";

// Комбинирование редьюсеров
const rootReducer = combineReducers({
  // Добавление productCategorySlice в корневой редьюсер
  productCategories: productCategoryReducer,
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
