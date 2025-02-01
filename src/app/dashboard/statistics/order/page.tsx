"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "@/features/statistics/orderSlice";
import { RootState, AppDispatch } from "@/store/store"; // Store turlarini import qilish
import CustomTable from "@/components/Table/Table";
import Title from "@/components/Title/Title";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TableStatistics from "@/components/TableStatistics/TableStatistics";

const OrderStatisticsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, status, error, totals } = useSelector(
    (state: RootState) => state.orderStatistics
  );

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<"success" | "error">("success");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchOrders({ pageNumber: 1, pageSize: 10 }));
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [error]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <div>
      <Title>Buyurtma Statistikasi</Title>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      <div>
        <h3>Buyurtmalar ro‘yxati</h3>
        <TableStatistics
          keys={["total_price", "daily_price", "paid_total", "IsActive"]}
          titles={["Jami narx", "Kunlik narx", "To‘langan summa", "Faol holat"]}
          data={orders.map((order) => ({
            ...order,
            IsActive: order.IsActive === "1" ? "Faol" : "Faol emas",
            total_price: order.total_price ?? "N/A",
          }))}
        />
        <p>Jami narx: {totals.totalPriceSum} so'm</p>
        <p>Jami to‘langan: {totals.totalPaidSum} so'm</p>
      </div>
    </div>
  );
};

export default OrderStatisticsPage;
