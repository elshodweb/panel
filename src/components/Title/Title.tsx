import React from "react";
import styles from "./Title.module.scss";
const Title = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default Title;
