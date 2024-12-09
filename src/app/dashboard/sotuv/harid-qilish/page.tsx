"use client";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Title from "@/components/Title/Title";
import { Autocomplete, TextField, Button, InputAdornment } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchUsers } from "@/features/users/users";
import { fetchProducts } from "@/features/products/products";
import { fetchProductCategories } from "@/features/productCategory/productCategorySlice";
import {
  FaBox,
  FaCar,
  FaCartPlus,
  FaPlus,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { fetchCarServices } from "@/features/cars/cars";

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    users,
    error: userError,
    status: userStatus,
  } = useSelector((state: RootState) => state.users);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [phone, setPhone] = useState("");

  const { categories } = useSelector(
    (state: RootState) => state.productCategories
  );
  const { products } = useSelector((state: RootState) => state.products);

  const [sections, setSections] = useState([
    {
      selectedCategory: null,
      categoryTitle: "",
      selectedProduct: null,
      productTitle: "",
      quantity: 1, // Для количества продукта
      rentalDays: 1, // Для дней аренды
      totalPrice: 0, // Для вычисленной стоимости аренды
      type: "",
      price: 0,
      startDate: "", // Добавляем дату начала аренды
      endDate: "", // Добавляем дату конца аренды
    },
  ]);
  const { carServices, status, error } = useSelector(
    (state: RootState) => state.carServices
  );
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [driverComment, setDriverComment] = useState("");


  useEffect(() => {
    dispatch(
      fetchUsers({
        pageNumber: 1,
        pageSize: 100,
        phone: phone,
        role: "null",
      })
    );
  }, [dispatch, phone]);

  const updateProducts = (
    index: number,
    categoryId: string | null,
    productTitle: string
  ) => {
    dispatch(
      fetchProducts({
        pageNumber: 1,
        pageSize: 100,
        searchTitle: productTitle,
        searchable_title_id: "null",
        category_id: categoryId || "null",
      })
    );
  };

  useEffect(() => {
    dispatch(
      fetchProductCategories({
        pageNumber: 1,
        pageSize: 100,
        title: "",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        pageNumber: 1,
        pageSize: 100,
        searchTitle: "",
        category_id: "null",
        searchable_title_id: "",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchCarServices({
        pageNumber: 1,
        pageSize: 100,
        profit_or_expense: "null",
      })
    );
  }, [dispatch]);

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      {
        selectedCategory: null,
        categoryTitle: "",
        selectedProduct: null,
        productTitle: "",
        quantity: 1,
        rentalDays: 1,
        totalPrice: 0,
        price: 0,
        type: "",
        startDate: "", // Начальная дата
        endDate: "", // Конечная дата
      },
    ]);
  };

  const handleRemoveSection = (index: number) => {
    if (sections.length > 1) {
      setSections((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleChangeCategory = (index: number, value: any) => {
    const newSections = [...sections];
    newSections[index].selectedCategory = value;
    newSections[index].categoryTitle = value?.title || "";
    newSections[index].productTitle = "";
    newSections[index].type = "";
    newSections[index].price = 0;

    newSections[index].selectedProduct = null;

    setSections(newSections);
    updateProducts(index, value?.id, newSections[index].productTitle);
  };

  const handleChangeProductTitle = (index: number, value: string) => {
    const newSections: any = [...sections];
    newSections[index].productTitle = value;
    updateProducts(
      index,
      newSections[index].selectedCategory?.id || null,
      value
    );
  };

  const handleSelectProduct = (index: number, value: any) => {
    const newSections = [...sections];
    newSections[index].selectedProduct = value;
    newSections[index].totalPrice = 0;
    newSections[index].totalPrice = value.price;
    newSections[index].price = value.price;
    newSections[index].type = value.type;
    setSections(newSections);
  };

  const handleQuantityChange = (index: number, value: number) => {
    const newSections = [...sections];
    newSections[index].quantity = value;
    updateTotalPrice(index, newSections[index]);
    setSections(newSections);
  };

  const handleRentalDaysChange = (index: number, value: number) => {
    const newSections = [...sections];
    newSections[index].rentalDays = value;
    updateTotalPrice(index, newSections[index]);
    setSections(newSections);
  };

  const updateTotalPrice = (index: number, section: any) => {
    if (section.selectedProduct) {
      const totalPrice = section.selectedProduct.price * section.quantity;
      const newSections = [...sections];
      newSections[index].totalPrice = totalPrice;
      setSections(newSections);
    }
  };
  const handleStartDateChange = (index: number, date: string) => {
    const newSections = [...sections];
    newSections[index].startDate = date;

    if (newSections[index].endDate) {
      const startDate = new Date(date); // The start date is coming from the TextField value
      const endDate = new Date(newSections[index].endDate); // The end date is from the section
      const rentalDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      ); // Correctly calculate the number of days

      newSections[index].rentalDays = rentalDays;
    }

    setSections(newSections);
  };

  const handleEndDateChange = (index: number, date: string) => {
    const newSections = [...sections];
    newSections[index].endDate = date;
    if (newSections[index].startDate) {
      const startDate = new Date(newSections[index].startDate); // Start date from section
      const endDate = new Date(date); // End date from user input (or wherever `date` comes from)
      const rentalDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      ); // Calculate rental days in full days

      newSections[index].rentalDays = rentalDays; // Update rentalDays in the section
    }

    setSections(newSections);
  };

  const handleCarSelect = (car: any) => {
    setSelectedCar(car); // Обновляем выбранную машину
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDriverComment(e.target.value); // Обновляем комментарий для водителя
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <Title>Harid qilish</Title>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h4 className={styles.title}>
            Foydalanuvchi tanlash <FaUser size={19} />{" "}
          </h4>
          <Autocomplete
            className={styles.autocomplete}
            id="user-selection-autocomplete"
            size="small"
            options={users}
            onChange={(event, value) => setSelectedUser(value)}
            getOptionLabel={(option: any) =>
              `${option.name || "Без имени"} (${
                option.phone || "Нет телефона"
              })`
            }
            isOptionEqualToValue={(option, value) =>
              option.phone === value.phone
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Telefon nomer"
                variant="outlined"
                onChange={(e) => setPhone(e.target.value)}
              />
            )}
          />
          {selectedUser && (
            <div>
              <h5>Tanlangan foydalanuvchi</h5>
              <p>Ism: {selectedUser.name}</p>
              <p>Telefon: {selectedUser.phone}</p>
            </div>
          )}
        </div>

        {sections.map((section, index) => (
          <div key={index} className={styles.product}>
            <h2>
              {index + 1}-Mahsulot <FaBox size={19} />
            </h2>
            <div className={styles.productRow}>
              <div className={styles.left}>
                <h4 className={styles.title}>
                  Mahsulot kategoriyasini tanlash
                </h4>
                <Autocomplete
                  className={styles.autocomplete}
                  size="small"
                  options={categories}
                  onChange={(event, value) =>
                    handleChangeCategory(index, value)
                  }
                  getOptionLabel={(option) => option.title || "Без названия"}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Kategoriya"
                      variant="outlined"
                    />
                  )}
                />
              </div>
              <div className={styles.right}>
                <h4 className={styles.title}>Mahsulotni tanlash</h4>
                <Autocomplete
                  className={styles.autocomplete}
                  size="small"
                  options={products}
                  onChange={(event, value) => handleSelectProduct(index, value)}
                  getOptionLabel={(option) => option.title || "Без названия"}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Mahsulot"
                      variant="outlined"
                      onChange={(e) =>
                        handleChangeProductTitle(index, e.target.value)
                      }
                    />
                  )}
                />
              </div>
            </div>

            {section.selectedProduct && (
              <>
                <div className={styles.productRow}>
                  <div className={styles.left}>
                    <h4 className={styles.title}>{section.type + " Narxi"}</h4>
                    <TextField
                      type="number"
                      variant="outlined"
                      value={section.price}
                      disabled
                    />
                  </div>
                  <div className={styles.right}>
                    <h4 className={styles.title}>Arenda olish miqdori</h4>
                    <TextField
                      type="number"
                      variant="outlined"
                      value={section.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, +e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className={styles.productRow}>
                  <div className={styles.left}>
                    <h4 className={styles.title}>Arenda kunlik narxi</h4>
                    <TextField
                      type="number"
                      variant="outlined"
                      value={sections[index].totalPrice}
                      disabled
                    />
                  </div>
                  <div className={styles.right}>
                    <h4 className={styles.title}>Arenda boshlanishi</h4>
                    <TextField
                      type="date"
                      variant="outlined"
                      value={section.startDate}
                      onChange={(e) =>
                        handleStartDateChange(index, e.target.value)
                      }
                    />
                    <h4 className={styles.title}>Arenda tugashi</h4>
                    <TextField
                      type="date"
                      variant="outlined"
                      value={section.endDate}
                      onChange={(e) =>
                        handleEndDateChange(index, e.target.value)
                      }
                    />
                  </div>
                </div>
              </>
            )}

            <div className={styles.productRow}>
              {index !== 0 && (
                <Button
                  className={styles.del}
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={() => handleRemoveSection(index)}
                  style={{ marginLeft: "auto" }}
                >
                  <FaTrash size={19} />
                </Button>
              )}
            </div>
          </div>
        ))}
        <Button
          className={styles.btnWithIcon}
          style={{ marginLeft: "auto" }}
          variant="contained"
          color="primary"
          onClick={handleAddSection}
        >
          <FaPlus size={22} />
          <span>Mahsulot</span>
        </Button>
        <div className={styles.carRow}>
          <div className={styles.carLeft}>
            <h4 className={styles.title}>
              Tanlang mashina <FaCar size={19} />
            </h4>
            <Autocomplete
              className={styles.autocomplete}
              id="car-selection-autocomplete"
              size="small"
              options={carServices}
              onChange={(event, value) => handleCarSelect(value)}
              getOptionLabel={(option: any) =>
                `${option.comment || "Без названия"}`
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} label="Mashina" variant="outlined" />
              )}
            />

            {selectedCar && (
              <div>
                <h5>Tanlangan mashina</h5>
                <p>Nom: {selectedCar.comment}</p>
              </div>
            )}
          </div>

          {/* Комментарий для водителя */}
          <div className={styles.carRight}>
            <h4 className={styles.title}>Kommentariya uchun</h4>
            <TextField
              variant="outlined"
              label="Kommentariya"
              value={driverComment}
              onChange={handleCommentChange}
            />
          </div>
        </div>
        <div className={styles.btns}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddSection}
            className={styles.btnWithIcon}
            style={{ marginLeft: "auto", marginTop: 40 }}
          >
            <FaCartPlus size={22} />
            <span>Sotish</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
