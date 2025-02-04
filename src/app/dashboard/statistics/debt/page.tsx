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
import styles from "./styles.module.scss";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const StatisticsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { debts, status, error, totals, pagination } = useSelector(
    (state: RootState) => state.debtStatistics
  );

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [pageSize, setPageSize] = useState(10);
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(
      fetchDebts({
        pageNumber: 1,
        pageSize,
        isActive: isActive?.toString(),
        startDate,
        endDate,
      })
    );
  }, [dispatch, pageSize, isActive, startDate, endDate]);

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
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <Title>Qarz Statistikasi</Title>
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
      <div className={styles.statistics}>
        <p className={styles.all}>
          Jami:{" "}
          {totals.totalNotActiveDebtSum && totals.totalActiveDebtSum
            ? totals.totalNotActiveDebtSum + totals.totalActiveDebtSum
            : 0}{" "}
          so'm
        </p>
        <p className={styles.expence}>
          To'langan:{" "}
          {totals.totalNotActiveDebtSum ? totals.totalNotActiveDebtSum : 0} so'm
        </p>
        <p className={styles.residual}>
          Qarz: {totals.totalActiveDebtSum ? totals.totalActiveDebtSum : 0}{" "}
          so'm
        </p>
      </div>
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
