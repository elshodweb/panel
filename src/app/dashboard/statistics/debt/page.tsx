"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDebts } from "@/features/statistics/debtSlice";
import { RootState, AppDispatch } from "@/store/store"; // Store tiplarini import qilish
import CustomTable from "@/components/Table/Table";
import Title from "@/components/Title/Title";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TableStatistics from "@/components/TableStatistics/TableStatistics";

const StatisticsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { debts, status, error, totals } = useSelector(
    (state: RootState) => state.debtStatistics
  );

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "error"
  >("success");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDebts({ pageNumber: 1, pageSize: 10 }));
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
      <Title>Qarz Statistikasi</Title>

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
        <h3>Qarzlar Ro‘yxati</h3>
        <TableStatistics
          keys={["remaining_debt", "comment", "dayGiven", "isActive"]}
          titles={["Qoldiq Qarz", "Izoh", "Berilgan Kun", "Faol"]}
          data={debts.map((debt) => ({
            ...debt,
            isActive: debt.isActive === "1" ? "Faol" : "Faol emas",
            remaining_debt: debt.remaining_debt ?? "N/A",
          }))}
        />
        <p>Jami Faol Qarz: {totals.totalActiveDebtSum} so'm</p>
        <p>Jami Faol Emas Qarz: {totals.totalNotActiveDebtSum} so'm</p>
      </div>
    </div>
  );
};

export default StatisticsPage;
