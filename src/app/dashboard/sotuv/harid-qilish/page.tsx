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
  const [originalProducts, setOriginalProducts] = useState<any[]>([]);


  const [sections, setSections] = useState([
    {
      selectedCategory: null,
      categoryTitle: "",
      selectedProduct: null,
      productTitle: "",
      quantity: 1, // Для количества продукта
      rentalDays: 1, // Для дней аренды
      totalPrice: 0, // Для вычисленной стоимости аренды
      dailyPrice: 0,
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

  const handleChangeProductTitle = (index: number, value: string) => {
    const newSections: any = [...sections];
    newSections[index].productTitle = value;

    const filteredProducts = originalProducts.filter((product) => {
      if (/^\d+$/.test(value)) {
        // Если ввод только цифры, ищем по searchable_title_id
        console.log(product.searchable_title_id.includes(value));

        return product.searchable_title_id.includes(value);
      } else {
        // Иначе ищем по названию
        return product.title.toLowerCase().includes(value.toLowerCase());
      }
    });

    setSections(newSections);
    setOriginalProducts(filteredProducts);
  };

  const handleSelectProduct = (index: number, value: any) => {
    const newSections = [...sections];

    newSections[index] = {
      ...newSections[index],
      selectedProduct: value,
      dailyPrice: +value.price,
      totalPrice:
        +value.price * sections[index].quantity * sections[index].rentalDays,
      price: value.price,
      type: value.type,
    };

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
      const rentalDays = Math.max(
        1,
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
        )
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
      const rentalDays = Math.max(
        1,
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
        )
      );
      newSections[index].rentalDays = rentalDays;
    } else {
      newSections[index].rentalDays = 1; // Если дата начала не задана
    }

    updateTotalPrice(index, newSections[index]);
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
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        handleChangeProductTitle(index, inputValue);
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
                      value={sections[index].dailyPrice}
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
                  </div>
                </div>

                <div className={styles.productRow}>
                  <div className={styles.left}>
                    <h4 className={styles.title}>Arenda Umumiy narxi</h4>
                    <TextField
                      type="number"
                      variant="outlined"
                      value={sections[index].totalPrice}
                      disabled
                    />
                  </div>
                  <div className={styles.right}>
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
