"use client";
import React, { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/utils/axiosInstance";
import TableForOrders from "@/components/TableForOrders/TableForOrders";
import Title from "@/components/Title/Title";
import { RootState, AppDispatch } from "@/store/store";
import { fetchOrdersWithFilter } from "@/features/order/orderWithFilter";
import styles from "./styles.module.scss";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import Loader from "@/components/Loader/Loader";
import Search from "@/components/Search/Search";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Modal from "@/components/Modal/Modal";
import { CheckBox } from "@mui/icons-material";

const Alert = forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiAlert>>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  }
);

const OrderPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, status, error, pagination } = useSelector(
    (state: RootState) => state.ordersWithFilter
  );
  console.log(orders);
  const [search, setSearch] = useState("");
  const [id, setId] = useState("");
  const [nomer, setNomer] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const [pageSize, setPageSize] = useState(10);
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDebt, setIsDebt] = useState<boolean>(false);
  const [debt,setDebt] =useState<boolean>()
  async function handleDelete() {
    try {
      const response = await axiosInstance.delete(
        `/order/delete/${selectedOrder.id}`
      );
      if (response.status >= 200 && response.status < 300) {
        dispatch(
          fetchOrdersWithFilter({
            title: "",
            pageNumber: 1,
            pageSize,
            isActive,
            nomer,
            name,
            startDate,
            endDate,
          })
        );
        showSnackbar("Order successfully deleted", "success");
      } else {
        showSnackbar("Failed to delete order", "error");
      }
    } catch (error) {
      showSnackbar("Error occurred while deleting order", "error");
    }
    setSelectedOrder(null);
    setIsConfirmDeleteOpen(false);
  }
  useEffect(() => {
    dispatch(
      fetchOrdersWithFilter({
        title: "",
        pageNumber: 1,
        pageSize,
        isActive,
        nomer,
        name,
        startDate,
        endDate,
      })
    );
  }, [dispatch, pageSize, isActive, startDate, endDate]);

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <Title>Orders</Title>

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

        {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Boshlanish sanasi"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => (
              <input {...params.inputProps} className={styles.datePicker} />
            )}
          />
          <DatePicker
            label="Tugash sanasi"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => (
              <input {...params.inputProps} className={styles.datePicker} />
            )}
          /> */}
        {/* </LocalizationProvider> */}

        {/* Search component for nomer and name */}
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

        <Search
          onChange={(e) => {
            const value = e.target.value;
            if (value == "") {
              dispatch(
                fetchOrdersWithFilter({
                  title: "",
                  pageNumber: 1,
                  pageSize,
                  isActive,
                  nomer,
                  name,
                  startDate,
                  endDate,
                })
              );
            }
            if (!isNaN(parseFloat(value))) {
              setNomer(value); // Use as phone number or ID
              setName(""); // Clear name search
            } else {
              setName(value); // Use as name
              setNomer(""); // Clear phone number search
            }
            setSearch(value);
          }}
          placeholder="Qidirish (Nomi, Id)"
          onClick={() => {
            dispatch(
              fetchOrdersWithFilter({
                title: "",
                pageNumber: 1,
                pageSize,
                isActive,
                nomer,
                name,
                startDate,
                endDate,
              })
            );
          }}
          search={search}
        />
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {status === "loading" && (
        <div>
          <Loader />
        </div>
      )}
      {status === "failed" && <p>Error: {error}</p>}
      {status === "succeeded" && (
        <>
          <TableForOrders
            data={orders}
            onUpdate={() => {}}
            onDelete={async (order) => {
              setIsConfirmDeleteOpen(true);
              setSelectedOrder(order);
            }}
          />
          <Modal
            isOpen={isConfirmDeleteOpen}
            onClose={() => setIsConfirmDeleteOpen(false)}
            title="Holatni o'zgartirish"
          >
            <p>
              Haqiqatan ham ushbu haridni holatini o'zgasrtirishni istaysizmi?
            </p>
            <CheckBox />
            <button onClick={handleDelete}>Ha</button>
            <button onClick={() => setIsConfirmDeleteOpen(false)}>Yo'q</button>
          </Modal>

          {/* <MyPagination */}
            {/* // currentPage={pagination?.currentPage} */}
            {/* onPageChange={(event, page) => {
              dispatch(
                fetchOrdersWithFilter({
                  title: "",
                  pageNumber: page,
                  pageSize,
                  isActive,
                  nomer,
                  name,
                  startDate,
                  endDate,
                })
              );
            }}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={pagination.totalPages}
          /> */}
        </>
      )}
    </div>
  );
};

export default OrderPage;
