/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProduct } from "../api/products"
import { IProduct } from "../api/products"

type Props = {}

const ProductForm = (_props: Props) => {
  const queryClient = useQueryClient() // ? The queryClient is a hook that gives us access to the query cache. We can use it to invalidate queries, refetch queries, manipulate the context.

  // $ Allow POST, UPDATE, DELETE
  const addProduct = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      console.log("Product added")
      queryClient.invalidateQueries({ queryKey: ['products'] }) // ? Invalidate the cache of the query with the key "products". This fc makes another request again and compare the old cache data with new data incoming from the backend, if there are differences, the UI will be updated.
    },
  })


  // * The form will submit only if we create a common button without any type.
  const handlerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    //console.log(e.target)
    const formData = new FormData(e.target as HTMLFormElement)  // ? obtengo los valores del form sin necesidad de acceder a cada input con useState
    const product: IProduct = Object.fromEntries(formData) as unknown as IProduct // ? You cannot cast from a custom to a primitive without erasing the type first. unknown erases the type checking
    //console.log(product);
    addProduct.mutate({
      ...product,
      inStock: true
    })
    e.currentTarget.reset() // ? Reset the form values
  }


  return (
    <>
      <h3>Product Form</h3>
      <form onSubmit={handlerSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" id="name" />

        <label htmlFor="description">Description:</label>
        <input type="text" name="description" id="description" />

        <label htmlFor="price">Price:</label>
        <input type="number" name="price" id="price" />



        <br />
        <button>add product</button>
      </form>
    </>
  )
}

export default ProductForm