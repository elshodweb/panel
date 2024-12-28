import React from "react";
import "./Check.scss";

const UserDataSummary = ({ data }: any) => {
  const {
    user_id,
    daily_price,
    total_price,
    paid_total,
    products,
    service_car,
    user_fullName,
    user_phone,
  } = data;

  return (
    <div className="user-summary-container">
      <h1 className="title">Foydalanuvchi haqida ma'lumot</h1>
      <div className="info-box">
        <p>
          <strong>Foydalanuvchi to'liq ismi:</strong> {user_fullName}
        </p>{" "}
        <p>
          <strong>Foydalanuvchi telefoni:</strong> {user_phone}
        </p>
        <p>
          <strong>Kundalik narx:</strong> {daily_price}
        </p>
        <p>
          <strong>Umumiy narx:</strong> {total_price}
        </p>
        <p>
          <strong>To'langan summa:</strong> {paid_total}
        </p>
      </div>
      {products.length ? (
        <>
          <h2 className="subtitle">Mahsulotlar</h2>
          {products.map((product: any, index: number) => (
            <div className="product-box" key={index}>
              <p>
                <strong>Mahsulot nomi:</strong> {product.product_name}
              </p>
              <p>
                <strong>Mahsulot ID:</strong> {product.product_id}
              </p>
              <p>
                <strong>Sotilgan o'lchov:</strong> {product.measurement_sold}
              </p>
              <p>
                <strong>Sotilgan miqdor:</strong> {product.quantity_sold}
              </p>
              <p>
                <strong>Kunlik narx:</strong> {product.price_per_day}
              </p>
              <p>
                <strong>Foydalanilmagan kunlar:</strong> {product.unused_days}
              </p>
              <p>
                <strong>Berilgan sana:</strong> {product.given_date}
              </p>
              <p>
                <strong>Tugash sanasi:</strong> {product.end_date}
              </p>
            </div>
          ))}
        </>
      ) : (
        ""
      )}
      {service_car.length ? (
        <>
          <h2 className="subtitle">Xizmat mashinasi</h2>
          {service_car.map((service: any, index: number) => (
            <div className="service-box" key={index}>
              <p>
                <strong>Izoh:</strong> {service.comment}
              </p>
              <p>
                <strong>Narx:</strong> {service.price}
              </p>
            </div>
          ))}
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default UserDataSummary;
