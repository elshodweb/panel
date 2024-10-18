import React, { FC } from "react";
import styles from "./Table.module.scss";
import { FaEdit, FaTrash } from "react-icons/fa";

type CustomTableProps = {
  titles: string[];
  data: any[];
  onDelete: (category: any) => void; // Изменено на передачу всей категории
  onUpdate: (category: any) => void;
};

const CustomTable: FC<CustomTableProps> = ({
  titles,
  data,
  onDelete,
  onUpdate,
}) => {
  console.log("====================================");
  console.log(data);
  console.log("====================================");
  if (data?.length < 1){
    return 'no data'
  }
    return (
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {titles.map((title, index) => (
                <th key={index}>{title}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {titles.map((title, index) => (
                  <td key={index}>{row[title]}</td>
                ))}
                <td className={styles.actions}>
                  <button onClick={() => onUpdate(row)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => onDelete(row)}>
                    <FaTrash />
                  </button>{" "}
                  {/* Передаем всю категорию */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
};

export default CustomTable;
