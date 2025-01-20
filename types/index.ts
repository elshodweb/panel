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
  action?: ActionTypesEnum;
  status?: string;
  unusedDays: number;
};

export type DeliveryDetails = {
  price: string;
  comment: string;
  service_car_id?: string;
  action?: ActionTypesEnum;
};

export type DebtDetails = {
  remaining_debt: string;
  comment: string;
  isActive: "true";
  dayToBeGiven: "2023-01-01T00:00:00Z";
  dayGiven?: string;
};

export enum ActionTypesEnum {
  GET = "get",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}

export enum IsActiveType {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
