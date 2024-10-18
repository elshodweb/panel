import React from "react";
import { FaSearch } from "react-icons/fa";
import styles from "./Search.module.scss"; // Импортируем стили как объект

const Search = ({
  onClick,
  onChange,
  search,
}: {
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  search: string;
}) => {
  return (
    <div className={styles.search}>
      <input
        type="text"
        value={search}
        placeholder="search"
        onChange={onChange}
      />
      <button onClick={onClick}>
        <FaSearch />
      </button>
    </div>
  );
};

export default Search;
