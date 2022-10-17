import React from 'react'
import { useLoaderData } from 'react-router-dom';

// Style, utils, and other helpers.
import Products_API from '../utils/api/Products'

export async function loader({ params: { productId } }) {
  const { data: product } = await Products_API.findOne(productId);
  return { product };
}

export default function Product() {
  const { product } = useLoaderData();

  console.log(product);


  return (
    <div>
      <h1>Product</h1>

      <div>
        <p>COMING SOON!!</p>
      </div>
    </div>
  )
}
