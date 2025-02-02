"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDebts } from "@/features/statistics/debtSlice";
import { RootState, AppDispatch } from "@/store/store";
import Title from "@/components/Title/Title";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TableStatistics from "@/components/TableStatistics/TableStatistics";
import MyPagination from "@/components/Pagination/Pagination";

const StatisticsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { debts, status, error, totals, pagination } = useSelector(
    (state: RootState) => state.debtStatistics
  );

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchDebts({ pageNumber: 1, pageSize }));
  }, [dispatch, pageSize]);

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
      <Title>Qarz Statistikasi</Title>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      <p>Jami Faol Qarz: {totals.totalActiveDebtSum} so'm</p>
      <p>Jami Faol Emas Qarz: {totals.totalNotActiveDebtSum} so'm</p>
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
        <MyPagination
          currentPage={+pagination.currentPage}
          onPageChange={(event, page) => {
            dispatch(fetchDebts({ pageNumber: page, pageSize }));
          }}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalPages={+pagination.totalPages}
        />
      </div>
    </div>
  );
};

export default StatisticsPage;
