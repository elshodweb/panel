"use client";
import React, { FC, useEffect, useRef, useState } from "react";
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
  FaSignOutAlt,
  FaChartArea,
  FaChartBar,
  FaChartLine,
} from "react-icons/fa";
import { MdCancelPresentation } from "react-icons/md";
import styles from "./Sidebar.module.scss";
import { useRouter } from "next/navigation";
import Modal from "../Modal/Modal";

type MenuItem = {
  id: number;
  name: string;
  icon: JSX.Element;
  key: string;
  href?: string;
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
  const [role, setRole] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const sidebarRef = useRef<HTMLDivElement>(null);
  const handleOutsideClick = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node) &&
      isOpen
    ) {
      setIsOpen(false); // Закрываем sidebar, если клик произошёл за его пределами
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);
  useEffect(() => {
    const role = localStorage?.getItem("role");
    if (role) {
      setRole(role);
    }
  });
  const handleLogout = () => {
    localStorage?.removeItem("token");
    router.push("/login");
  };

  const menuItems: MenuItem[] =
    role === "user"
      ? [
          {
            id: 1,
            name: "Maxsulotlar",
            icon: <FaBox />,
            key: "maxsulotlar",
            children: [
              {
                id: 2,
                name: "Pr. Categories",
                icon: <FaTags />,
                key: "product-categories",
                href: "/dashboard/products/categories",
              },
              {
                id: 3,
                name: "Maxsulotlar",
                icon: <FaClipboardList />,
                key: "product-list",
                href: "/dashboard/products/list",
              },
            ],
          },
          {
            id: 4,
            name: "Sotuv",
            icon: <FaShoppingCart />,
            key: "sotuv",
            children: [
              {
                id: 5,
                name: "Harid qilish",
                icon: <FaCheck />,
                key: "harid-qilish",
                href: "/dashboard/sotuv/harid-qilish",
              },
              {
                id: 6,
                name: "Haridni tugatish",
                icon: <MdCancelPresentation />,
                key: "harid-tugatish",
                href: "/dashboard/sotuv/harid-tugatish",
              },
            ],
          },
          {
            id: 11,
            name: "Foydalanuvchilar",
            icon: <FaUsers />,
            key: "users",
            href: "/dashboard/users",
          },
          {
            id: 12,
            name: "Qarz",
            icon: <FaMoneyBillWave />,
            key: "qarz",
            href: "/dashboard/qarz",
          },
          {
            id: 13,
            name: "Mashina",
            icon: <FaCar />,
            key: "mashina",
            href: "/dashboard/mashina",
          },
        ]
      : [
          {
            id: 8,
            name: "Mashina",
            icon: <FaCar />,
            key: "yetkazib-berish-statistikasi",
            href: "/dashboard/statistics/car-service",
          },
          {
            id: 9,
            name: "Qarz",
            icon: <FaMoneyBillWave />,
            key: "qarz-statistikasi",
            href: "/dashboard/statistics/debt",
          },
          {
            id: 10,
            name: "Buyurtmalar",
            icon: <FaTags />,
            key: "buyurtmalar-statistikasi",
            href: "/dashboard/statistics/order",
          },
        ];

  const router = useRouter();

  return (
    <div
      ref={sidebarRef}
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
    >
      <button className={styles.toggleBtn} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaChevronLeft /> : <FaBars />}
      </button>
      <div className={styles.menuList}>
        {menuItems.map((item) => (
          <div key={item.id}>
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
      <div className={styles.logoutBtn} onClick={() => setIsModalOpen(true)}>
        <div className={styles.icon}>
          <FaSignOutAlt />
        </div>
        {isOpen && <span>Logout</span>}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tizimdan chiqishni tasdiqlash"
      >
        <p className={styles.text}>
          Haqiqatan ham tizimdan chiqishni xohlaysizmi?
        </p>
        <div className={styles.modalFooter}>
          <button onClick={handleLogout} className={styles.confirmButton}>
            Ha, Chiqish
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className={styles.cancelButton}
          >
            Bekor qilish
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
