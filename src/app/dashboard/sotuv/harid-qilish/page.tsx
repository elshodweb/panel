"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import Title from "@/components/Title/Title";
import { Autocomplete, TextField, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchUsers } from "@/features/users/users";
import { fetchProducts } from "@/features/products/products";
import { fetchProductCategories } from "@/features/productCategory/productCategorySlice";
import {
  FaBox,
  FaCar,
  FaCartPlus,
  FaPaperPlane,
  FaPlus,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { fetchCarServices } from "@/features/cars/cars";
import axiosInstance from "@/utils/axiosInstance";
import { DeliveryDetails, RentalDetails } from "../../../../../types";
import { useReactToPrint } from "react-to-print";

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chackRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef: chackRef });

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
  const [originalProducts, setOriginalProducts] = useState<any[]>([]);

  const [sections, setSections] = useState<RentalDetails[]>([
    {
      selectedCategory: null,
      categoryTitle: "",
      selectedProduct: null,
      productTitle: "",
      quantity: 1,
      rentalDays: 1,
      totalPrice: 0,
      dailyPrice: 0,
      type: "",
      price: 0,
      startDate: "",
      endDate: "",
    },
  ]);
  const { carServices, status, error } = useSelector(
    (state: RootState) => state.carServices
  );
  const [delivery, setDelivery] = useState<DeliveryDetails[]>([
    {
      comment: "",
      price: "",
    },
  ]);
  const [autocompleteProducts, setAutocompleteProducts] = useState(products);
  const [titleOrId, setTitleOrId] = useState("");

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
    productTitle: string,
    searchableTitleId: string | null = null
  ) => {
    dispatch(
      fetchProducts({
        pageNumber: 1,
        pageSize: 100,
        searchTitle: productTitle,
        searchable_title_id: searchableTitleId || "null",
        category_id: categoryId || "null",
      })
    );
  };
  useEffect(() => {
    setAutocompleteProducts(products);
  }, [products]);

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
    // Загружаем оригинальные продукты при первом рендере
    dispatch(
      fetchProducts({
        pageNumber: 1,
        pageSize: 100,
        searchTitle: "",
        category_id: "null",
        searchable_title_id: "",
      })
    ).then((response: any) => {
      if (response.payload) {
        setOriginalProducts(response.payload.results); // Предполагается, что данные продуктов приходят в response.payload
      }
    });
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
        dailyPrice: 0,
        price: 0,
        type: "",
        startDate: "",
        endDate: "",
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

  const handleSubmit = async () => {
    const requestData = {
      user_id: selectedUser?.id || "",
      daily_price: sections[0]?.dailyPrice.toString() || "0",
      total_price: sections
        .reduce((acc, section) => acc + section.totalPrice, 0)
        .toString(),
      paid_total: "0",
      products: sections.map((section) => ({
        product_id: section.selectedProduct?.id || "",
        measurement_sold: section.quantity.toString(),
        quantity_sold: section.quantity.toString(),
        price_per_day: section.dailyPrice.toString(),
        unused_days: "0",
        given_date: section.startDate,
        end_date: section.endDate,
      })),
      service_car: selectedCar
        ? [
            {
              price: delivery[0].price || "0",
              comment: delivery[0].comment || "",
            },
          ]
        : [],
    };

    try {
      const response = await axiosInstance.post("/order/create", requestData);
      console.log("Успешный ответ:", response.data);
    } catch (error: any) {
      console.error("Ошибка при отправке данных:", error);
      alert(
        `Ошибка при отправке данных: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleSelectProduct = (index: number, value: any) => {
    if (!value) return;

    const newSections = [...sections];
    newSections[index].selectedProduct = value;
    newSections[index].dailyPrice = value?.price * sections[index].quantity;
    newSections[index].totalPrice = value.price * sections[index].quantity;
    newSections[index].price = value.price;
    newSections[index].type = value.type;
    setSections(newSections);
  };

  const handleQuantityChange = (index: number, value: number) => {
    const newSections = [...sections];
    newSections[index].quantity = value;
    updateTotalPrice(index, newSections[index]);
    updateDailyPrice(index, newSections[index]);
    setSections(newSections);
  };

  const updateTotalPrice = (index: number, section: any) => {
    if (section.selectedProduct) {
      const totalPrice = +section.price * section.quantity * section.rentalDays;
      const newSections = [...sections];
      newSections[index].totalPrice = totalPrice;
      setSections(newSections);
    }
  };

  const updateDailyPrice = (index: number, section: any) => {
    if (section.selectedProduct) {
      const dailyPrice = +section.selectedProduct.price * section.quantity;
      const newSections = [...sections];
      newSections[index].dailyPrice = dailyPrice;
      setSections(newSections);
    }
  };
  const handleStartDateChange = (index: number, date: string) => {
    const newSections = [...sections];
    newSections[index].startDate = date;

    if (newSections[index].endDate) {
      const startDate = new Date(date);
      const endDate = new Date(newSections[index].endDate);
      const rentalDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      );

      newSections[index].rentalDays = rentalDays;
    } else {
      newSections[index].rentalDays = 1;
    }

    updateTotalPrice(index, newSections[index]);
    setSections(newSections);
  };

  const handleEndDateChange = (index: number, date: string) => {
    const newSections = [...sections];
    newSections[index].endDate = date;
    if (newSections[index].startDate) {
      const startDate = new Date(newSections[index].startDate);
      const endDate = new Date(date);
      const rentalDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      );

      newSections[index].rentalDays = rentalDays;
    }

    updateTotalPrice(index, newSections[index]);
    setSections(newSections);
  };

  const handleCarSelect = (car: any) => {
    setSelectedCar(car);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDriverComment(e.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <Title>Harid qilish</Title>
      </div>

      <div className={styles.content}>
        <div className={styles.rowDiv}>
          <div className={styles.userSection}>
            <h4 className={styles.numberOfProduct}>
              Foydalanuvchi tanlash <FaUser size={19} />
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
                  size="small"
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
              <h2 className={styles.numberOfProduct}>
                {index + 1}-Mahsulot <FaBox size={19} />
              </h2>
              <div className={styles.productRow}>
                <div className={styles.left}>
                  <h4 className={styles.title}>Mahsulot kategoriyasini</h4>
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
                        size="small"
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
                    options={autocompleteProducts}
                    onChange={(event, value) =>
                      handleSelectProduct(index, value)
                    }
                    getOptionLabel={(option: any) =>
                      option.title + " (" + option.searchable_title_id + ")" ||
                      "Без названия"
                    }
                    clearIcon={false}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        value={titleOrId}
                        label="Product"
                        variant="outlined"
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          setTitleOrId(inputValue);
                          const isNumeric = /^\d+$/.test(inputValue);

                          updateProducts(
                            index,
                            sections[index].selectedCategory?.id || null,
                            isNumeric ? "" : inputValue,
                            isNumeric ? inputValue : null
                          );
                        }}
                      />
                    )}
                  />
                </div>
              </div>

              {section.selectedProduct && (
                <>
                  <div className={styles.productRow}>
                    <div className={styles.left}>
                      <h4 className={styles.title}>
                        {section.type + " Narxi"}
                      </h4>
                      <TextField
                        size="small"
                        type="number"
                        variant="outlined"
                        value={section.price}
                        disabled
                      />
                    </div>
                    <div className={styles.right}>
                      <h4 className={styles.title}>Arenda olish miqdori</h4>
                      <TextField
                        size="small"
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
                        size="small"
                        type="number"
                        variant="outlined"
                        value={sections[index].dailyPrice}
                        disabled
                      />
                    </div>
                    <div className={styles.right}>
                      <h4 className={styles.title}>Arenda boshlanishi</h4>
                      <TextField
                        size="small"
                        type="date"
                        className={styles.dateInput}
                        variant="outlined"
                        value={section.startDate}
                        onChange={(e) =>
                          handleStartDateChange(index, e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.productRow}>
                    <div className={styles.left}>
                      <h4 className={styles.title}>Arenda Umumiy narxi</h4>
                      <TextField
                        size="small"
                        type="number"
                        variant="outlined"
                        value={sections[index].totalPrice}
                        disabled
                      />
                    </div>
                    <div className={styles.right}>
                      <h4 className={styles.title}>Arenda tugashi</h4>
                      <TextField
                        size="small"
                        type="date"
                        className={styles.dateInput}
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
        </div>
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
            <h4 className={styles.title}>Tanlang mashina</h4>
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
                <TextField
                  {...params}
                  size="small"
                  label="Mashina"
                  variant="outlined"
                />
              )}
            />
            <TextField
              size="small"
              variant="outlined"
              label="Kommentariya"
              value={driverComment}
              onChange={handleCommentChange}
            />
          </div>

          {/* Комментарий для водителя */}
          <div className={styles.carRight}>
            <h4 className={styles.title}>Kommentariya uchun</h4>
            <TextField
              size="small"
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
            color="warning"
            onClick={() => {
              reactToPrintFn();
            }}
            className={styles.btnWithIcon}
            style={{ marginLeft: "auto", marginTop: 40 }}
          >
            <FaPaperPlane size={22} />
            <span>Chek (PDF)</span>
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            className={styles.btnWithIcon}
            style={{ marginLeft: 20, marginTop: 40 }}
          >
            <FaCartPlus size={22} />
            <span>Sotish</span>
          </Button>
        </div>
        <div ref={chackRef} className={styles.chechDiv}>
          {selectedUser && (
            <>
              {" "}
              <div>
                <strong>Foydalanuvchi: </strong>
                <span>
                  {selectedUser.first_name} {selectedUser.name}{" "}
                  {selectedUser.last_name}
                </span>
              </div>
              <div>
                <strong>Foydalanuvchi Telefoni: </strong>
                <span>{selectedUser.phone}</span>
              </div>
              <div>
                <strong>Maxsulotlar: </strong>
                <ul>
                  {sections.length > 0 &&
                    sections.map((el: any, i) => {
                      return (
                        <>
                          {el.selectedProduct && (
                            <li key={el.id}>
                              <div>
                                <strong>{i + 1}-maxsulot: </strong>
                                <span>
                                  {el.selectedProduct.title}(
                                  {el.selectedProduct.searchable_title_id})
                                </span>
                              </div>
                              <div>
                                <strong>
                                  1 {el.selectedProduct.type} narxi:
                                </strong>
                                <span> {el.selectedProduct.price} so'm</span>
                              </div>
                            </li>
                          )}
                        </>
                      );
                    })}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
