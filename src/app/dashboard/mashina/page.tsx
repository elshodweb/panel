"use client";
import React, { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/utils/axiosInstance";
import CustomTable from "@/components/Table/Table";
import Title from "@/components/Title/Title";
import Modal from "@/components/Modal/Modal";
import { RootState, AppDispatch } from "@/store/store";
import { fetchCarServices } from "@/features/cars/cars";
import styles from "./styles.module.scss";
import AddBtn from "@/components/Buttons/AddBtn/AddBtn";
import MyPagination from "@/components/Pagination/Pagination";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { fetchUsers } from "@/features/users/users";
import Loader from "@/components/Loader/Loader";
import UserModalForm from "@/components/UserModalForm/UserModalForm";

// Компонент Alert для уведомлений
const Alert = forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiAlert>>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  }
);

const CarServicePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { carServices, status, error, pagination } = useSelector(
    (state: RootState) => state.carServices
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
  const [pageSize, setPageSize] = useState(10);
  const [profitOrExpenseFilter, setProfitOrExpenseFilter] = useState<
    string | null
  >(null);
  const setUser = (id: string) => {
    dispatch(fetchUsers({ pageNumber: 1, pageSize: 200, search: "null" }));
    setFormData({ ...formData, user_id: id });
  };
  useEffect(() => {
    dispatch(
      fetchCarServices({
        pageNumber: 1,
        pageSize,
        profit_or_expense: profitOrExpenseFilter,
      })
    );
    dispatch(
      fetchUsers({
        pageNumber: 1,
        pageSize: 200,
        search: "null",
      })
    );
  }, [dispatch, pageSize, profitOrExpenseFilter]);

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

  const handleDelete = async () => {
    if (!selectedService) return;

    try {
      const response = await axiosInstance.delete(
        `/car-service/delete/${selectedService.id}`
      );

      if (response.status < 300) {
        dispatch(
          fetchCarServices({
            pageNumber: 1,
            pageSize,
            profit_or_expense: profitOrExpenseFilter,
          })
        );
        setIsConfirmDeleteOpen(false);
        showSnackbar("Servis muvaffaqiyatli oʻchirildi", "success");
      } else {
        showSnackbar("Servisni o‘chirib bo‘lmadi", "error");
      }
    } catch (error) {
      showSnackbar("Servisni oʻchirishda xatolik yuz berdi", "error");
    }
  };

  const handleUpdate = (service: any) => {
    setIsEditMode(true);
    setSelectedService(service);

    setFormData({
      price: service.price,
      profit_or_expense:
        service.profit_or_expense === "Xarajat"
          ? "expense"
          : service.profit_or_expense === "Daromad"
          ? "profit"
          : "",
      comment: service.comment,
      user_id: service.user_id.id || "",
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setIsEditMode(false);
    setSelectedService(null);
    setFormData({ price: "", profit_or_expense: "", comment: "", user_id: "" });
    setIsModalOpen(true);
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
        dispatch(
          fetchCarServices({
            pageNumber: 1,
            pageSize,
            profit_or_expense: profitOrExpenseFilter,
          })
        );
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
        <Title>Mashinalar</Title>
        <div className={styles.right}>
          <AddBtn onClick={handleCreate} />
          <FormControl size="small" className={styles.select} fullWidth>
            <InputLabel id="profit-expense-label">Turini tanlang</InputLabel>
            <Select
              labelId="profit-expense-label"
              value={profitOrExpenseFilter || ""}
              onChange={(e) => setProfitOrExpenseFilter(e.target.value || null)}
              label="Turini tanlang"
            >
              <MenuItem value="">Barchasi</MenuItem>
              <MenuItem value="profit">Daromad</MenuItem>
              <MenuItem value="expense">Xarajat</MenuItem>
            </Select>
          </FormControl>
        </div>
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

      {status === "loading" && <Loader />}
      {status === "failed" && <p>Error: {error}</p>}
      {status === "succeeded" && (
        <>
          <CustomTable
            keys={["comment", "price", "profit_or_expense", "user_name"]} // Добавляем новый ключ "user_name"
            titles={["Izoh", "Narhi", "Turi", "Foydalanuvchi"]} // Добавляем заголовок для столбца
            data={carServices.map((service) => ({
              ...service,
              profit_or_expense:
                service.profit_or_expense === "profit" ? "Daromad" : "Xarajat",
              user_name: service.user_id
                ? `${service.user_id.name} ${service.user_id.last_name}`
                : "null", // Добавляем поле user_name
            }))}
            onDelete={(service) => {
              setSelectedService(service);
              setIsConfirmDeleteOpen(true);
            }}
            onUpdate={handleUpdate}
          />

          <MyPagination
            currentPage={pagination.currentPage}
            onPageChange={(event, page) => {
              dispatch(
                fetchCarServices({
                  pageNumber: page,
                  pageSize,
                  profit_or_expense: profitOrExpenseFilter,
                })
              );
            }}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={pagination.totalPages}
          />

          {/* Modal for Create and Update */}
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
                  {users.map((user, i) => (
                    <MenuItem key={i} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <UserModalForm getIdUser={setUser}></UserModalForm>
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
        </>
      )}
    </div>
  );
};

export default CarServicePage;
