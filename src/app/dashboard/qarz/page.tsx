"use client";
import React, { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/utils/axiosInstance";
import CustomTable from "@/components/Table/Table";
import Title from "@/components/Title/Title";
import Modal from "@/components/Modal/Modal";
import { RootState, AppDispatch } from "@/store/store";
import { fetchDebts } from "@/features/debt/debt";
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

const Alert = forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiAlert>>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  }
);

const DebtPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { debts, status, error, pagination } = useSelector(
    (state: RootState) => state.debts
  );

  const {
    users,
    status: Ustatus,
    error: Uerror,
  } = useSelector((state: RootState) => state.users);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<any>(null);
  const [formData, setFormData] = useState({
    user_id: "",
    remaining_debt: "",
    isActive: false,
    comment: "",
    dayToBeGiven: "",
    dayGiven: "",
  });

    const setUser = (id: string) => {
      dispatch(fetchUsers({ pageNumber: 1, pageSize: 200, search: "null" }));
      setFormData({ ...formData, user_id: id });
    };
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchDebts({ pageNumber: 1, pageSize }));
    dispatch(fetchUsers({ pageNumber: 1, pageSize: 200, search: "null" }));
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

  const handleDelete = async () => {
    if (!selectedDebt) return;

    try {
      const response = await axiosInstance.delete(
        `/debt/delete/${selectedDebt.id}`
      );

      if (response.status < 300) {
        dispatch(fetchDebts({ pageNumber: 1, pageSize }));
        setIsConfirmDeleteOpen(false);
        showSnackbar("Debt successfully deleted", "success");
      } else {
        showSnackbar("Failed to delete debt", "error");
      }
    } catch (error) {
      showSnackbar("Error occurred while deleting debt", "error");
    }
  };

  const handleUpdate = (debt: any) => {
    setIsEditMode(true);
    setSelectedDebt(debt);

    setFormData({
      user_id: debt?.user_id?.id || "",
      comment: debt?.comment || "",
      dayGiven: debt?.dayGiven || "",
      dayToBeGiven: debt?.dayToBeGiven || "",
      isActive: debt?.isActive || "",
      remaining_debt: debt?.remaining_debt || "",
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setIsEditMode(false);
    setSelectedDebt(null);
    setFormData({
      user_id: "",
      comment: "",
      dayGiven: "",
      dayToBeGiven: "",
      isActive: false,
      remaining_debt: "",
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = isEditMode
      ? `/debt/update/${selectedDebt.id}`
      : "/debt/create";

    try {
      const response = await axiosInstance({
        method: isEditMode ? "patch" : "post",
        url: endpoint,
        data: { ...formData, isActive: "" + formData.isActive },
      });

      if (response.status >= 200 && response.status < 300) {
        dispatch(fetchDebts({ pageNumber: 1, pageSize }));
        setIsModalOpen(false);
        showSnackbar(
          isEditMode
            ? "Debt successfully updated"
            : "Debt successfully created",
          "success"
        );
      } else {
        showSnackbar("Failed to save debt", "error");
      }
    } catch (error) {
      showSnackbar("Error occurred while saving debt", "error");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <Title>Debts</Title>
        <div className={styles.right}>
          <AddBtn onClick={handleCreate} />
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

      {status === "loading" && (
        <div>
          <Loader />{" "}
        </div>
      )}
      {status === "failed" && <p>Error: {error}</p>}
      {status === "succeeded" && (
        <>
          <CustomTable
            keys={[
              "user_name",
              "user_phone",
              "remaining_debt",
              "comment",
              "isActive",
              "dayGiven",
              "dayToBeGiven",
            ]}
            titles={[
              "Foydalanuvchi",
              "F. Telefoni",
              "Qolgan Qarz",
              "Izoh",
              "Faol",
              "Berilgan Sana",
              "Qaytarish Sanasi",
            ]}
            data={debts.map((debt) => ({
              ...debt,
              user_name: debt.user_id
                ? `${debt.user_id.first_name} ${debt.user_id.name} `
                : "User yo'q",
              isActive: debt.isActive ? "Faol" : "Faol emas",
              user_phone: debt.user_id ? debt.user_id.phone : "User yo'q",
            }))}
            onDelete={(debt) => {
              setSelectedDebt(debt);
              setIsConfirmDeleteOpen(true);
            }}
            onUpdate={handleUpdate}
          />

          <MyPagination
            currentPage={pagination.currentPage}
            onPageChange={(event, page) => {
              dispatch(fetchDebts({ pageNumber: page, pageSize }));
            }}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={pagination.totalPages}
          />

          {/* Modal for Create and Update */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={isEditMode ? "Edit Debt" : "Create Debt"}
          >
            <form onSubmit={handleFormSubmit}>
              {/* Remaining Debt */}
              <TextField
                label="Remaining Debt"
                value={formData.remaining_debt}
                onChange={(e) =>
                  setFormData({ ...formData, remaining_debt: e.target.value })
                }
                fullWidth
                margin="normal"
              />

              {/* Comment */}
              <TextField
                label="Comment"
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                fullWidth
                margin="normal"
              />

              {/* Date to be Given */}
              <TextField
                label="Date to be Given"
                type="date"
                value={formData.dayToBeGiven}
                onChange={(e) =>
                  setFormData({ ...formData, dayToBeGiven: e.target.value })
                }
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />

              {/* Date Given */}
              <TextField
                label="Date Given"
                type="date"
                value={formData.dayGiven}
                onChange={(e) =>
                  setFormData({ ...formData, dayGiven: e.target.value })
                }
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />

              {/* isActive */}
              <FormControl fullWidth margin="normal">
                <InputLabel id="isActive-label">Active Status</InputLabel>
                <Select
                  labelId="isActive-label"
                  value={formData.isActive ? "true" : "false"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.target.value === "true",
                    })
                  }
                  label="Active Status"
                >
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>

              {/* User Selection */}
              <FormControl fullWidth margin="normal">
                <InputLabel id="users-label">User</InputLabel>
                <Select
                  labelId="users-label"
                  value={formData.user_id}
                  onChange={(e) =>
                    setFormData({ ...formData, user_id: e.target.value })
                  }
                  label="User"
                  required
                >
                  {users.map((user, i) => (
                    <MenuItem key={i} value={user.id}>
                      {user.first_name} {user.name} ({user.phone})
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
                {isEditMode ? "Save" : "Create"}
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

export default DebtPage;
