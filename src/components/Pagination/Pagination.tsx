import React from "react";
import styles from "./Pagination.module.scss";
import { FormControl, MenuItem, Pagination, Select } from "@mui/material";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (event: any, page: number) => void;
  pageSize: number;
  setPageSize: (n: number) => void;
}

const MyPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  setPageSize,
}) => {
  return (
    <div className={styles.paginationWrapper}>
      <Pagination
        count={totalPages}
        page={currentPage}
        size="small"
        siblingCount={0}
        onChange={onPageChange}
      />

      <FormControl className={styles.pageSizeControl}>
        <Select
          size="small"
          labelId="page-size-label"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default MyPagination;
