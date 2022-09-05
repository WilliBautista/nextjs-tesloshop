import { ISize } from "./";

export interface ICartProduct {
  _id: string;
  description: string;
  image: string;
  price: number;
  size?: ISize;
  slug: string;
  title: string;
  gender: 'men'|'women'|'kid'|'unisex';
  quantity: number;
}

export interface IOrderCartSummary {
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
}
