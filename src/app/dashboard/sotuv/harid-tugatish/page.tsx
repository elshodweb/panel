"use client";
import React, { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/utils/axiosInstance";
import TableForOrders from "@/components/TableForOrders/TableForOrders";
import Title from "@/components/Title/Title";
import { RootState, AppDispatch } from "@/store/store";
import { fetchOrdersWithFilter } from "@/features/order/orderWithFilter";
import styles from "./styles.module.scss";
import MyPagination from "@/components/Pagination/Pagination";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import Loader from "@/components/Loader/Loader";

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

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchOrdersWithFilter({ title: "", pageNumber: 1, pageSize }));
  }, [dispatch, pageSize]);

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
              try {
                const response = await axiosInstance.delete(
                  `/order/delete/${order.id}`
                );
                if (response.status >= 200 && response.status < 300) {
                  dispatch(
                    fetchOrdersWithFilter({
                      title: "",
                      pageNumber: 1,
                      pageSize,
                    })
                  );
                  showSnackbar("Order successfully deleted", "success");
                } else {
                  showSnackbar("Failed to delete order", "error");
                }
              } catch (error) {
                showSnackbar("Error occurred while deleting order", "error");
              }
            }}
          />

          <MyPagination
            currentPage={pagination.currentPage}
            onPageChange={(event, page) => {
              dispatch(
                fetchOrdersWithFilter({ title: "", pageNumber: page, pageSize })
              );
            }}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={pagination.totalPages}
          />
        </>
      )}
    </div>
  );
};

export default OrderPage;
