import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Link } from 'react-router-dom';

// Bootstrap Components.
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { BoxArrowRight as BoxArrowRightIcon } from 'react-bootstrap-icons';

// Custom Components.
import Actions from '../components/Actions';
import ActionBar from '../components/ActionBar';
import ActiveSwitch from '../components/ActiveSwitch';

// Styles, utils, and other helpers.
import OrderUtil from '../utils/api/OrderUtil';
import OrderStatusUtil from '../utils/api/OrderStatusUtil';

export async function loader() {
  const { data: statuses } = await new OrderStatusUtil().findAll({ order: { column: 'title' } });
  const { data: orders } = await new OrderUtil().findAll({ order: { column: 'updatedAt' } });
  return { orders, statuses }
}

const ViewLink = ({ id }) => (
  <Link to={`/orders/${id}`}>
    <BoxArrowRightIcon />
  </Link>
)

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
  label: 'actions',
  Component: ViewLink
}];

export default function Orders() {
  const { statuses } = useLoaderData();
  const [orders, setOrders] = useState(useLoaderData().orders);

  const [rowLimit, setRowLimit] = useState(25);
  const [pageCount, setPageCount] = useState(Math.ceil(orders.length / rowLimit));
  const [pageIndex, setPageIndex] = useState(0);
  const [pageOrders, setPageOrders] = useState(orders.slice(0, rowLimit));

  const getOrders = async queryParams => { };

  const addOrder = newOrder => { };

  const removeOrder = orderId => { };

  const updateOrder = updatedOrder => { };

  const updatePageOrders = index => { };

  const getTotal = orderItems => {
    console.log(orderItems);
  };

  return (
    <Container>
      <h1>Orders</h1>

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
                      removeItem={removeOrder}
                      handleUpdate={updateOrder}
                    />
                  ) : (
                    <span key={`${order.id}-${label}-${order[label]}`}>
                      {order[label] ?? ''}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
