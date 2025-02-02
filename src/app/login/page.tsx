"use client";
import React, { useEffect, useState } from "react";
import { Button, TextField, Box, Typography, Paper } from "@mui/material";
import { AiFillLock } from "react-icons/ai";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation"; // Импорт для навигации

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Используем useRouter для перенаправления

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const response: any = await axiosInstance.post("/Auth/user/signIn", {
        phone,
        password,
      });
      const { token, role } = response.data;
      localStorage?.setItem("token", token);
      localStorage?.setItem("role", role);
      setPhone("");
      setPassword("");
      setError("");
      if (role === "admin") {
        router.push("/dashboard/statistics/car-service");
      } else if (role === "user") {
        router.push("/dashboard/products/categories");
      }
    } catch (err) {
      setError("Noto'g'ri telefon raqami yoki parol. Qayta urinib ko'ring.");
      console.error(err);
    }
  };
  useEffect(() => {
    const token = localStorage?.getItem("token");
    const role = localStorage?.getItem("role");

    if (token) {
      if (role === "admin") {
        router.push("/dashboard/statistics/car-service");
      } else if (role === "user") {
        router.push("/dashboard/products/categories");
      } else {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  });
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f0f2f5"
      padding={"10px"}
    >
      <Paper elevation={3} style={{ padding: "2rem", width: "400px" }}>
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <AiFillLock size={50} color="#1976d2" />
        </Box>

        <Typography variant="h5" align="center" gutterBottom>
          Tizimga kirish
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            label="Telefon raqami"
            variant="outlined"
            fullWidth
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <TextField
            label="Parol"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "1rem" }}
          >
            Kirish
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
