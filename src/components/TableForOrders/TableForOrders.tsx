import React, { FC, useState } from "react";
import styles from "./TableForOrders.module.scss";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Modal from "../Modal/Modal";

type TableForOrdersProps = {
  data: any[];
  onDelete: (order: any) => void;
  onUpdate: (order: any) => void;
};

const TableForOrders: FC<TableForOrdersProps> = ({
  titles,
  data,
  keys,
  onDelete,
  onUpdate,
}) => {
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = (row: any) => {
    setSelectedObject(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedObject(null);
  };

  if (data?.length < 1) {
    return "no data";
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {titles.map((title, index) => (
              <th key={index}>{title}</th>
            ))}
            <th className={styles.actionsTitle}>Amalar</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {keys.map((key, index) => {
                return <td key={index}>{row[key]}</td>;
              })}
              <td>
                <div className={styles.actions}>
                  <button onClick={() => onUpdate(row)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => onDelete(row)}>
                    <FaTrash />
                  </button>
                  <button onClick={() => handleView(row)}>
                    <FaEye />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && selectedObject && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Ko'proq malumot"
        >
          <div className={styles.modalContent}>
            {keys.map((key, index) => (
              <p key={index}>
                <strong>{titles[index]}:</strong> {selectedObject[key]}
              </p>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TableForOrders;
