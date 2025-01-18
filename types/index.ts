export type RentalDetails = {
  selectedCategory: {
    id: string;
  } | null;
  categoryTitle: string;
  selectedProduct: {
    id: string;
  } | null;
  productTitle: string;
  quantity: number;
  rentalDays: number;
  totalPrice: number;
  dailyPrice: number;
  type: string;
  price: number;
  startDate: string;
  endDate: string;
  action: ActionTypesEnum;
};

export type DeliveryDetails = {
  price: string;
  comment: string;
  service_car_id: string;
};
export enum ActionTypesEnum {
  GET = "get",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}
