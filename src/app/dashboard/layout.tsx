"use client";
import React, { useEffect, useState } from "react";
import styles from "./Loyaut.module.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
const Loyaut = ({ children }: { children: React.ReactNode }) => {
  const [selected, setSelected] = useState<string>("home");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage?.getItem("token");
    const role = localStorage?.getItem("role");

    if (token) {
      if (role === "admin") {
        axiosInstance
          .get("/car-service/statistic")
          .catch((err) => {
            if (err.status === 403 || 401) {
              router.push("/login");
              localStorage.removeItem("token");
              localStorage.removeItem("role");
            }
          });
      } else if (role === "user") {
        axiosInstance
        .get("/debt/all?pageNumber=1&pageSize=10")
        .catch((err) => {
          if (err.status === 403 || 401) {
            router.push("/login");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
          }
        });
      } else {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  });
  return (
    <div className={styles.layout}>
      <div className={styles.navbar}>
        <Sidebar selected={selected} setSelected={setSelected} />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Loyaut;
