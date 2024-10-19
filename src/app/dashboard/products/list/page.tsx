"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/utils/axiosInstance";
import CustomTable from "@/components/Table/Table";
import Title from "@/components/Title/Title";
import Modal from "@/components/Modal/Modal";
import { RootState, AppDispatch } from "@/store/store";
import { fetchProducts } from "@/features/products/products";
import Pagination from "@/components/Pagination/Pagination";
import styles from "./styles.module.scss";
import Search from "@/components/Search/Search";
import AddBtn from "@/components/Buttons/AddBtn/AddBtn";
import MyPagination from "@/components/Pagination/Pagination";
import { fetchAllCategories } from "@/features/productCategory/allCategories";

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status, error, pagination } = useSelector(
    (state: RootState) => state.products
  );
  const {
    categories,
    error: CError,
    status: CStatus,
  } = useSelector((state: RootState) => state.allCategories);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    total_measurement: "",
    current_measurement: "",
    category: "",
  });
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [id, setId] = useState("");
  const [pageSize, setPageSize] = useState(10); // Добавляем состояние для pageSize

  useEffect(() => {
    dispatch(
      fetchProducts({
        pageNumber: 1,
        pageSize: 10,
        searchTitle: search,
        searchable_title_id: id,
        category_id: category,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, []);
  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      const response = await axiosInstance.delete(
        `/products/delete/${selectedProduct.id}`
      );

      if (response.status < 300) {
        dispatch(
          fetchProducts({
            pageNumber: 1,
            pageSize: 10,
            searchTitle: search,
            searchable_title_id: id,
            category_id: category,
          })
        );
        setIsConfirmDeleteOpen(false);
      } else {
        console.error("Mahsulotni o'chirishda xatolik:", response.statusText);
      }
    } catch (error) {
      console.error("Mahsulotni o'chirishda xatolik:", error);
    }
  };

  const handleUpdate = (product: any) => {
    setIsEditMode(true);
    setSelectedProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      total_measurement: product.total_measurement,
      current_measurement: product.current_measurement,
      category: product.category,
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setIsEditMode(false);
    setSelectedProduct(null);
    setFormData({
      title: "",
      price: "",
      total_measurement: "",
      current_measurement: "",
      category: "",
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = isEditMode
      ? `/products/update/${selectedProduct.id}`
      : "/products/create";

    try {
      const response = await axiosInstance({
        method: isEditMode ? "patch" : "post",
        url: endpoint,
        data: formData,
      });

      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 204
      ) {
        dispatch(
          fetchProducts({
            pageNumber: 1,
            pageSize: 10,
            searchTitle: search,
            searchable_title_id: id,
            category_id: category,
          })
        );
        setIsModalOpen(false);
      } else {
        console.error("Mahsulotni saqlashda xatolik:", response.statusText);
      }
    } catch (error) {
      console.error("Mahsulotni saqlashda xatolik:", error);
    }
  };

  const titles = [
    "Nomi",
    "Narxi",
    "Umumiy o'lchov",
    "Hozirgi o'lchov",
    "Kategoriya",
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <Title>Mahsulotlar</Title>
        <div className={styles.right}>
          <AddBtn onClick={handleCreate} />
          <Search
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => {
              dispatch(
                fetchProducts({
                  pageNumber: 1,
                  pageSize: 10,
                  searchTitle: search,
                  searchable_title_id: id,
                  category_id: category,
                })
              );
            }}
            search={search}
          />
        </div>
      </div>

      {status === "loading" && <p>Yuklanmoqda...</p>}
      {status === "failed" && <p>Xatolik: {error}</p>}
      {status === "succeeded" && (
        <>
          <CustomTable
            keys={[
              "title",
              "price",
              "total_measurement",
              "current_measurement",
              "category",
            ]}
            titles={titles}
            data={products.map((product: any) => ({
              title: product.title,
              price: product.price,
              total_measurement: product.total_measurement,
              current_measurement: product.current_measurement,
              category: product.category_id.title,
            }))}
            onDelete={(product) => {
              setSelectedProduct(product);
              setIsConfirmDeleteOpen(true);
            }}
            onUpdate={handleUpdate}
          />
          <MyPagination
            currentPage={pagination.currentPage}
            onPageChange={(event, page) => {
              dispatch(
                fetchProducts({
                  pageNumber: pagination.currentPage,
                  pageSize: 10,
                  searchTitle: search,
                  searchable_title_id: id,
                  category_id: category,
                })
              );
            }}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={pagination.totalPages}
          />
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={isEditMode ? "Mahsulotni tahrirlash" : "Mahsulot yaratish"}
          >
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Mahsulot nomi"
                required
              />
              <input
                type="text"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="Narxi"
                required
              />
              <input
                type="text"
                value={formData.total_measurement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    total_measurement: e.target.value,
                  })
                }
                placeholder="Umumiy o'lchov"
                required
              />
              <input
                type="text"
                value={formData.current_measurement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    current_measurement: e.target.value,
                  })
                }
                placeholder="Hozirgi o'lchov"
                required
              />
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
                placeholder="Kategoriya ID"
                required
              />
              <button type="submit">
                {isEditMode ? "Yangilash" : "Yaratish"}
              </button>
            </form>
          </Modal>

          <Modal
            isOpen={isConfirmDeleteOpen}
            onClose={() => setIsConfirmDeleteOpen(false)}
            title="O'chirishni tasdiqlash"
          >
            <p>Ushbu mahsulotni o'chirishni xohlaysizmi?</p>
            <button onClick={handleDelete}>Ha, O'chirish</button>
            <button onClick={() => setIsConfirmDeleteOpen(false)}>
              Bekor qilish
            </button>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Page;
