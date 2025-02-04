"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCarServiceStatistics } from "@/features/statistics/carSlice";
import { RootState, AppDispatch } from "@/store/store"; // AppDispatchni to‘g‘ri import qilish
import Title from "@/components/Title/Title";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TableStatistics from "@/components/TableStatistics/TableStatistics";
import MyPagination from "@/components/Pagination/Pagination";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import styles from "./styles.module.scss";
const StatisticsPage = () => {
  const dispatch = useDispatch<AppDispatch>(); // Dispatch funktsiyasini to‘g‘ri belgilash
  const {
    data: carServiceData,
    status,
    error,
    pagination,
    totals,
  } = useSelector((state: RootState) => state.carService);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "error"
  >("success");
  const [pageSize, setPageSize] = useState(10);

  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(
      fetchCarServiceStatistics({
        pageNumber: 1,
        pageSize,
        isActive: isActive?.toString(),
        startDate,
        endDate,
      })
    );
  }, [dispatch, pageSize, isActive, startDate, endDate]);

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
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <Title>Mashinalar Statistikasi</Title>
        <div className={styles.filters}>
          <div className={styles.datePicker}>
            <label>Boshlanish sanasi:</label>
            <input
              type="date"
              value={startDate || ""}
              onChange={(e) => setStartDate(e.target.value || undefined)}
            />
          </div>
          <div className={styles.datePicker}>
            <label>Tugash sanasi:</label>
            <input
              type="date"
              value={endDate || ""}
              onChange={(e) => setEndDate(e.target.value || undefined)}
            />
          </div>
          <FormControl size="small" className={styles.select} fullWidth>
            <InputLabel id="is-active-label">Holatini tanlang</InputLabel>
            <Select
              labelId="is-active-label"
              value={isActive !== undefined ? isActive.toString() : ""}
              onChange={(e) =>
                setIsActive(
                  e.target.value === "" ? undefined : e.target.value === "true"
                )
              }
              label="Holatini tanlang"
            >
              <MenuItem value="">Barchasi</MenuItem>
              <MenuItem value="true">Faol</MenuItem>
              <MenuItem value="false">Faol emas</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

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
        <div className={styles.statistics}>
          <p className={styles.all}>
            Jami : {totals.totalProfit ? totals.totalProfit : 0} so'm
          </p>
          <p className={styles.expence}>
            Xarajat: {totals.totalExpense ? totals.totalExpense : 0} so'm
          </p>

          <p className={styles.residual}>
            Qolgani:{" "}
            {totals.totalExpense && totals.totalProfit
              ? totals.totalProfit - totals.totalExpense
              : 0}{" "}
            so'm
          </p>
        </div>
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
        <MyPagination
          currentPage={+pagination.currentPage}
          onPageChange={(event, page) => {
            dispatch(fetchCarServiceStatistics({ pageNumber: page, pageSize }));
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
