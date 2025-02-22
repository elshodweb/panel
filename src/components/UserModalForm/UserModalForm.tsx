"use client";
import { Alert, Snackbar, TextField } from "@mui/material";
import React, { useState } from "react";
import Modal from "../Modal/Modal";
import axiosInstance from "@/utils/axiosInstance";
import styles from "./UserModalForm.module.scss";
const UserModalForm: React.FC<{ getIdUser: (id: string) => void }> = ({
  getIdUser,
}) => {
  const [userData, setSelectedUser] = useState<any>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("first_name", userData?.first_name || "");
    formData.append("name", userData?.name || "");
    formData.append("last_name", userData?.last_name || "");
    formData.append("comment", userData?.comment || "");
    formData.append("phone", userData?.phone || "");
    formData.append("role", userData?.role || "");
    formData.append("password", userData?.password || "");

    if (avatar) {
      formData.append("image", avatar);
    }

    try {
      const response: any = await axiosInstance({
        method: "post",
        url: "/Auth/user/register",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data", // Указываем правильный тип контента
        },
      });

      if (response.status < 300) {
        setIsModalOpen(false);
        showSnackbar("Foydalanuvchi muvaffaqiyatli qo'shildi", "success");
        getIdUser(response?.data?.user?.id);
      } else {
        showSnackbar("Foydalanuvchini saqlashda xato", "error");
      }
    } catch (error) {
      showSnackbar("Foydalanuvchini saqlashda xatolik yuz berdi", "error");
    }
  };
  return (
    <>
      <button type="button" className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
        Foydalanuvchi yaratish
      </button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={"Foydalanuvchi yaratish"}
      >
        <div className={styles.form}>
          <TextField
            autoComplete="off"
            className={styles.autocompleteModal}
            size="small"
            label="Familiya"
            fullWidth
            value={userData?.first_name || ""}
            onChange={(e) =>
              setSelectedUser({
                ...userData,
                first_name: e.target.value,
              })
            }
            required
          />
          <TextField
            autoComplete="off"
            className={styles.autocompleteModal}
            size="small"
            label="Ism"
            fullWidth
            value={userData?.name || ""}
            onChange={(e) =>
              setSelectedUser({
                ...userData,
                name: e.target.value,
              })
            }
            required
          />
          <TextField
            autoComplete="off"
            className={styles.autocompleteModal}
            size="small"
            label="Otasini ismi"
            fullWidth
            value={userData?.last_name || ""}
            onChange={(e) =>
              setSelectedUser({
                ...userData,
                last_name: e.target.value,
              })
            }
            required
          />
          <TextField
            autoComplete="off"
            className={styles.autocompleteModal}
            size="small"
            label="Izoh"
            fullWidth
            value={userData?.comment || ""}
            onChange={(e) =>
              setSelectedUser({ ...userData, comment: e.target.value })
            }
            required
          />
          <TextField
            autoComplete="off"
            className={styles.autocompleteModal}
            size="small"
            label="Telefon"
            fullWidth
            value={userData?.phone || ""}
            onChange={(e) =>
              setSelectedUser({ ...userData, phone: e.target.value })
            }
            required
          />
          <TextField
            autoComplete="off"
            className={styles.autocompleteModal}
            size="small"
            label="Rol"
            fullWidth
            value={userData?.role || ""}
            onChange={(e) =>
              setSelectedUser({ ...userData, role: e.target.value })
            }
            required
          />
          <TextField
            autoComplete="off"
            className={styles.autocompleteModal}
            size="small"
            label="Parol"
            fullWidth
            type="password"
            value={userData?.password || ""}
            onChange={(e) =>
              setSelectedUser({ ...userData, password: e.target.value })
            }
            required
          />
          <TextField
            autoComplete="off"
            className={styles.autocompleteModal}
            size="small"
            fullWidth
            type="file"
            onChange={(e: any) => {
              const file = e.target.files?.[0];
              if (file) {
                setAvatar(file);
              }
            }}
          />

          <button type="button" onClick={handleFormSubmit}>Saqlash</button>
        </div>
      </Modal>
    </>
  );
};

export default UserModalForm;
