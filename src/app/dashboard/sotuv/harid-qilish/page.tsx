'use client';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchOrders } from "@/features/order/order"; // Path to the new slice
import CustomTable from "@/components/Table/Table"; // Assuming you have a component for tables
import MyPagination from "@/components/Pagination/Pagination";
import Loader from "@/components/Loader/Loader";
import styles from './styles.module.scss'
import Title from "@/components/Title/Title";
import AddBtn from "@/components/Buttons/AddBtn/AddBtn";
const OrdersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, status, error } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Example handlers for onDelete and onUpdate
  const handleDelete = (order: any) => {
    console.log("Deleting order", order);
    // You can dispatch an action for deleting an order here
  };

  const handleUpdate = (order: any) => {
    console.log("Updating order", order);
    // You can dispatch an action for updating an order here
  };

  return (
    <div className={styles.wrapper}>

      <div className={styles.row}>
        <Title>Harid qilish</Title>
        <div className={styles.right}>
          <AddBtn onClick={() =>{}} />
        </div>
      </div>
      {status === "loading" && <Loader />}
      {status === "failed" && <p>Error: {error}</p>}
      {status === "succeeded" && (
        <>
          <CustomTable
            keys={["user_name", "total_price", "paid_total", "isActive", "data_sequence",]}
            titles={["Foydalanuvchi", "Jami narx", "To'langan jami", "Faol holat", "Sana"]}
            data={orders.map(order => ({
              ...order,
              user_name: `${order.user_id.first_name} ${order.user_id.name}`,
              isActive: order.isActive === "1" ? "Activ" : "Activ emas",
              data_sequence: order.data_sequence.split('T')[0]
            }))}
            onDelete={handleDelete}  // Provide onDelete function
            onUpdate={handleUpdate}  // Provide onUpdate function
          />

        </>
      )}
    </div>
  );
};

export default OrdersPage;
