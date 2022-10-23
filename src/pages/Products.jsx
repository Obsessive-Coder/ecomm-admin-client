import React from 'react'
import { useLoaderData } from 'react-router-dom';

// Bootstrap Components.
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

// Style, utils, and other helpers.
import Products_API from '../utils/api/Products'

export async function loader() {
  const { data: products } = await Products_API.findAll();
  return { products };
}

export default function Products() {
  const { products } = useLoaderData();

  const tableColumns = ['title', 'description', 'category', 'status', 'active', 'view', 'actions']

  console.log(products);

  return (
    <Container>
      <h1>Products</h1>

      <Table responsive striped bordered hover className="table-light">
        <thead>
          <tr>
            {tableColumns.map(productKey => (
              <th key={productKey} style={{ maxWidth: 200 }}>
                <span className="text-capitalize">{productKey}</span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              {tableColumns.map(label => (
                <td key={label} style={{ maxWidth: 200 }} className="text-truncate">
                  <span>{product[label] ?? ''}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}
