"use client";
import React, { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/utils/axiosInstance";
import CustomTable from "@/components/Table/Table";
import Title from "@/components/Title/Title";
import Modal from "@/components/Modal/Modal";
import { RootState, AppDispatch } from "@/store/store";
import { fetchProducts } from "@/features/products/products";
import styles from "./styles.module.scss";
import Search from "@/components/Search/Search";
import AddBtn from "@/components/Buttons/AddBtn/AddBtn";
import MyPagination from "@/components/Pagination/Pagination";
import { fetchAllCategories } from "@/features/productCategory/allCategories";
import { Autocomplete, Snackbar, TextField } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Loader from "@/components/Loader/Loader";
import ProductTable from "@/components/ProductTable/ProductTable";
const Alert = forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiAlert>>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  }
);
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    price: "",
    type: "dona",
    total_measurement: "",
    current_measurement: "",
    searchable_title_id: "",
    category: categories?.[0],
  });
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [id, setId] = useState("");
  const [category, setCategory] = useState<string>("");
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      fetchProducts({
        pageNumber: 1,
        pageSize: pageSize,
        searchTitle: search,
        searchable_title_id: id,
        category_id: category,
      })
    );
  }, [dispatch, pageSize]);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      const response = await axiosInstance.delete(
        `/product/delete/${selectedProduct.id}`
      );

      if (response.status < 300) {
        dispatch(
          fetchProducts({
            pageNumber: 1,
            pageSize: pageSize,
            searchTitle: search,
            searchable_title_id: id,
            category_id: category,
          })
        );
        setIsConfirmDeleteOpen(false);
        showSnackbar("Kategoriya muvaffaqiyatli oʻchirildi", "success");
      } else {
        showSnackbar("Kategoriyani o‘chirib bo‘lmadi", "error");
      }
    } catch (error) {
      showSnackbar("Kategoriyani oʻchirishda xatolik yuz berdi", "error");
    }
  };

  const handleUpdate = (product: any) => {
    setIsEditMode(true);

    setSelectedProduct(product);
    setFormData({
      id: product.id,
      title: product.title,
      price: product.price,
      type: product.type,
      searchable_title_id: product.searchable_title_id,
      total_measurement: parseFloat(product.total_measurement) + "",
      current_measurement: parseFloat(product.current_measurement) + "",
      category: { id: product.category_id, title: product.category },
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setIsEditMode(false);
    setSelectedProduct(null);
    setFormData({
      id: "",
      title: "",
      searchable_title_id: "",
      price: "",
      type: "dona",
      total_measurement: "",
      current_measurement: "",
      category: categories?.[0],
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = isEditMode
      ? `/product/update/${selectedProduct.id}`
      : "/product/create";

    try {
      const response = await axiosInstance({
        method: isEditMode ? "patch" : "post",
        url: endpoint,
        data: {
          id: formData.id,
          category_id: formData.category.id,
          title: formData.title,
          type: formData.type,
          price: formData.price,
          searchable_title_id: formData.searchable_title_id,
          current_measurement:
            formData.type === "metr" ? formData.current_measurement : "0",
          total_measurement:
            formData.type === "metr" ? formData.total_measurement : "0",
          current_quantity:
            formData.type === "dona" ? formData.current_measurement : "0",
          total_quantity:
            formData.type === "dona" ? formData.total_measurement : "0",
        },
      });

      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 204
      ) {
        dispatch(
          fetchProducts({
            pageNumber: 1,
            pageSize: pageSize,
            searchTitle: search,
            searchable_title_id: id,
            category_id: category,
          })
        );
        setIsModalOpen(false);
        showSnackbar(
          isEditMode
            ? "Kategoriya muvaffaqiyatli yangilandi"
            : "Kategoriya muvaffaqiyatli qo'shildi",
          "success"
        );
      } else {
        showSnackbar("Kategoriya saqlanmadi", "error");
      }
    } catch (error) {
      showSnackbar("Kategoriyani saqlanishida hato ketdi", "error");
    }
  };

  const onChangeCategorySelect = (event: any, value: any) => {
    if (value) {
      setCategory(value.id);
      dispatch(
        fetchProducts({
          pageNumber: 1,
          pageSize: pageSize,
          searchTitle: search,
          searchable_title_id: id,
          category_id: value.id,
        })
      );
    } else {
      setCategory("");
      dispatch(
        fetchProducts({
          pageNumber: 1,
          pageSize: pageSize,
          searchTitle: search,
          searchable_title_id: id,
          category_id: "",
        })
      );
    }
  };

  const titles = [
    "ID",
    "Nomi",
    "Narxi",
    "O'lchovi birligi",
    "Umumiy o'lchov",
    "Hozirgi o'lchov",
    "Kategoriya",
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.row}>
          <Title>Mahsulotlar</Title>
          <div className={styles.right}>
            <AddBtn onClick={handleCreate} />
            <Search
              onChange={(e) => {
                if (!isNaN(parseFloat(e.target.value))) {
                  setId(parseFloat(e.target.value) + "");
                  setSearch("");
                  dispatch(
                    fetchProducts({
                      pageNumber: 1,
                      pageSize: pageSize,
                      searchTitle: "",
                      searchable_title_id: parseFloat(e.target.value) + "",
                      category_id: category,
                    })
                  );
                } else {
                  setSearch(e.target.value);
                  setId("");
                  dispatch(
                    fetchProducts({
                      pageNumber: 1,
                      pageSize: pageSize,
                      searchTitle: e.target.value,
                      searchable_title_id: "",
                      category_id: category,
                    })
                  );
                }
              }}
              placeholder="Qidirish (Nomi, Id)"
              onClick={() => {
                dispatch(
                  fetchProducts({
                    pageNumber: 1,
                    pageSize: pageSize,
                    searchTitle: search,
                    searchable_title_id: id,
                    category_id: category,
                  })
                );
              }}
              search={search === "" ? id : search}
            />
          </div>
        </div>
        <Autocomplete
          className={styles.autocomplete}
          id="free-solo-demo"
          size="small"
          options={categories}
          onChange={onChangeCategorySelect}
          getOptionLabel={(option) => option.title}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              key={params.inputProps.id}
              label="Kategoriya"
            />
          )}
        />
      </div>

      {status === "loading" && <Loader />}
      {status === "failed" && <p>Xatolik: {error}</p>}
      {status === "succeeded" && (
        <>
          <ProductTable
            keys={[
              "searchable_title_id",
              "title",
              "price",
              "type",
              "total_measurement",
              "current_measurement",
              "category",
            ]}
            titles={titles}
            data={products.map((product: any) => ({
              id: product.id,
              searchable_title_id: product.searchable_title_id,
              title: product.title,
              price: product.price,
              type: product.type,
              total_measurement:
                product.type == "metr"
                  ? product.total_measurement + " metr"
                  : product.total_quantity + " dona",
              current_measurement:
                product.type == "metr"
                  ? product.current_measurement + " metr"
                  : product.current_quantity + " dona",
              category: product.category_id.title,
              category_id: product.category_id.id,
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
                  pageNumber: page,
                  pageSize: pageSize,
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
              <TextField
                label="Mahsulot nomi"
                className={styles.input}
                size="small"
                variant="outlined"
                fullWidth
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <TextField
                label="ID"
                className={styles.input}
                size="small"
                variant="outlined"
                fullWidth
                value={formData.searchable_title_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    searchable_title_id: e.target.value,
                  })
                }
                required
                type="number"
              />
              <TextField
                label="Narxi"
                className={styles.input}
                size="small"
                variant="outlined"
                fullWidth
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
                type="number"
              />
              <TextField
                label="Umumiy o'lchov"
                className={styles.input}
                size="small"
                variant="outlined"
                fullWidth
                value={formData.total_measurement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    total_measurement: e.target.value,
                  })
                }
                required
                type="number"
              />
              <TextField
                label="Hozirgi o'lchov"
                className={styles.input}
                size="small"
                variant="outlined"
                fullWidth
                value={formData.current_measurement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    current_measurement: e.target.value,
                  })
                }
                required
                type="number"
              />
              <Autocomplete
                className={styles.autocompleteModal}
                id="category-select"
                size="small"
                options={categories}
                defaultValue={formData.category}
                onChange={(event, value) => {
                  setFormData({
                    ...formData,
                    category: value || categories?.[0],
                  });
                }}
                getOptionLabel={(option) => option.title}
                renderInput={(params) => (
                  <TextField {...params} label="Kategoriya" />
                )}
              />
              <Autocomplete
                className={styles.autocompleteModal}
                id="category-select"
                size="small"
                options={["dona", "metr"]}
                defaultValue={formData.type}
                onChange={(event, value) => {
                  setFormData({
                    ...formData,
                    type: value || "dona",
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="O'lchov birligi" />
                )}
              />
              <button type="submit">
                {isEditMode ? "Yangilash" : "Yaratish"}
              </button>
            </form>
          </Modal>

          <Modal
            isOpen={isConfirmDeleteOpen}
            onClose={() => setIsConfirmDeleteOpen(false)}
            title="Mahsulotni o'chirish"
          >
            <p>Haqiqatan ham ushbu mahsulotni o'chirishni istaysizmi?</p>
            <button onClick={handleDelete}>O'chirish</button>
            <button onClick={() => setIsConfirmDeleteOpen(false)}>
              Bekor qilish
            </button>
          </Modal>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </>
      )}
    </div>
  );
};

export default Page;
