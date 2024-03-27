/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosInstance, AxiosResponse, RawAxiosRequestHeaders } from "axios";

const productsConfig: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  } as RawAxiosRequestHeaders,
});

interface IProduct {
  id: number,
  name: string,
  description: string,
  price: number,
  inStock: boolean,
}

export const getProducts = async (): Promise<IProduct[]> => {
  try {
    const response: AxiosResponse = await productsConfig.get("/products")
    console.log(response.data);
    return response.data
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching products")
  }
}

export default productsConfig;