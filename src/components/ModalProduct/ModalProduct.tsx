import React from "react";
import { MdClose } from "react-icons/md";
import styles from "./ModalProduct.module.scss";

interface ModalProductProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  type?: string;
}

const ModalProduct: React.FC<ModalProductProps> = ({
  isOpen,
  onClose,
  title,
  children,
  type,
}) => {
  if (!isOpen) return null;

  return (
    <div className={`${styles.modal}`} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${type ? styles[type] : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <MdClose size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ModalProduct;
