import React, { useState } from 'react';

// Bootstrap Components.
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Row from 'react-bootstrap/Row';

// Custom Components.
import OrderItems from './OrderItems';

// Styles, utils, and other helpers.
import OrderUtil from '../utils/api/OrderUtil';
import OrderItemUtil from '../utils/api/OrderItemUtil';

export default function AddEditOrder(props) {
  const {
    order = {},
    statuses = [],
    products = [],
    buttonContent,
    buttonVariant = 'primary',
    buttonClassName = '',
    addItem,
    updateItem,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const handleShow = () => setIsOpen(true);
  const handleHide = () => setIsOpen(false);

  const handleCancelClick = () => {
    setOrderItems(order.items);
    handleHide();
  }

  const [orderItems, setOrderItems] = useState(order?.items ?? []);
  const addItems = function (items = []) {
    setOrderItems([...orderItems, ...items]);
  };

  const removeItems = productIds => {
    const updatedOrderItems = orderItems.filter(({ Product: { id } }) => !productIds.includes(id));
    setOrderItems(updatedOrderItems);
  };

  const orderUtil = new OrderUtil();
  const orderItemUtil = new OrderItemUtil();

  const handleSubmit = async event => {
    event.preventDefault();

    const { address, phone, payment, status } = event.target;
    const { selectedIndex, options: statusOptions, value: status_id } = status;

    const updatedOrder = {
      ...order,
      address: address.value.trim(),
      phone: phone.value.trim(),
      payment: payment.value,
      ...(selectedIndex ? {
        status_id,
        status: statusOptions[selectedIndex].text
      } : {})
    };

    if (order.id) {
      // Update the order.
      updateItem({ ...updatedOrder });

      const updatedOrderItemIds = orderItems.map(({ id }) => id);
      const deletedItemIds = order.items
        .filter(({ id }) => !updatedOrderItemIds.includes(id))
        .map(({ id }) => id);

      if (deletedItemIds.length > 0) {
        await deletedItemIds.map(itemId => orderItemUtil.delete(itemId));

        if (orderItems.length === 0) {
          await orderUtil.delete(order.id);
        }
      }

      const newItems = orderItems
        .filter(({ id }) => !id)
        .map(({ quantity, item_price, Product: { id: product_id } }) => ({
          product_id,
          item_price,
          quantity,
          order_id: order.id
        }));

      if (newItems.length > 0) {
        await newItems.map(item => orderItemUtil.create(item));
      }
    } else {
      // Create a new order.
      const { data } = await orderUtil.create(updatedOrder);
      addItem(data);

      const newItems = orderItems
        .map(({ quantity, item_price, Product: { id: product_id } }) => ({
          product_id,
          item_price,
          quantity,
          order_id: data.id
        }));

      await newItems.map(item => orderItemUtil.create(item));
    }

    handleHide();
  };

  return (
    <>
      <Button
        type="button"
        variant={buttonVariant}
        onClick={handleShow}
        className={`action-button ${buttonClassName}`}
      >
        {buttonContent}
      </Button>

      <Offcanvas show={isOpen} placement="end" onHide={handleCancelClick}>
        <Offcanvas.Header closeButton className="bg-dark">
          <Offcanvas.Title>
            {order.id ? 'Update Order' : 'Create Order'}
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="overflow-hidden p-0">
          <Form onSubmit={handleSubmit} className="position-relative h-100">
            <div className="overflow-scroll h-100 px-3 pt-3" style={{ paddingBottom: 75 }}>
              <Form.Group as={Row} className="mb-3" controlId="address">
                <Col>
                  <FloatingLabel controlId="address" label="Address">
                    <Form.Control type="text" placeholder="Address" defaultValue={order.address} className="bg-dark border-secondary text-secondary" />
                  </FloatingLabel>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="phone">
                <Col>
                  <FloatingLabel controlId="phone" label="Phone">
                    <Form.Control type="text" placeholder="Phone" defaultValue={order.phone} className="bg-dark border-secondary text-secondary" />
                  </FloatingLabel>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="payment">
                <Col>
                  <FloatingLabel controlId="payment" label="Payment Type">
                    <Form.Select aria-label="Payment Type" defaultValue={order.payment} className="bg-dark border-secondary text-secondary">
                      <option>Select One</option>

                      {['Card', 'COD'].map(title => (
                        <option key={`${title}-type`} value={title}>
                          {title}
                        </option>
                      ))}
                    </Form.Select>
                  </FloatingLabel>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="status">
                <Col>
                  <FloatingLabel controlId="status" label="Status">
                    <Form.Select aria-label="Status" defaultValue={order.status_id ?? null} className="bg-dark border-secondary text-secondary">
                      <option>Select One</option>

                      {statuses.map(({ id, title }) => (
                        <option key={`${title}-type`} value={id}>
                          {title}
                        </option>
                      ))}
                    </Form.Select>
                  </FloatingLabel>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="items">
                <Col>
                  <OrderItems
                    items={orderItems}
                    products={products}
                    addItems={addItems}
                    removeItems={removeItems}
                  />
                </Col>
              </Form.Group>
            </div>

            <Form.Group
              as={Row}
              className="position-absolute py-2 bg-primary"
              style={{ left: 0, right: 0, bottom: 0 }}
            >
              <Col className="d-flex">
                <Button variant="outline-secondary" type="button" onClick={handleCancelClick} className="flex-grow-1 mx-2">
                  Cancel
                </Button>

                <Button type="submit" variant="outline-primary" className="flex-grow-1 mx-2 text-success">
                  {order.id ? 'Update' : 'Create'}
                </Button>

              </Col>
            </Form.Group>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
