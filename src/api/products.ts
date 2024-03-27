/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosInstance, AxiosResponse, RawAxiosRequestHeaders } from "axios";

const productsConfig: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  } as RawAxiosRequestHeaders,
});

export interface IProduct {
  id: string,
  name: string,
  description: string,
  price: number,
  inStock: boolean

}

export const getProducts = async (): Promise<IProduct[]> => {
  try {
    const response: AxiosResponse = await productsConfig.get("/products")
    //console.log(response.data);
    return response.data
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching products")
  }
}

export const createProduct = async (product: IProduct) => {
  try {
    const response: AxiosResponse = await productsConfig.post("/products", product)
    //console.log(response.data);
    return 0
  } catch (error) {
    console.log(error);
    throw new Error("Error creating product")
  }
}

export const deleteProduct = async (id: string) => {
  try {
    const response: AxiosResponse = await productsConfig.delete(`/products/${id}`)
    //console.log(response.data);
    return 0
  } catch (error) {
    console.log(error);
    throw new Error("Error deleting product")
  }
}

export const updateProduct = async (product: IProduct) => {
  try {
    const response: AxiosResponse = await productsConfig.put(`/products/${product.id}`, product)
    //console.log(response.data);
    return 0
  } catch (error) {
    console.log(error);
    throw new Error("Error updating product")
  }
}

export default productsConfig;