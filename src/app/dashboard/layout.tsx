"use client";
import React, { useState } from "react";
import styles from "./Loyaut.module.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
const Loyaut = ({ children }: { children: React.ReactNode }) => {
  const [selected, setSelected] = useState<string>("home");

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
