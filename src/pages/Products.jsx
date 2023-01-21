import React, { useState } from 'react'
import { connect, useDispatch } from 'react-redux';

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
import ProductUtil from '../utils/api/ProductUtil';

const productUtil = new ProductUtil();

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

function Products(props) {
  const { categories, products } = props;

  const dispatch = useDispatch();

  const [rowLimit, setRowLimit] = useState(25);
  const [pageIndex, setPageIndex] = useState(0);

  const getProducts = async queryParams => {
    const { data } = await productUtil.findAll(queryParams);
    dispatch({ type: 'STORE_PRODUCTS', payload: data });
  }

  const addProduct = async newProduct => {
    const { data } = await productUtil.create(newProduct);
    dispatch({ type: 'ADD_PRODUCT', payload: data });
  };

  const updateProduct = updatedProduct => {
    productUtil.update(updatedProduct.id, updatedProduct);
    dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
  };

  const removeProduct = productId => {
    productUtil.delete(productId);
    dispatch({ type: 'REMOVE_PRODUCT', payload: productId });
  };

  const updatePageIndex = index => {
    if (index < pageCount) {
      setPageIndex(index);
    }
  };

  const pageProducts = products
    .slice(pageIndex * rowLimit, (pageIndex * rowLimit) + rowLimit);

  const pageCount = Math.ceil(products.length / rowLimit);

  return (
    <Container fluid className="px-0">
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

      <Table responsive striped bordered hover className="table-dark">
        <thead className="text-secondary">
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
                <td key={`${product.id}-${label}-${product[label]}`} style={{ maxWidth: 200 }} className="text-truncate text-secondary">
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
                          {label === 'price' ? (
                            `$${Number.parseFloat(product[label]).toFixed(2)}`
                          ) : (
                            product[label] ?? ''
                          )}
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

      {pageCount > 1 && (
        <div>
          <Pagination
            {...bootstrap5PaginationPreset}
            total={pageCount}
            current={pageIndex + 1}
            maxWidth={500}
            previousLabel="<"
            nextLabel=">"
            onPageChange={pageNumber => updatePageIndex(pageNumber - 1)}
          />
        </div>
      )}
    </Container >
  )
}

const mapStateToProps = ({ categories, products }) => ({ categories, products });

export default connect(mapStateToProps)(Products);
