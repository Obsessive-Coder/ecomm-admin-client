import React, { useState } from 'react'
import { useLoaderData } from 'react-router-dom';
import { Link } from 'react-router-dom';

// Bootstrap Components.
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import {
  BoxArrowRight as BoxArrowRightIcon,
  ArrowLeftShort as PreviousIcon,
  ArrowRightShort as NextIcon
} from 'react-bootstrap-icons';

// Other Components.
import Pagination, { bootstrap5PaginationPreset } from 'react-responsive-pagination';

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
  const [rowLimit, setRowLimit] = useState(25);
  const [pageCount, setPageCount] = useState(Math.ceil(products.length / rowLimit))
  const [pageIndex, setPageIndex] = useState(0);
  const [pageProducts, setPageProducts] = useState(products.slice(0, rowLimit))

  const addProduct = newProduct => {
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);

    const updatedPageProducts = updatedProducts.slice(pageIndex * rowLimit, (pageIndex * rowLimit) + rowLimit);
    setPageProducts(updatedPageProducts);

    setPageCount(Math.ceil(updatedProducts.length / rowLimit));
  };

  const removeProduct = productId => {
    const filteredProducts = products.filter(({ id }) => id !== productId);
    setProducts([...filteredProducts]);

    let updatedPageProducts = filteredProducts.slice(pageIndex * rowLimit, (pageIndex * rowLimit) + rowLimit);

    if (updatedPageProducts.length === 0) {
      updatedPageProducts = filteredProducts.slice((pageIndex - 1) * rowLimit, ((pageIndex - 1) * rowLimit) + rowLimit);

      setPageIndex(pageIndex - 1);
    }

    setPageProducts(updatedPageProducts);

    setPageCount(Math.ceil(filteredProducts.length / rowLimit))
  };

  const updateProduct = updatedProduct => {
    const updatedProducts = [...products];

    for (let i = 0; i < updatedProducts.length; i++) {
      const currentProduct = updatedProducts[i];

      if (currentProduct.id === updatedProduct.id) {
        updatedProducts[i] = { ...currentProduct, ...updatedProduct };
      }
    }

    const updatedPageProducts = [...pageProducts];
    for (let j = 0; j < updatedPageProducts.length; j++) {
      const pageProduct = updatedPageProducts[j];

      if (pageProduct.id === updatedProduct.id) {
        updatedPageProducts[j] = { ...pageProduct, ...updatedProduct };
      }
    }

    setProducts([...updatedProducts]);
    setPageProducts([...updatedPageProducts]);
  };

  const updatePageProducts = index => {
    if (index < pageCount) {
      const updatedPageProducts = products.slice(index * rowLimit, (index * rowLimit) + rowLimit);
      setPageProducts(updatedPageProducts);
      setPageIndex(index);
    }
  };

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
          {pageProducts.map(product => (
            <tr key={`${product.id}`}>
              {tableColumns.map(({ label, Component }, index) => (
                <td key={`${product.id}-${label}-${product[label]}`} style={{ maxWidth: 200 }} className="text-truncate">
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
                    <span key={`${product.id}-${label}-${product[label]}`}>{product[label] ?? ''}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      <div>
        <Pagination
          {...bootstrap5PaginationPreset}
          total={pageCount}
          current={pageIndex + 1}
          maxWidth={500}
          previousLabel={<PreviousIcon />}
          nextLabel={<NextIcon />}
          onPageChange={pageNumber => updatePageProducts(pageNumber - 1)}
        />
      </div>
    </Container>
  )
}
