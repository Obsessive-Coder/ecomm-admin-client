import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

// Bootstrap Components.
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

// Other Components.
import Pagination, { bootstrap5PaginationPreset } from 'react-responsive-pagination';

// Custom Components.
import Actions from '../components/Actions';
import ActionBar from '../components/ActionBar';
import ViewLink from '../components/ViewLink';

// Styles, utils, and other helpers.
import OrderUtil from '../utils/api/OrderUtil';
import OrderStatusUtil from '../utils/api/OrderStatusUtil';

export async function loader() {
  const { data: statuses } = await new OrderStatusUtil().findAll({ order: { column: 'title' } });
  const { data: orders } = await new OrderUtil().findAll({ order: { column: 'updatedAt' } });
  return { orders, statuses }
}

const tableColumns = [{
  label: 'date',
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
  label: 'total',
  Component: undefined
}, {
  label: 'status',
  Component: undefined
}, {
  label: 'view',
  Component: ViewLink
}, {
  label: 'actions',
  Component: Actions
}];

export default function Orders() {
  const { statuses } = useLoaderData();
  const [orders, setOrders] = useState(useLoaderData().orders);

  const [rowLimit, setRowLimit] = useState(25);
  const [pageCount, setPageCount] = useState(Math.ceil(orders.length / rowLimit));
  const [pageIndex, setPageIndex] = useState(0);
  const [pageOrders, setPageOrders] = useState(orders.slice(0, rowLimit));

  const orderUtil = new OrderUtil();

  const getOrders = async queryParams => {
    const { data: orders } = await orderUtil.findAll(queryParams);
    setOrders(orders);

    const updatedPageOrders = orders.slice(pageIndex * rowLimit, (pageIndex * rowLimit) + 1);
    setPageOrders(updatedPageOrders);

    setPageCount(Math.ceil(orders.length / rowLimit));
  };

  const addOrder = newOrder => {
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);

    const updatedPageOrders = updatedOrders.slice(pageIndex * rowLimit, (pageIndex * rowLimit) + 1);
    setPageOrders(updatedPageOrders);

    setPageCount(Math.ceil(updatedOrders.length / rowLimit));
  };

  const updateOrder = updatedOrder => {
    const { id: updatedId } = updatedOrder;
    orderUtil.update(updatedId, updatedOrder);

    const updatedOrders = [...orders];
    for (let i = 0; i < updatedOrders.length; i++) {
      const order = updatedOrders[i];

      if (order.id === updatedId) {
        updatedOrders[i] = { ...order, ...updatedOrder };
      }
    }

    updatePageOrders(pageIndex, updatedOrders);
    setOrders([...updatedOrders]);
  };

  const removeOrder = orderId => {
    orderUtil.delete(orderId);

    const filteredOrders = orders.filter(({ id }) => id !== orderId);
    setOrders([...filteredOrders]);

    let updatedPageOrders = filteredOrders.slice(pageIndex * rowLimit, (pageIndex * rowLimit) + rowLimit);

    if (updatedPageOrders.length === 0) {
      updatedPageOrders = filteredOrders.slice((pageIndex - 1) * rowLimit, ((pageIndex - 1) * rowLimit) + rowLimit);
      setPageIndex(pageIndex - 1);
    }

    setPageOrders(updatedPageOrders);
    setPageCount(Math.ceil(filteredOrders.length / rowLimit));
  };

  const updatePageOrders = (index, updatedOrders) => {
    if (index < pageCount) {
      const updatedPageOrders = updatedOrders.slice(index * rowLimit, (index * rowLimit) + rowLimit);

      setPageOrders(updatedPageOrders);
      setPageIndex(index);
    }
  };

  return (
    <Container>
      <h1>Orders</h1>

      <ActionBar
        type="order"
        categories={orders}
        statuses={statuses}
        addItem={addOrder}
        getItems={getOrders}
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
          {pageOrders.map(order => (
            <tr key={`${order.id}`}>
              {tableColumns.map(({ label, Component }, index) => (
                <td key={`${order.id}-${label}-${order[label]}`} style={{ maxWidth: 200 }} className="text-truncate">
                  {Component ? (
                    <Component
                      id={order.id}
                      index={index}
                      label={label}
                      item={order}
                      type="order"
                      toUrl={`/orders/${order.id}`}
                      statuses={statuses}
                      removeItem={removeOrder}
                      handleUpdate={updateOrder}
                    />
                  ) : (
                    <span key={`${order.id}- ${label}-${order[label]}`}>
                      {order[label] ?? ''}
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

      <div>
        <Pagination
          {...bootstrap5PaginationPreset}
          total={pageCount}
          current={pageIndex + 1}
          maxWidth={500}
          previousLabel="<"
          nextLabel=">"
          onPageChange={pageNumber => updatePageOrders(pageNumber - 1, orders)}
        />
      </div>
    </Container >
  );
}
