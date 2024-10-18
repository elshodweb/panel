import React from "react";
import styles from "./Pagination.module.scss"; // Импортируем стили

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };
  if (totalPages === 0) {
    return "";
  }
  return (
    <div className={styles.pagination}>
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => handlePageClick(index + 1)}
          className={currentPage === index + 1 ? styles.active : ""}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
