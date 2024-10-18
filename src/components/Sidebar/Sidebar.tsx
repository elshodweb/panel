"use client";
import React, { FC, useState } from "react";
import Link from "next/link"; // Import Link from Next.js
import {
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaMoneyBillWave,
  FaCar,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaClipboardList,
  FaTags,
  FaCheck,
} from "react-icons/fa";
import { MdCancelPresentation } from "react-icons/md";
import styles from "./Sidebar.module.scss";

type MenuItem = {
  id: number;
  name: string;
  icon: JSX.Element;
  key: string;
  href?: string; // Сделаем href опциональным для родительских элементов
  children?: MenuItem[];
};

type SidebarProps = {
  selected: string;
  setSelected: (key: string) => void;
};

const Sidebar: FC<SidebarProps> = ({ selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Products",
      icon: <FaBox />, // Иконка коробки для товаров
      key: "products",
      children: [
        {
          id: 11,
          name: "Pr. Categories",
          icon: <FaTags />, // Иконка для категорий продуктов
          key: "product-categories",
          href: "/dashboard/products/categories",
        },
        {
          id: 12,
          name: "Products",
          icon: <FaClipboardList />, // Иконка для списка продуктов
          key: "product-list",
          href: "/dashboard/products/list",
        },
      ],
    },
    {
      id: 2,
      name: "Users",
      icon: <FaUsers />, // Иконка пользователей
      key: "users",
      href: "/dashboard/users",
    },
    {
      id: 3,
      name: "Sotuv",
      icon: <FaShoppingCart />, // Иконка корзины для продаж
      key: "sotuv",
      children: [
        {
          id: 31,
          name: "Harid qilish",
          icon: <FaCheck />, // Иконка галочки для "Покупка"
          key: "harid-qilish",
          href: "/dashboard/sotuv/harid-qilish",
        },
        {
          id: 32,
          name: "Haridni tugatish",
          icon: <MdCancelPresentation />, // Иконка для завершения покупки
          key: "harid-tugatish",
          href: "/dashboard/sotuv/harid-tugatish",
        },
      ],
    },
    {
      id: 4,
      name: "Qarz",
      icon: <FaMoneyBillWave />, // Иконка денег для долгов
      key: "qarz",
      href: "/dashboard/qarz",
    },
    {
      id: 5,
      name: "Mashina",
      icon: <FaCar />, // Иконка машины
      key: "mashina",
      href: "/dashboard/mashina",
    },
  ];

  return (
    <div
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
    >
      <button className={styles.toggleBtn} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaChevronLeft /> : <FaBars />}
      </button>
      <div className={styles.menuList}>
        {menuItems.map((item) => (
          <div key={item.id}>
            {/* Если у элемента есть дочерние пункты, не делаем его ссылкой */}
            {item.children ? (
              <div
                className={`${styles.menuItem} ${
                  selected === item.key ? styles.active : ""
                }`}
                onClick={() => toggleSection(item.key)}
              >
                <div className={styles.icon}>{item.icon}</div>
                {isOpen && <span>{item.name}</span>}
                <FaChevronRight
                  className={`${styles.arrow} ${
                    openSections[item.key] ? styles.open : ""
                  }`}
                />
              </div>
            ) : (
              <Link href={item.href || "#"} passHref>
                <div
                  className={`${styles.menuItem} ${
                    selected === item.key ? styles.active : ""
                  }`}
                  onClick={() => {
                    setSelected(item.key);
                    setIsOpen(false);
                  }}
                >
                  <div className={styles.icon}>{item.icon}</div>
                  {isOpen && <span>{item.name}</span>}
                </div>
              </Link>
            )}

            {/* Отображаем дочерние пункты, если они есть */}
            {item.children && (
              <div
                className={`${styles.subMenu} ${
                  openSections[item.key] ? styles.open : styles.closed
                }`}
              >
                {item.children.map((subItem) => (
                  <Link href={subItem.href || "#"} passHref key={subItem.id}>
                    <div
                      className={`${styles.subMenuItem} ${
                        selected === subItem.key ? styles.active : ""
                      }`}
                      onClick={() => {
                        setSelected(subItem.key);
                        setIsOpen(false);
                      }}
                    >
                      <div className={styles.subIcon}>{subItem.icon}</div>
                      {isOpen && (
                        <span className={styles.span}>{subItem.name}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
