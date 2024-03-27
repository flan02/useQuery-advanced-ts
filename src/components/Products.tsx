/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { deleteProduct, getProducts, IProduct, updateProduct } from "../api/products"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

type Props = {}



const Products = (_props: Props) => {

  const queryClient = useQueryClient()

  const queryProducts = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    select: (products) => products.sort((a, b) => b.price - a.price) // ? Select is a function that allows us to manipulate the data before it is stored in the cache. In this case, we sort the array by id in descending order.
  })

  const eliminateProduct = useMutation({
    mutationFn: deleteProduct,
    onMutate: (id: string) => {
      console.log("Deleting product with id:", id);
    },
    onSuccess: () => {
      console.log(`Product deleted`)
      queryClient.invalidateQueries({ queryKey: ["products"] })
      //queryProducts.refetch() // ? Refetch the query, this is another way to invalidate the cache and update the UI
    },

  })

  const modifyProduct = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      console.log(`Product modified`)
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })

  const handlerDelete = (id: string) => {
    eliminateProduct.mutate(id)
  }

  //if(queryProducts.data) console.log(queryProducts.data)
  if (queryProducts.isLoading) return <div>Loading...</div>
  else if (queryProducts.isError) return <div>{` ${queryProducts.error} `}</div>

  return (
    <div>
      <h3>Products List</h3>
      {
        queryProducts.data?.map((product) => (
          <div key={product.id}>
            <h4>name: {product.name}</h4>
            <p>description: {product.description}</p>
            <p>price: {product.price}</p>
            <p>id: {product.id}</p>
            {product.inStock ? <p>stock: in stock</p> : <p>stock: out of stock</p>}
            <button onClick={() => handlerDelete(product.id)} type="button">Delete</button>
            <label htmlFor={product.id}>In stock</label>
            <input
              onChange={(e) => modifyProduct.mutate({
                ...product, // ? If I only send the product object I'd be sending the old value of inStock
                inStock: (e.target as HTMLInputElement).checked // ? So I send the new value of inStock that will be updated
                // ? We can change the value of each property of the product.
              })}
              checked={product.inStock} // ? if true the checkbox is filled, false the checkbox is empty
              type="checkbox" name="stock" id={product.id} />
            { /* <input onChange={(e) => console.log((e.target as HTMLInputElement).checked)} type="checkbox" name="stock" id="stock" />  */}
          </div>
        ))
      }

    </div>
  )
}

export default Products