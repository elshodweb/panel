// components/Loader.tsx
import React from "react";
import CircularProgress from "@mui/material/CircularProgress"; // Импортируем CircularProgress из Material-UI

const Loader: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <CircularProgress /> {/* Показываем индикатор загрузки */}
    </div>
  );
};

export default Loader;
