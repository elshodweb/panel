"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCarServiceStatistics } from "@/features/statistics/statisticsLice";
import { RootState, AppDispatch } from "@/store/store"; // AppDispatchni to‘g‘ri import qilish
import CustomTable from "@/components/Table/Table";
import Title from "@/components/Title/Title";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TableStatistics from "@/components/TableStatistics/TableStatistics";

const StatisticsPage = () => {
  const dispatch = useDispatch<AppDispatch>(); // Dispatch funktsiyasini to‘g‘ri belgilash
  const {
    data: carServiceData,
    status,
    error,
    totals,
  } = useSelector((state: RootState) => state.carService);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "error"
  >("success");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCarServiceStatistics({ pageNumber: 1, pageSize: 10 }));
    }
  }, [dispatch, status]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (error) {
      showSnackbar(error, "error");
    }
  }, [error]);

  return (
    <div>
      <Title>Mashinalar Statistikasi</Title>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      <div>
        <h3>Avtomobil Xizmatlari ro‘yxati</h3>
        <TableStatistics
          keys={["profit_or_expense", "price", "comment", "create_data"]}
          titles={["Turi", "Narx", "Izoh", "Yaratilgan Sana"]}
          data={carServiceData.map((service) => ({
            ...service,
            profit_or_expense:
              service.profit_or_expense === "profit" ? "Foyda" : "Xarajat",
          }))}
        />
        <p>Jami Foyda: {totals.totalProfit ? totals.totalProfit : 0} so'm</p>
        <p>
          Jami Xarajat: {totals.totalExpense ? totals.totalExpense : 0} so'm
        </p>
      </div>
    </div>
  );
};

export default StatisticsPage;
