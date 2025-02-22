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
import {
  ActionTypesEnum,
  DeliveryDetails,
  RentalDetails,
} from "../../../../../../../types";
import { useReactToPrint } from "react-to-print";
import UserDataSummary from "@/components/Check/Check";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const Page = () => {
  const params = useParams();
  const { id } = params;

  async function fetchOrder() {
    const response = await axiosInstance.get(`/order/one/${id}`);
    const data: any = response.data;
    setSelectedUser(data.user_id);
    setDelivery(
      data.carServices.map((i: any) => ({
        ...i,
        action: ActionTypesEnum.UPDATE,
      }))
    );
    let products = data.orderProducts.map((i: any) => {
      const quantity =
        i.product_id.type == "dona" ? i.quantity_sold : i.measurement_sold;
      const startDate = new Date(i.given_date);
      const endDate = new Date(i.end_date);
      const rentalDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      );
      const totalPrice = i.product_id.price * quantity * rentalDays;

      return {
        order_product_id: i.id,
        selectedCategory: null,
        categoryTitle: "",
        selectedProduct: i.product_id,
        productTitle: i.product_id.title,
        quantity,
        rentalDays,
        totalPrice,
        dailyPrice: i.price_per_day,
        type: i.product_id.type,
        price: i.product_id.price,
        startDate: i.given_date,
        endDate: i.end_date,
        status: i.IsActive,
        action: ActionTypesEnum.UPDATE,
        unusedDays: i.unused_days,
      };
    });

    setSections(products);
  }
  useEffect(() => {
    fetchOrder();
  }, []);
  const dispatch = useDispatch<AppDispatch>();
  const chackRef = useRef(null);
  const reactToPrintFn = useReactToPrint({
    contentRef: chackRef,
    onAfterPrint: () => setIsCheckVisible(false),
  });

  const handlePrint = () => {
    setIsCheckVisible(true);
    setTimeout(() => {
      reactToPrintFn();
    }, 100);
  };
  const updateUnusedDays = (
    index: number,
    section: any,
    unusedDays: number
  ) => {
    if (section.selectedProduct) {
      const newSections = [...sections];
      newSections[index].unusedDays = unusedDays;
      setSections(newSections);
    }
  };
  const {
    users,
    error: userError,
    status: userStatus,
  } = useSelector((state: RootState) => state.users);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [phone, setPhone] = useState("");
  const [isCheckVisible, setIsCheckVisible] = useState(false);
  const { categories } = useSelector(
    (state: RootState) => state.productCategories
  );
  const navigate = useRouter();

  const { products } = useSelector((state: RootState) => state.products);
  const [originalProducts, setOriginalProducts] = useState<any[]>([]);
  const [removedSections, setRemovedSections] = useState<RentalDetails[]>([]);
  const [removedDeliveryCars, setRemovedDeliveryCars] = useState<
    RentalDetails[]
  >([]);
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
      status: "Active",
      action: ActionTypesEnum.GET,
      unusedDays: 0,
    },
  ]);
  const [delivery, setDelivery] = useState<DeliveryDetails[]>([
    {
      comment: "",
      service_car_id: "",
      price: "",
      action: ActionTypesEnum.CREATE,
    },
  ]);
  const [autocompleteProducts, setAutocompleteProducts] = useState(products);
  const [titleOrId, setTitleOrId] = useState("");

  useEffect(() => {
    dispatch(
      fetchUsers({
        pageNumber: 1,
        pageSize: 100,
        search: phone,
       
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
        setOriginalProducts(response.payload.results);
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
        status: "Active",
        action: ActionTypesEnum.CREATE,
        unusedDays: 0,
      },
    ]);
  };

  const handleAddDelivery = () => {
    setDelivery((prev) => [
      ...prev,
      {
        comment: "",
        price: "",
        service_car_id: "",
        action: ActionTypesEnum.CREATE,
      },
    ]);
  };

  const handleRemoveSection = (index: number) => {
    if (sections.length > 1) {
      setSections((prev) =>
        prev.filter((el, i) => {
          if (i === index) {
            setRemovedSections((arr) => [
              ...arr,
              { ...el, action: ActionTypesEnum.CREATE },
            ]);
            return false;
          }
          return true;
        })
      );
    }
  };

  const handleRemoveDelivery = (index: number) => {
    if (delivery.length > 0) {
      setDelivery((prev) =>
        prev.filter((el: any, i) => {
          if (i === index) {
            setRemovedDeliveryCars((p) => [
              ...p,
              { ...el, action: ActionTypesEnum.CREATE },
            ]);
            return false;
          }
          return true;
        })
      );
    }
  };

  const handleChangeCategory = (index: number, value: any) => {
    const newSections: RentalDetails[] = [...sections];
    newSections[index].selectedCategory = value;
    newSections[index].categoryTitle = value?.title || "";
    newSections[index].productTitle = "";

    newSections[index].action =
      newSections[index]?.action === ActionTypesEnum.CREATE
        ? ActionTypesEnum.CREATE
        : ActionTypesEnum.UPDATE;
    newSections[index].selectedProduct = null;

    setSections(newSections);
    updateProducts(index, value?.id, newSections[index].productTitle);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isCheckVisible) return; // Prevent double submission
    const requestData = {
      user_id: selectedUser?.id || "",
      daily_price: sections[0]?.dailyPrice.toString() || "0",
      total_price: sections
        .reduce((acc, section) => acc + section.totalPrice, 0)
        .toString(),
      paid_total: "0",
      products: sections.map((section: any) => {
        return {
          product_id: section.selectedProduct?.id || "",
          order_product_id: section.order_product_id || undefined,
          measurement_sold: section.quantity.toString(),
          quantity_sold: section.quantity.toString(),
          price_per_day: section.dailyPrice.toString(),
          status: section.status,
          action: section.action,
          unused_days: section.unusedDays.toString(),
          ...(section.startDate.length
            ? { given_date: section.startDate }
            : {}),
          ...(section.endDate.length ? { end_date: section.endDate } : {}),
        };
      }),

      service_car: [
        ...[
          ...(delivery.length
            ? delivery.map((i: any) => ({ ...i, service_car_id: i.id }))
            : []),
        ],
        ...[
          ...(removedDeliveryCars.length
            ? removedDeliveryCars.map((i: any) => ({
                ...i,
                service_car_id: i.id,
                action: ActionTypesEnum.DELETE,
              }))
            : []),
        ],
      ],
    };

    try {
      const response = await axiosInstance.patch(
        "/order/update/" + id,
        requestData
      );
    } catch (error: any) {
      console.error("Ошибка при отправке данных:", error);
      alert(
        `Ошибка при отправке данных: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      navigate.push("/dashboard/sotuv/harid-tugatish");
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
    newSections[index].action =
      newSections[index].action === ActionTypesEnum.CREATE
        ? ActionTypesEnum.CREATE
        : ActionTypesEnum.UPDATE;
    newSections[index].status = "Active";
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

  const changeDelivery = (
    index: number,
    key: keyof DeliveryDetails,
    value: string
  ) => {
    setDelivery((prevDelivery) =>
      prevDelivery.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      )
    );
  };

  return (
    <form onSubmit={handleSubmit} className={styles.wrapper}>
      <div className={styles.row}>
        <Title>Haridni o'zgartirish</Title>
      </div>

      <div className={styles.content}>
        <div className={styles.rowDiv}>
          <div className={styles.userSection}>
            <h4 className={styles.numberOfProduct}>
              Foydalanuvchi o'zgartirish <FaUser size={19} />
            </h4>
            <Autocomplete
              className={styles.autocomplete}
              id="user-selection-autocomplete"
              size="small"
              options={users}
              disabled
              value={selectedUser}
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
                  required
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
                  <h4 className={styles.title}>Mahsulotni o'zgartirish</h4>
                  <Autocomplete
                    className={styles.autocomplete}
                    size="small"
                    options={autocompleteProducts}
                    onChange={(event, value) =>
                      handleSelectProduct(index, value)
                    }
                    value={section.selectedProduct}
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
                        required
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
                        required
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
                        required
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
                        required
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
                        required
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
                        required
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
                        required
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

                  <div className={styles.productRow}>
                    <div className={styles.left}>
                      <h4 className={styles.title}>Ishlatilmagan kunlar</h4>
                      <TextField
                        required
                        size="small"
                        type="number"
                        variant="outlined"
                        value={sections[index].unusedDays}
                        onChange={(e) =>
                          updateUnusedDays(index, section, +e.target.value)
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
        <div className={styles.cars}>
          {delivery.map((el, i) => (
            <div key={i} className={styles.car}>
              <h2 className={styles.numberOfProduct}>
                {i + 1}-Mashina <FaCar size={19} />
              </h2>
              <div className={styles.carRow}>
                <div className={styles.carLeft}>
                  <h4 className={styles.title}>Mashina narxi</h4>
                  <TextField
                    required
                    size="small"
                    variant="outlined"
                    label="Narhi"
                    value={el.price}
                    onChange={(e) => changeDelivery(i, "price", e.target.value)}
                  />
                </div>

                <div className={styles.carRight}>
                  <h4 className={styles.title}>Kommentariya</h4>
                  <TextField
                    required
                    size="small"
                    variant="outlined"
                    label="Kommentariya"
                    value={el.comment}
                    onChange={(e) =>
                      changeDelivery(i, "comment", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className={styles.carRow}>
                {
                  <Button
                    className={styles.del}
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => handleRemoveDelivery(i)}
                    style={{ marginLeft: "auto" }}
                  >
                    <FaTrash size={19} />
                  </Button>
                }
              </div>
            </div>
          ))}
        </div>
        <Button
          className={styles.btnWithIcon}
          style={{ marginLeft: "auto" }}
          variant="contained"
          color="primary"
          onClick={handleAddDelivery}
        >
          <FaPlus size={22} />
          <span>Mashina</span>
        </Button>
        <div className={styles.btns}>
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              handlePrint();
            }}
            className={styles.btnWithIcon}
            type="button"
            style={{ marginLeft: "auto", marginTop: 40 }}
          >
            <FaPaperPlane size={22} />
            <span>Chek (PDF)</span>
          </Button>

          <Button
            variant="contained"
            color="secondary"
            type="submit"
            className={styles.btnWithIcon}
            style={{ marginLeft: 20, marginTop: 40 }}
          >
            <FaCartPlus size={22} />
            <span>Tahrirlash</span>
          </Button>
        </div>

        {isCheckVisible && (
          <div ref={chackRef} className={styles.chechDiv}>
            <UserDataSummary
              data={{
                user_id: selectedUser?.id || "",
                user_fullName:
                  `${selectedUser?.name} ${selectedUser?.last_name} ` || "",
                user_phone: selectedUser?.phone || "",
                user_comment: selectedUser?.comment || "",
                daily_price: sections[0]?.dailyPrice.toString() || "0",
                total_price: sections
                  .reduce((acc, section) => acc + section.totalPrice, 0)
                  .toString(),
                paid_total: "0",
                products: sections.map((section: any) => ({
                  product_id:
                    section.selectedProduct?.searchable_title_id || "",
                  product_name: section.selectedProduct?.title || "",
                  quantity_sold:
                    section.quantity.toString() +
                    `${section.type == "dona" ? " dona" : " metr"}`,
                  price_per_day: section.dailyPrice.toString() + " so'm",
                  unused_days: "0",
                  ...(section.startDate.length
                    ? { given_date: section.startDate }
                    : {}),
                  ...(section.endDate.length
                    ? { end_date: section.endDate }
                    : {}),
                })),
                service_car: delivery.length ? delivery : [],
              }}
            />
          </div>
        )}
      </div>
    </form>
  );
};

export default Page;
