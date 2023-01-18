import React, { useState } from 'react'
import { useLoaderData } from 'react-router-dom';

// Bootstrap Components.
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

// Other Components.
import Pagination, { bootstrap5PaginationPreset } from 'react-responsive-pagination';

// Custom Components.
import Actions from '../components/Actions';
import ActionBar from '../components/ActionBar';
import ActiveSwitch from '../components/ActiveSwitch';
import ViewLink from '../components/ViewLink';

// Style, utils, and other helpers.
import CategoryUtil from '../utils/api/CategoryUtil';
import ProductUtil from '../utils/api/ProductUtil';

export async function loader() {
  const { data: categories } = await new CategoryUtil()
    .findAll({ order: { column: 'title' } });

  const { data: products } = await new ProductUtil()
    .findAll({ order: { column: 'title' } });

  return { categories, products };
}

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
  label: 'quantity',
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
  const categories = useLoaderData().categories;
  const [products, setProducts] = useState(useLoaderData().products);
  const [rowLimit, setRowLimit] = useState(25);
  const [pageCount, setPageCount] = useState(Math.ceil(products.length / rowLimit));
  const [pageIndex, setPageIndex] = useState(0);
  const [pageProducts, setPageProducts] = useState(products.slice(0, rowLimit));

  const getProducts = async queryParams => {
    const { data: products } = await new ProductUtil().findAll(queryParams);
    setProducts(products);

    const updatedPageProducts = products.slice(pageIndex * rowLimit, (pageIndex * rowLimit) + rowLimit);
    setPageProducts(updatedPageProducts);

    setPageCount(Math.ceil(products.length / rowLimit));
  }

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
    new ProductUtil().update(updatedProduct.id, updatedProduct);

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
    <Container className="px-0">
      <h1>Products</h1>

      <ActionBar
        isSearchVisible
        isFilterVisible
        isSortVisible
        type="product"
        categories={categories}
        addItem={addProduct}
        getItems={getProducts}
      />

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
                      index={index}
                      label={label}
                      isActive={product.active}
                      item={product}
                      categories={categories}
                      type="product"
                      toUrl={`/products/${product.id}`}
                      removeItem={removeProduct}
                      handleUpdate={updateProduct}
                    />
                  ) : (
                    <span key={`${product.id}-${label}-${product[label]}`}>
                      {label === 'category' ? (
                        categories.filter(({ id }) => id === product.category_id)[0]?.title
                      ) : (
                        <>
                          {label === 'price' && '$'}
                          {product[label] ?? ''}
                        </>
                      )}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      {pageProducts.length === 0 && (
        <div className="text-center">
          <h2>There are no products to show.</h2>
          <p>Try adding products or updating your search criteria</p>
        </div>
      )}

      <div>
        <Pagination
          {...bootstrap5PaginationPreset}
          total={pageCount}
          current={pageIndex + 1}
          maxWidth={500}
          previousLabel="<"
          nextLabel=">"
          onPageChange={pageNumber => updatePageProducts(pageNumber - 1)}
        />
      </div>
    </Container >
  )
}
