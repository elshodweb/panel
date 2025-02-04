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
import styles from "./styles.module.scss";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
const OrderStatisticsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, status, error, totals, pagination } = useSelector(
    (state: RootState) => state.orderStatistics
  );
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchOrders({
        pageNumber: currentPage,
        pageSize,
        isActive: isActive?.toString(),
        startDate,
        endDate,
      })
    );
  }, [dispatch, currentPage, pageSize, isActive, startDate, endDate]);

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
        <Title>Buyurtma Statistikasi</Title>
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
          Jami : {totals.totalPriceSum ? totals.totalPriceSum : 0} so'm
        </p>
        <p className={styles.expence}>
          Xarajat: {totals.totalPaidSum ? totals.totalPaidSum : 0} so'm
        </p>

        <p className={styles.residual}>
          Qolgani:{" "}
          {totals.totalPaidSum && totals.totalPriceSum
            ? totals.totalPriceSum - totals.totalPaidSum
            : 0}{" "}
          so'm
        </p>
      </div>
      <p>Jami to‘langan: {} so'm</p>
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
