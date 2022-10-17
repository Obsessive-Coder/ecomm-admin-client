import React from 'react'
import { useLoaderData } from 'react-router-dom';

// Style, utils, and other helpers.
import Products_API from '../utils/api/Products'

export async function loader() {
  const { data: products } = await Products_API.findAll();
  return { products };
}

export default function Products() {
  const { products } = useLoaderData();

  console.log(products);

  return (
    <div>
      <h1>Products</h1>

      <div>
        <p>COMING SOON!!</p>
      </div>
    </div>
  )
}
