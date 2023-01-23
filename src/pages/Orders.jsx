import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';

// Bootstrap Components.
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

// Other Components.
import Pagination, { bootstrap5PaginationPreset } from 'react-responsive-pagination';

// Custom Components.
import Actions from '../components/Actions';
import ActionBar from '../components/ActionBar';
import StatusBadge from '../components/StatusBadge';
import ViewLink from '../components/ViewLink';

// Styles, utils, and other helpers.
import OrderUtil from '../utils/api/OrderUtil';
import ProductUtil from '../utils/api/ProductUtil';

const orderUtil = new OrderUtil();
const productUtil = new ProductUtil();

const tableColumns = [{
  label: 'date',
  Component: undefined
}, {
  label: 'recipient_name',
  Component: undefined
}, {
  label: 'address',
  Component: undefined
}, {
  label: 'phone',
  Component: undefined
}, {
  label: 'payment',
  Component: undefined
}, {
  label: 'shipping',
  Component: undefined
}, {
  label: 'total',
  Component: undefined
}, {
  label: 'status',
  Component: StatusBadge
}, {
  label: 'view',
  Component: ViewLink
}, {
  label: 'actions',
  Component: Actions
}];

function Orders(props) {
  const { orders, orderStatuses, products } = props;

  const dispatch = useDispatch();

  const [rowLimit, setRowLimit] = useState(25);
  const [pageIndex, setPageIndex] = useState(0);

  const getOrders = async (queryParams = { order: { column: 'updatedAt' } }) => {
    const { data } = await orderUtil.findAll(queryParams);
    dispatch({ type: 'STORE_ORDERS', payload: data });
  };

  const getProducts = async () => {
    setTimeout(async () => {
      const { data } = await productUtil.findAll({ order: { column: 'title' } });
      dispatch({ type: 'STORE_PRODUCTS', payload: [...data] });
    }, 1000);
  }

  const addOrder = async newOrder => {
    // const { data } = await orderUtil.create(newOrder);
    dispatch({ type: 'ADD_ORDER', payload: newOrder });
    await getProducts();
    await getOrders();
  };

  const updateOrder = async updatedOrder => {
    //await orderUtil.update(updatedOrder.id, updatedOrder);
    dispatch({ type: 'UPDATE_ORDER', payload: updatedOrder });
    getProducts();
    getOrders();
  };

  const removeOrder = async orderId => {
    await orderUtil.delete(orderId);
    dispatch({ type: 'REMOVE_ORDER', payload: orderId });
    getProducts();
    getOrders();
  };

  const updatePageIndex = index => {
    if (index < pageCount) {
      setPageIndex(index);
    }
  };

  const pageOrders = orders
    .slice(pageIndex * rowLimit, (pageIndex * rowLimit) + rowLimit);

  const pageCount = Math.ceil(products.length / rowLimit);

  return (
    <Container fluid className="px-0">
      <h1>Orders</h1>

      <ActionBar
        type="order"
        isSearchVisible={true}
        isSortVisible={true}
        categories={orders}
        statuses={orderStatuses}
        products={products}
        addItem={addOrder}
        getItems={getOrders}
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
          {pageOrders.map(order => (
            <tr key={`${order.id}`}>
              {tableColumns.map(({ label, Component }, index) => (
                <td key={`${order.id}-${label}-${order[label]}`} style={{ maxWidth: 200 }} className="text-truncate text-secondary">
                  {Component ? (
                    <Component
                      id={order.id}
                      index={index}
                      label={label}
                      item={order}
                      type="order"
                      toUrl={`/orders/${order.id}`}
                      status={order.status}
                      statuses={orderStatuses}
                      products={products}
                      removeItem={removeOrder}
                      handleUpdate={updateOrder}
                    />
                  ) : (
                    <span key={`${order.id}-${label}-${order[label]}`}>
                      {(label === 'total' || label === 'shipping') ? (
                        `$${Number.parseFloat(order[label]).toFixed(2)}`
                      ) : (
                        label === 'date' ? (
                          new Date(order[label]).toLocaleDateString("en-US")
                        ) : (
                          order[label] ?? ''
                        )
                      )}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      {
        pageOrders.length === 0 && (
          <div className="text-center">
            <h2>There are no orders to show.</h2>
            <p>Try adding orders or updating your search criteria</p>
          </div>
        )
      }

      {pageCount > 1 && (
        <div>
          <Pagination
            {...bootstrap5PaginationPreset}
            total={pageCount}
            current={pageIndex + 1}
            maxWidth={500}
            previousLabel="<"
            nextLabel=">"
            onPageChange={pageNumber => updatePageIndex(pageNumber - 1, orders)}
          />
        </div>
      )}
    </Container >
  );
}

const mapStateToProps = ({ orders, orderStatuses, products }) => ({ orders, orderStatuses, products });

export default connect(mapStateToProps)(Orders);