import React, { FC, useState } from "react";
import styles from "./TableForOrders.module.scss";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaCheck,
  FaUndo,
  FaAngellist,
  FaCheckDouble,
} from "react-icons/fa";
import Modal from "../Modal/Modal";
import { useRouter } from "next/navigation";

type TableForOrdersProps = {
  data: any[];
  onDelete: (order: any) => void;
  onUpdate: (order: any) => void;
};

const TableForOrders: FC<TableForOrdersProps> = ({
  data,
  onDelete,
  onUpdate,
}) => {
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useRouter();
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
  const titles = [
    "Buyurtmachi",
    "Kulik narxi",
    "Jami narxi",
    "To'langan",
    "Sana",
    "Mahsulot Soni",
    "Shafyor Soni",
    "Holati",
  ];

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
              <td className={styles.Item}>
                {" "}
                {`${row.user_id.name} ${row.user_id.last_name}`}
              </td>

              <td className={styles.Item}> {`${row.daily_price}.so'm`}</td>

              <td className={styles.Item}> {`${row.total_price}.so'm`}</td>

              <td className={styles.Item}> {`${row.paid_total}.so'm`}</td>

              <td className={styles.Item}>
                {" "}
                {` ${row.create_data.split("T")[0].replaceAll("-", ".")} `}
              </td>

              <td className={styles.Item}> {`${row.orderProducts.length} `}</td>
              <td className={styles.Item}> {`${row.carServices.length} `}</td>
              <td className={styles.Item}>
                {" "}
                {` ${row.IsActive == 1 ? "aktiv" : "aktiv emas"}`}
              </td>

              <td className={styles.Item}>
                <div className={styles.actions}>
                  <button
                    onClick={() =>
                      navigate.push(
                        "/dashboard/sotuv/harid-tugatish/tahrirlash/" + row.id
                      )
                    }
                  >
                    <FaEdit />
                  </button>
                  {row.IsActive == 1 ? (
                    <button onClick={() => onDelete(row)}>
                      <FaCheck />
                    </button>
                  ) : (
                    <button className={styles.undo}>
                      <FaCheckDouble />
                    </button>
                  )}
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
            <p className={styles.itmeModal}>
              <strong>{titles[0]}:</strong>
              <span>
                {" "}
                {`${selectedObject.user_id.name} ${selectedObject.user_id.last_name}`}
              </span>
            </p>

            <p className={styles.itmeModal}>
              <strong>{titles[1]}:</strong>
              <span> {`${selectedObject.daily_price}.so'm`}</span>
            </p>

            <p className={styles.itmeModal}>
              <strong>{titles[2]}:</strong>
              <span> {`${selectedObject.total_price}.so'm`}</span>
            </p>

            <p className={styles.itmeModal}>
              <strong>{titles[3]}:</strong>
              <span> {`${selectedObject.paid_total}.so'm`}</span>
            </p>

            <p className={styles.itmeModal}>
              <strong>{titles[4]}:</strong>
              <span>
                {" "}
                {`${selectedObject.create_data
                  .split("T")[0]
                  .replaceAll("-", ".")} `}
              </span>
            </p>

            <p className={styles.itmeModal}>
              <strong>{titles[5]}:</strong>
              <span> {`${selectedObject.orderProducts.length} `}</span>
            </p>
            <p className={styles.itmeModal}>
              <strong>{titles[6]}:</strong>
              <span> {`${selectedObject.carServices.length} `}</span>
            </p>
            <p className={styles.itmeModal}>
              <strong>{titles[7]}:</strong>
              <span>
                {" "}
                {` ${selectedObject.IsActive == 1 ? "aktiv" : "aktiv emas"}`}
              </span>
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TableForOrders;
