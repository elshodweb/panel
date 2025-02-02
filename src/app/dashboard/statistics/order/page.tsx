"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "@/features/statistics/orderSlice";
import { RootState, AppDispatch } from "@/store/store";
import Title from "@/components/Title/Title";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TableStatistics from "@/components/TableStatistics/TableStatistics";
import MyPagination from "@/components/Pagination/Pagination";

const OrderStatisticsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, status, error, totals, pagination } = useSelector(
    (state: RootState) => state.orderStatistics
  );

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchOrders({ pageNumber: currentPage, pageSize }));
  }, [dispatch, currentPage, pageSize]);

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

  return (
    <div>
      <Title>Buyurtma Statistikasi</Title>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      <p>Jami narx: {totals.totalPriceSum} so'm</p>
      <p>Jami to‘langan: {totals.totalPaidSum} so'm</p>
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
        <MyPagination
          currentPage={+pagination.currentPage}
          onPageChange={(event, page) => setCurrentPage(page)}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalPages={+pagination.totalPages}
        />
      </div>
    </div>
  );
};

export default OrderStatisticsPage;
