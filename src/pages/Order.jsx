import React, { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom';

// Bootstrap Components.
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

// Custom Components.
import StatusBadge from '../components/StatusBadge';

// Styles, utils, and other helpers.
import OrderUtil from '../utils/api/OrderUtil';

const orderUtil = new OrderUtil();

const tableColumns = [{
  label: 'product',
  Component: undefined,
  key: 'title'
}, {
  label: 'quantity',
  Component: undefined,
  key: 'quantity'
}, {
  label: 'item price',
  Component: undefined,
  key: 'item_price'
}, {
  label: 'total',
  Component: undefined,
  key: 'total'
}];

export async function loader({ params: { orderId } }) {
  const { data: order } = await new OrderUtil().findOne(orderId);
  return { order };
}

export default function Order() {
  const [order, setOrder] = useState(useLoaderData().order);
  const navigate = useNavigate();

  const {
    id: orderId,
    recipient_name,
    address,
    status,
    date,
    payment,
    shipping,
    total,
    orderItems = [],
  } = order;

  const updateOrder = updatedOrder => {
    setOrder({
      ...order,
      ...updatedOrder
    });
  };

  const deleteOrder = async () => {
    await orderUtil.delete(orderId);
    navigate('/orders');
  };

  return (
    <Container>
      <h1 className="no-print">Order Details</h1>

      <Row className="mt-5">
        <Col xs={12} md={6}>
          <h3 className="fw-bold">Invoice</h3>

          <div>
            <span>Status:{' '}</span>
            <StatusBadge status={status} />
          </div>
        </Col>

        <Col xs={12} md={6} className="text-md-end">
          <h2 className="fw-bold">Company Name</h2>
          <div>
            <small className="d-block">Address Line 1</small>
            <small className="d-block">Address Line 2</small>
            <small className="d-block">Address Line 3</small>
          </div>
        </Col>
      </Row>

      <hr />

      <Row className="my-5">
        <Col xs={12} md={4}>
          <span className="d-block fw-bold">Date</span>
          <span>{new Date(date).toLocaleDateString("en-US")}</span>
        </Col>

        <Col xs={12} md={4} className="d-flex justify-content-md-center my-3 my-md-0">
          <div>
            <span className="d-block fw-bold">Invoice No.</span>
            <span>{`#${888888}`}</span>
          </div>
        </Col>

        <Col xs={12} md={4} className="d-flex justify-content-md-end">
          <div className="text-md-end">
            <span className="d-block fw-bold">Invoice To</span>
            <address>
              <small className="d-block">{recipient_name}</small>
              {address.split(',').map(addressLine => (
                <small key={`address-${addressLine}`} className="d-block">
                  {addressLine}
                </small>
              ))}
            </address>
          </div>
        </Col>
      </Row>

      <Table responsive bordered className="table-dark text-secondary">
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
          {orderItems.map(({ ...item }) => (
            <tr key={`${item.id}`}>
              {tableColumns.map(({ label, key, Component }, index) => (
                <td key={`${item.id}-${label}`} style={{ maxWidth: 200 }} className="text-truncate">
                  {Component ? (
                    <div>COMPONENT</div>
                  ) : (
                    <span className={label === 'total' ? 'fw-bold text-success' : ''}>
                      {(label === 'total' || label === 'item price') && '$'}
                      {label === 'total' && (item.quantity * item.item_price).toFixed(2)}
                      {item[key] ?? ''}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex flex-wrap justify-content-around my-3 p-3 rounded border border-primary">
        <div className="mx-2 me-auto">
          <span className="d-block fw-bold">Payment</span>
          <span>{payment}</span>
        </div>

        <div className="mx-2 me-auto">
          <span className="d-block fw-bold">Shipping</span>
          <span>{`$${shipping.toFixed(2)}`}</span>
        </div>

        <div className="mx-2 me-auto">
          <span className="d-block fw-bold">Discount</span>
          <span>{`$${888.88}`}</span>
        </div>

        <div className="mx-2 me-auto">
          <span className="d-block fw-bold">Total</span>
          <span className="text-success fw-bold" style={{ fontSize: 'large' }}>
            {`$${total.toFixed(2)}`}
          </span>
        </div>
      </div>

      <div>
        <Button onClick={() => { window.print(); return false }} className="no-print text-info">
          Print Invoice
        </Button>
      </div>
    </Container>
  );
}
