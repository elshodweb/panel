import React, { FC, useState } from "react";
import Link from "next/link";
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
} from "react-icons/fa";
import { MdCancelPresentation } from "react-icons/md";
import styles from "./Sidebar.module.scss";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal"; // Import your Modal component

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
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for showing modal
  const router = useRouter();

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Products",
      icon: <FaBox />,
      key: "products",
      children: [
        {
          id: 11,
          name: "Pr. Categories",
          icon: <FaTags />,
          key: "product-categories",
          href: "/dashboard/products/categories",
        },
        {
          id: 12,
          name: "Products",
          icon: <FaClipboardList />,
          key: "product-list",
          href: "/dashboard/products/list",
        },
      ],
    },
    {
      id: 2,
      name: "Users",
      icon: <FaUsers />,
      key: "users",
      href: "/dashboard/users",
    },
    {
      id: 3,
      name: "Sotuv",
      icon: <FaShoppingCart />,
      key: "sotuv",
      children: [
        {
          id: 31,
          name: "Harid qilish",
          icon: <FaCheck />,
          key: "harid-qilish",
          href: "/dashboard/sotuv/harid-qilish",
        },
        {
          id: 32,
          name: "Haridni tugatish",
          icon: <MdCancelPresentation />,
          key: "harid-tugatish",
          href: "/dashboard/sotuv/harid-tugatish",
        },
      ],
    },
    {
      id: 4,
      name: "Qarz",
      icon: <FaMoneyBillWave />,
      key: "qarz",
      href: "/dashboard/qarz",
    },
    {
      id: 5,
      name: "Mashina",
      icon: <FaCar />,
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
      <button
        className={styles.logoutBtn}
        onClick={() => setShowLogoutModal(true)} // Open modal on click
      >
        <FaSignOutAlt className={styles.icon} />
        {isOpen && <span>Logout</span>}
      </button>

      {/* Confirmation Modal for Logout */}
      {showLogoutModal && (
        <Modal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          title="Chiqish tasdiqlash"
        >
          <p className={styles.modalMessage}>Chiqmoqchimisiz?</p>
          <div className={styles.modalActions}>
            <button
              className={styles.cancelButton}
              onClick={() => setShowLogoutModal(false)}
            >
              {" "}
              Bekor qilish
            </button>
            <button
              onClick={() => {
                setShowLogoutModal(false);
                handleLogout();
              }}
              className={styles.confirmButton}
            >
              Tasdiqlash
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Sidebar;
