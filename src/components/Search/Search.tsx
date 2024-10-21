import React from "react";
import { FaSearch } from "react-icons/fa";
import styles from "./Search.module.scss";

const Search = ({
  onClick,
  onChange,
  search,
  placeholder,
}: {
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  search: string;
  placeholder?: string;
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onClick?.(event as any);
    }
  };
  return (
    <div className={styles.search}>
      <input
        type="text"
        value={search}
        placeholder={placeholder || "Qidirish"}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={onClick}>
        <FaSearch />
      </button>
    </div>
  );
};

export default Search;
