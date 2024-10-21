"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/utils/axiosInstance";
import CustomTable from "@/components/Table/Table";
import Title from "@/components/Title/Title";
import Modal from "@/components/Modal/Modal";
import { RootState, AppDispatch } from "@/store/store";
import { fetchProductCategories } from "@/features/productCategory/productCategorySlice";
import styles from "./styles.module.scss";
import Search from "@/components/Search/Search";
import AddBtn from "@/components/Buttons/AddBtn/AddBtn";
import MyPagination from "@/components/Pagination/Pagination";

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, status, error, pagination } = useSelector(
    (state: RootState) => state.productCategories
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ title: "" });
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      fetchProductCategories({ title: search, pageNumber: 1, pageSize })
    );
  }, [dispatch, pageSize]);

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      const response = await axiosInstance.delete(
        `/product-categories/delete/${selectedCategory.id}`
      );

      if (response.status < 300) {
        dispatch(
          fetchProductCategories({ title: search, pageNumber: 1, pageSize })
        );
        setIsConfirmDeleteOpen(false);
      } else {
        console.error("Failed to delete category:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleUpdate = (category: any) => {
    setIsEditMode(true);
    setSelectedCategory(category);
    setFormData({ title: category.title });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setIsEditMode(false);
    setSelectedCategory(null);
    setFormData({ title: "" });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = isEditMode
      ? `/product-categories/update/${selectedCategory.id}`
      : "/product-categories/create";

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
          fetchProductCategories({ title: search, pageNumber: 1, pageSize })
        );
        setIsModalOpen(false);
      } else {
        console.error("Failed to save category:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const titles = ["Nomi"];

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <Title>Categoriyalar</Title>
        <div className={styles.right}>
          <AddBtn onClick={handleCreate} />
          <Search
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => {
              dispatch(
                fetchProductCategories({
                  title: search,
                  pageNumber: pagination.currentPage,
                  pageSize,
                })
              );
            }}
            search={search}
          />
        </div>
      </div>

      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Error: {error}</p>}
      {status === "succeeded" && (
        <>
          <CustomTable
            keys={["title"]}
            titles={titles}
            data={categories}
            onDelete={(category) => {
              setSelectedCategory(category);
              setIsConfirmDeleteOpen(true);
            }}
            onUpdate={handleUpdate}
          />

          <MyPagination
            currentPage={pagination.currentPage}
            onPageChange={(event, page) => {
              dispatch(
                fetchProductCategories({
                  title: search,
                  pageNumber: page,
                  pageSize,
                })
              );
            }}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={pagination.totalPages}
          />

          {/* Модальное окно для создания/редактирования */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={
              isEditMode ? "Categoriya o'zgartirish" : "Categoriya yaratish"
            }
          >
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Categoriya nomi"
                required
              />
              <button type="submit">
                {isEditMode ? "O'zgartirish" : "Yaratish"}
              </button>
            </form>
          </Modal>

          {/* Модальное окно для подтверждения удаления */}
          <Modal
            isOpen={isConfirmDeleteOpen}
            onClose={() => setIsConfirmDeleteOpen(false)}
            title="O'chirishni Tasdiqlash"
          >
            <p>Ushbu kategoriyani o‘chirishga ishonchingiz komilmi?</p>
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
