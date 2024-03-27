/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */


import ProductForm from "../ProductForm"
import Products from "../Products"



type Props = {}

const RestApiUI = (_props: Props) => {

  return (
    <>
      <h1>RestApiUI</h1>
      <ProductForm />
      <Products />
    </>
  )
}

export default RestApiUI