/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { getProducts } from "../api/products"
import { useQuery } from "@tanstack/react-query"

type Props = {}


const Products = (_props: Props) => {
  const queryProducts = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  })

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
            <button type="button">Delete</button>
            <input type="checkbox" name="" id="" />
            <label htmlFor="">in stock</label>
            {
              product.inStock ? <p>stock: in stock</p> : <p>stock: out of stock</p>
            }



          </div>
        ))
      }

    </div>
  )
}

export default Products