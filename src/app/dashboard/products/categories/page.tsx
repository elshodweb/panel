"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/utils/axiosInstance"; // Импортируем экземпляр axios
import CustomTable from "@/components/Table/Table";
import Title from "@/components/Title/Title";
import Modal from "@/components/Modal/Modal";
import { RootState, AppDispatch } from "@/store/store";
import { fetchProductCategories } from "@/features/productCategory/productCategorySlice";
import Pagination from "@/components/Pagination/Pagination";
import { FaFolderPlus, FaSearch } from "react-icons/fa";
import styles from "./styles.module.scss";
import Search from "@/components/Search/Search";
import AddBtn from "@/components/Buttons/AddBtn/AddBtn";
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
  useEffect(() => {
    dispatch(
      fetchProductCategories({ title: search, pageNumber: 1, pageSize: 10 })
    );
  }, [dispatch]);

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      const response = await axiosInstance.delete(
        `/product-categories/delete/${selectedCategory.id}`
      );

      if (response.status < 300) {
        dispatch(
          fetchProductCategories({ title: search, pageNumber: 1, pageSize: 10 })
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
          fetchProductCategories({ title: search, pageNumber: 1, pageSize: 10 })
        );
        setIsModalOpen(false);
      } else {
        console.error("Failed to save category:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const titles = ["title"];

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <Title>Categories</Title>
        <div className={styles.right}>
          <AddBtn onClick={handleCreate} />
          <Search
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => {
              dispatch(
                fetchProductCategories({
                  title: search,
                  pageNumber: pagination.currentPage,
                  pageSize: 10,
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
            titles={titles}
            data={categories}
            onDelete={(category) => {
              setSelectedCategory(category);
              setIsConfirmDeleteOpen(true); // Открываем модалку подтверждения
            }}
            onUpdate={handleUpdate}
          />
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(page) => {
              dispatch(
                fetchProductCategories({
                  title: search,
                  pageNumber: page,
                  pageSize: 10,
                })
              );
            }}
          />
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={isEditMode ? "Edit Category" : "Create Category"}
          >
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Category Title"
                required
              />
              <button type="submit">{isEditMode ? "Update" : "Create"}</button>
            </form>
          </Modal>

          <Modal
            isOpen={isConfirmDeleteOpen}
            onClose={() => setIsConfirmDeleteOpen(false)}
            title="Confirm Delete"
          >
            <p>Are you sure you want to delete this category?</p>
            <button onClick={handleDelete}>Yes, Delete</button>
            <button onClick={() => setIsConfirmDeleteOpen(false)}>
              Cancel
            </button>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Page;
