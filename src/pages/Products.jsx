import React, { useState } from 'react'
import { useLoaderData } from 'react-router-dom';
import { Link } from 'react-router-dom';

// Bootstrap Components.
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { BoxArrowRight as BoxArrowRightIcon } from 'react-bootstrap-icons';

// Custom Components.
import Actions from '../components/Actions';
import AddEditProduct from '../components/AddEditProduct';

// Style, utils, and other helpers.
import ProductUtil from '../utils/api/ProductUtil'

export async function loader() {
  const { data: products } = await ProductUtil.findAll();
  return { products };
}

const ActiveSwitch = ({ id, index, label, isActive }) => {
  const [isChecked, setIsChecked] = useState(isActive);

  const handleOnChange = () => {
    setIsChecked(!isChecked);
    ProductUtil.update(id, { active: !isChecked });
  };

  return (
    <Form>
      <Form.Check
        id={id}
        type="switch"
        aria-label={label}
        data-product-index={index}
        checked={isChecked}
        onChange={handleOnChange}
      />
    </Form>
  );
};

const ViewLink = ({ id }) => (
  <Link to={`/products/${id}`}>
    <BoxArrowRightIcon />
  </Link>
)

const tableColumns = [{
  label: 'title',
  Component: undefined
}, {
  label: 'description',
  Component: undefined
}, {
  label: 'category',
  Component: undefined
}, {
  label: 'price',
  Component: undefined,
}, {
  label: 'active',
  Component: ActiveSwitch
}, {
  label: 'view',
  Component: ViewLink
}, {
  label: 'actions',
  Component: Actions
}];

export default function Products() {
  const [products, setProducts] = useState(useLoaderData().products);

  const addProduct = newProduct => {
    setProducts([...products, newProduct]);
  };

  const removeProduct = productId => {
    const filteredProducts = products.filter(({ id }) => id !== productId);
    setProducts([...filteredProducts]);
  };

  const updateProduct = updatedProduct => {
    const updatedProducts = [...products];

    for (let i = 0; i < updatedProducts.length; i++) {
      const currentProduct = updatedProducts[i];

      if (currentProduct.id === updatedProduct.id) {
        updatedProducts[i] = { ...currentProduct, ...updatedProduct };
      }

    }

    setProducts([...updatedProducts]);
  };

  console.log(products);

  return (
    <Container>
      <h1>Products</h1>

      <div>
        <AddEditProduct buttonContent={'Add Product'} addProduct={addProduct} />
      </div>

      <Table responsive striped bordered hover className="table-light">
        <thead>
          <tr>
            {tableColumns.map(({ label }) => (
              <th key={`${label}-heading`} style={{ maxWidth: 200 }}>
                <span className="text-capitalize">{label}</span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {products.map(product => (
            <tr key={`${product.id}-${products.length}`}>
              {tableColumns.map(({ label, Component }, index) => (
                <td key={`${product.id}-${label}-${products[label]}`} style={{ maxWidth: 200 }} className="text-truncate">
                  {Component ? (
                    <Component
                      id={product.id}
                      product={product}
                      index={index}
                      label={label}
                      isActive={product.active}
                      removeProduct={removeProduct}
                      updateProduct={updateProduct}
                    />
                  ) : (
                    <span key={`${product.id}-${label}-${products[label]}`}>{product[label] ?? ''}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}
