"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchOrders } from "@/features/order/order"; // Path to the new slice
import CustomTable from "@/components/Table/Table"; // Assuming you have a component for tables
import Loader from "@/components/Loader/Loader";
import styles from "./styles.module.scss";
import Title from "@/components/Title/Title";
import AddBtn from "@/components/Buttons/AddBtn/AddBtn";
import Modal from "@/components/Modal/Modal";
import axiosInstance from "@/utils/axiosInstance";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
const OrdersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, status, error } = useSelector(
    (state: RootState) => state.orders
  );

  const {
    users,
    status: Ustatus,
    error: Uerror,
    pagination: Upagination,
  } = useSelector((state: RootState) => state.users);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [formData, setFormData] = useState({
    price: "",
    profit_or_expense: "",
    comment: "",
    user_id: "",
  });
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleDelete = async () => {
    if (!selectedService) return;

    try {
      const response = await axiosInstance.delete(
        `/car-service/delete/${selectedService.id}`
      );

      if (response.status < 300) {
        dispatch(fetchOrders());
        setIsConfirmDeleteOpen(false);
        showSnackbar("Servis muvaffaqiyatli oʻchirildi", "success");
      } else {
        showSnackbar("Servisni o‘chirib bo‘lmadi", "error");
      }
    } catch (error) {
      showSnackbar("Servisni oʻchirishda xatolik yuz berdi", "error");
    }
  };

  const handleUpdate = (order: any) => {

    // You can dispatch an action for updating an order here
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = isEditMode
      ? `/car-service/update/${selectedService.id}`
      : "/car-service/create";

    try {


      const response = await axiosInstance({
        method: isEditMode ? "patch" : "post",
        url: endpoint,
        data: formData,
      });

      if (response.status >= 200 && response.status < 300) {
        dispatch(fetchOrders());
        setIsModalOpen(false);
        showSnackbar(
          isEditMode
            ? "Servis muvaffaqiyatli yangilandi"
            : "Servis muvaffaqiyatli qo'shildi",
          "success"
        );
      } else {
        showSnackbar("Servis saqlanmadi", "error");
      }
    } catch (error) {
      showSnackbar("Servisni saqlanishida hato ketdi", "error");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <Title>Harid qilish</Title>
        <div className={styles.right}>
          <AddBtn onClick={() => {}} />
        </div>
      </div>
      {status === "loading" && <Loader />}
      {status === "failed" && <p>Error: {error}</p>}
      {status === "succeeded" && (
        <>
          <CustomTable
            keys={[
              "user_name",
              "total_price",
              "paid_total",
              "isActive",
              "data_sequence",
            ]}
            titles={[
              "Foydalanuvchi",
              "Jami narx",
              "To'langan jami",
              "Faol holat",
              "Sana",
            ]}
            data={orders.map((order) => ({
              ...order,
              user_name: `${order.user_id.first_name} ${order.user_id.name}`,
              isActive: order.isActive === "1" ? "Activ" : "Activ emas",
              data_sequence: order.data_sequence.split("T")[0],
            }))}
            onDelete={handleDelete} // Provide onDelete function
            onUpdate={handleUpdate} // Provide onUpdate function
          />
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? "Servisni o'zgartirish" : "Servis yaratish"}
      >
        <form onSubmit={handleFormSubmit}>
          <TextField
            label="Narx"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            fullWidth
            required
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="profit-or-expense-label">Turi</InputLabel>
            <Select
              labelId="profit-or-expense-label"
              value={formData.profit_or_expense}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  profit_or_expense: e.target.value,
                })
              }
              label="Turi"
              required
            >
              <MenuItem value="profit">Daromad</MenuItem>
              <MenuItem value="expense">Xarajat</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Izoh"
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
            fullWidth
            margin="normal"
          />

          {/* Select for Users */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="users-label">Foydalanuvchi</InputLabel>
            <Select
              labelId="users-label"
              value={formData.user_id}
              onChange={(e) =>
                setFormData({ ...formData, user_id: e.target.value })
              }
              label="Foydalanuvchi"
              required
            >
              {/* <MenuItem value={"null"}>Olib tashlash</MenuItem> */}
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            {isEditMode ? "Saqlash" : "Qo'shish"}
          </Button>
        </form>
      </Modal>
      <Modal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        title="O'chirishni Tasdiqlash"
      >
        <p>Ushbu kategoriyani o‘chirishga ishonchingiz komilmi?</p>
        <button onClick={handleDelete}>Ha, O'chirish</button>
        <button onClick={() => setIsConfirmDeleteOpen(false)}>
          Bekor qilish
        </button>
      </Modal>
    </div>
  );
};

export default OrdersPage;
