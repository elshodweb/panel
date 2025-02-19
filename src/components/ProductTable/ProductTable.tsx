import React, { FC, useState } from "react";
import styles from "./ProductTable.module.scss";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Modal from "../Modal/Modal";
import axiosInstance from "@/utils/axiosInstance";
import ModalProduct from "../ModalProduct/ModalProduct";

type ProductTableProps = {
  titles: string[];
  keys: string[];
  data: any[];
  onDelete: (category: any) => void;
  onUpdate: (category: any) => void;
};

const ProductTable: FC<ProductTableProps> = ({
  titles,
  data,
  keys,
  onDelete,
  onUpdate,
}) => {
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = async (row: any) => {
    if (row?.id) {
      const response = await axiosInstance.get("/product/one/" + row.id);
      setSelectedObject(response.data);
      console.log(response.data);
    }

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
        <ModalProduct
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Ko'proq malumot"
          type="product"
        >
          <div className={styles.modalContent}>
            <p>
              <strong>ID</strong>: {selectedObject.searchable_title_id}
            </p>
            <p>
              <strong>Nomi</strong>: {selectedObject.title}
            </p>
            <p>
              <strong>Narxi</strong>: {selectedObject.price}
            </p>
            <p>
              <strong>O'lchanadi</strong>: {selectedObject.type}da
            </p>
            <p>
              <strong>Bor</strong>:{" "}
              {(selectedObject.type === "metr"
                ? selectedObject.current_measurement
                : selectedObject.current_quantity) +
                " " +
                selectedObject.type}
            </p>
            <p>
              <strong>Umumiy</strong>:{" "}
              {(selectedObject.type === "metr"
                ? selectedObject.total_measurement
                : selectedObject.total_quantity) + selectedObject.type}
            </p>
            <p>
              <strong>Kategoriya</strong>: {selectedObject.category_id.title}
            </p>
          </div>
          {selectedObject?.productItems?.length > 0 && (
            <div className={styles.modalTable}>
              <table>
                <thead>
                  <tr>
                    <th>Berilgan sana</th>
                    <th>Tugash sanasi</th>
                    <th>Sotilgan miqdor</th>
                    <th>O'lchov bo'yicha sotilgan</th>
                    <th>Kundalik narx</th>
                    <th>Umumiy buyurtma narxi</th>
                    <th>Kundalik buyurtma narxi</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedObject.productItems?.map(
                    (item: any, index: number) => (
                      <tr key={index}>
                        <td>{item.given_date}</td>
                        <td>{item.end_date}</td>
                        <td>{item.quantity_sold}</td>
                        <td>{item.measurement_sold}</td>
                        <td>{item.price_per_day}</td>
                        <td>{item.order_id?.total_price}</td>
                        <td>{item.order_id?.daily_price}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </ModalProduct>
      )}
    </div>
  );
};

export default ProductTable;
