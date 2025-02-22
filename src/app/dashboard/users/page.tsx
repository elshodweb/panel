"use client";
import React, { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/utils/axiosInstance";
import CustomTable from "@/components/Table/Table";
import Title from "@/components/Title/Title";
import Modal from "@/components/Modal/Modal";
import { RootState, AppDispatch } from "@/store/store";
import { fetchUsers } from "@/features/users/users";
import styles from "./styles.module.scss";
import Search from "@/components/Search/Search";
import AddBtn from "@/components/Buttons/AddBtn/AddBtn";
import MyPagination from "@/components/Pagination/Pagination";
import { Snackbar, TextField } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Image from "next/image";
import Loader from "@/components/Loader/Loader";
import Link from "next/link";

const CircularImage = ({ src }: { src: string }) => (
  <Link target="_blank" href={src} className={styles.circularImage}>
    <Image width={50} height={50} src={src} alt="User" />
  </Link>
);

const Alert = forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiAlert>>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  }
);

const UsersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, status, error, pagination } = useSelector(
    (state: RootState) => state.users
  );
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [avatar, setAvatar] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchUsers({ pageNumber: currentPage, pageSize, search: search }));
  }, [dispatch, pageSize]);

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

  const handleUpdate = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setIsEditMode(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("first_name", selectedUser?.first_name || "");
    formData.append("name", selectedUser?.name || "");
    formData.append("last_name", selectedUser?.last_name || "");
    formData.append("comment", selectedUser?.comment || "");
    formData.append("phone", selectedUser?.phone || "");
    formData.append("role", selectedUser?.role || "");
    formData.append("password", selectedUser?.password || "");

    if (avatar) {
      formData.append("image", avatar);
    }

    const endpoint = isEditMode
      ? `/Auth/user/update/${selectedUser.id}`
      : "/Auth/user/register";

    try {
      const response = await axiosInstance({
        method: isEditMode ? "patch" : "post",
        url: endpoint,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data", // Указываем правильный тип контента
        },
      });

      if (response.status < 300) {
        dispatch(
          fetchUsers({
            pageNumber: currentPage,
            pageSize,
            search: search,
          })
        );
        setIsModalOpen(false);
        showSnackbar(
          isEditMode
            ? "Foydalanuvchi muvaffaqiyatli yangilandi"
            : "Foydalanuvchi muvaffaqiyatli qo'shildi",
          "success"
        );
      } else {
        showSnackbar("Foydalanuvchini saqlashda xato", "error");
      }
    } catch (error) {
      showSnackbar("Foydalanuvchini saqlashda xatolik yuz berdi", "error");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(
        `/Auth/deleteUser/${selectedUser.id}`
      );

      if (response.status < 300) {
        dispatch(
          fetchUsers({
            pageNumber: currentPage,
            pageSize,
            search: search,
          })
        );
        setIsConfirmDeleteOpen(false);
        showSnackbar("Foydalanuvchi muvaffaqiyatli o'chirildi", "success");
      } else {
        showSnackbar("Foydalanuvchini o'chirishda xato", "error");
      }
    } catch (error) {
      showSnackbar("Foydalanuvchini o'chirishda xatolik yuz berdi", "error");
    }
  };

  const titles = [
    "Rasm",
    "Familiya",
    "Ism",
    "Otasini ismi",
    "Izoh",
    "Telefon",
    "Rol",
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Title>Foydalanuvchilar</Title>
        <div className={styles.row}>
          <AddBtn onClick={handleCreate} />
          <Search
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);

              dispatch(
                fetchUsers({
                  pageNumber: 1,
                  pageSize,
                  search: e.target.value,
                })
              );
            }}
            placeholder="Qidirish"
            search={search}
            onClick={() => {
              setCurrentPage(1);
              dispatch(fetchUsers({ pageNumber: 1, pageSize, search: search }));
            }}
          />
        </div>
      </div>

      {status === "loading" && <Loader />}
      {status === "failed" && <p>Xatolik: {error}</p>}
      {status === "succeeded" && (
        <>
          <CustomTable
            keys={[
              "image",
              "first_name",
              "name",
              "last_name",
              "comment",
              "phone",
              "role",
            ]}
            titles={titles}
            data={users
              .filter((i) => i.role === "user")
              .map((user: any) => ({
                id: user.id,
                image: (
                  <CircularImage
                    src={
                      user?.img?.includes("https") ? user.img : "/profile.jpg"
                    }
                  />
                ),
                first_name: user.first_name,
                name: user.name,
                last_name: user.last_name,
                comment: user.comment,
                phone: user.phone,
                role: user.role,
              }))}
            onUpdate={handleUpdate}
            onDelete={(user) => {
              setSelectedUser(user);
              setIsConfirmDeleteOpen(true);
            }}
          />
          <MyPagination
            currentPage={currentPage}
            onPageChange={(event, page) => {
              setCurrentPage(page);
              dispatch(
                fetchUsers({
                  pageNumber: page,
                  pageSize,
                  search: search,
                })
              );
            }}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={pagination.totalPages}
          />
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={
              selectedUser
                ? "Foydalanuvchini tahrirlash"
                : "Foydalanuvchi yaratish"
            }
          >
            <form onSubmit={handleFormSubmit}>
              <TextField
                className={styles.autocompleteModal}
                size="small"
                label="Familiya"
                fullWidth
                value={selectedUser?.first_name || ""}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    first_name: e.target.value,
                  })
                }
                required
              />
              <TextField
                className={styles.autocompleteModal}
                size="small"
                label="Ism"
                fullWidth
                value={selectedUser?.name || ""}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    name: e.target.value,
                  })
                }
                required
              />
              <TextField
                className={styles.autocompleteModal}
                size="small"
                label="Otasini ismi"
                fullWidth
                value={selectedUser?.last_name || ""}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    last_name: e.target.value,
                  })
                }
                required
              />
              <TextField
                className={styles.autocompleteModal}
                size="small"
                label="Izoh"
                fullWidth
                value={selectedUser?.comment || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, comment: e.target.value })
                }
                required
              />
              <TextField
                className={styles.autocompleteModal}
                size="small"
                label="Telefon"
                fullWidth
                value={selectedUser?.phone || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, phone: e.target.value })
                }
                required
              />
              <TextField
                className={styles.autocompleteModal}
                size="small"
                label="Rol"
                fullWidth
                value={selectedUser?.role || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, role: e.target.value })
                }
                required
              />
              <TextField
                className={styles.autocompleteModal}
                size="small"
                label="Parol"
                fullWidth
                type="password"
                value={selectedUser?.password || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, password: e.target.value })
                }
                required
              />
              <TextField
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

              <button type="submit">Saqlash</button>
            </form>
          </Modal>
        </>
      )}

      <Modal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        title="Mahsulotni o'chirish"
      >
        <p>Haqiqatan ham ushbu mahsulotni o'chirishni istaysizmi?</p>
        <button onClick={handleDelete}>O'chirish</button>
        <button onClick={() => setIsConfirmDeleteOpen(false)}>
          Bekor qilish
        </button>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UsersPage;
