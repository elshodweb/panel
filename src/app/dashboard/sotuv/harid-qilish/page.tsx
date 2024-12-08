'use client';
import React, { useEffect, useState } from "react";
import styles from './styles.module.scss'
import Title from "@/components/Title/Title";
import AddBtn from "@/components/Buttons/AddBtn/AddBtn";
import { Autocomplete, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProducts } from "@/features/products/products";
const OrdersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  const { products, status, error, pagination } = useSelector(
    (state: RootState) => state.products
  );
  console.log(products);
  
  useEffect(() => {
    dispatch(
      fetchProducts({
        pageNumber: 1,
        pageSize: 10,
        searchTitle: search,
        searchable_title_id: 'null',
        category_id: 'null',
      })
    );
  }, [dispatch]);

  const onChangeCategorySelect = (event: any, value: any) => {
    if (value) {
      dispatch(
        fetchProducts({
          pageNumber: 1,
          pageSize: 100,
          searchTitle: search,
          searchable_title_id: 'null',
          category_id: 'null',
        })
      );
    }
  };

  return (
    <div className={styles.wrapper}>

      <div className={styles.row}>
        <Title>Harid qilish</Title>
        <div className={styles.right}>
          <AddBtn onClick={() => { }} />
        </div>
      </div>

      <div>
        <Autocomplete
          className={styles.autocomplete}
          id="free-solo-demo"
          size="small"
          options={products}
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
    </div>
  );
};

export default OrdersPage;
