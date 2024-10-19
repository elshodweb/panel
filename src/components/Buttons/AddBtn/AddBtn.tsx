import React from "react";
import { FaFolderPlus } from "react-icons/fa";
import styles from "./AddBtn.module.scss"; // Импортируем стили как объект

const AddBtn = ({
  onClick,
}: {
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  return (
    <button className={styles.addBtn} onClick={onClick}>
      <FaFolderPlus className={styles.icon} />
      <span>Yaratish</span>
    </button>
  );
};

export default AddBtn;
