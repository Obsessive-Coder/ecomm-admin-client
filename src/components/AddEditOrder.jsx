import React, { useState } from 'react';
import { useFormInputValidation } from 'react-form-input-validation';

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

  const [fields, errors, form] = useFormInputValidation({
    address: order.address ?? '',
    phone: order.phone ?? '',
    payment: order.payment ?? '',
    status: order.status_id ?? ''
  }, {
    address: 'required',
    phone: 'required',
    payment: 'required',
    status: 'required'
  });

  const [isOpen, setIsOpen] = useState(false);
  const handleShow = () => setIsOpen(true);
  const handleHide = () => setIsOpen(false);

  const handleCancelClick = () => {
    fields.address = order.address ?? '';
    fields.phone = order.phone ?? '';
    fields.payment = order.payment ?? '';
    fields.status = order.status_id ?? '';

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

  const updateItemQuantity = event => {
    const { target } = event;
    const productId = target.getAttribute('data-product-id');
    const quantity = parseInt(target.value);

    const updatedItems = [...orderItems];

    for (let i = 0; i < updatedItems.length; i++) {
      const item = updatedItems[i];

      if (item.Product.id === productId) {
        updatedItems[i].quantity = quantity;
      }
    }

    setOrderItems(updatedItems);
  };

  const orderUtil = new OrderUtil();
  const orderItemUtil = new OrderItemUtil();

  const handleSubmit = async event => {
    event.preventDefault();

    const { address, phone, payment, status } = fields;

    const isValid = await form.validate(event);
    if (!isValid || orderItems.length === 0) return;

    const updatedOrder = {
      ...order,
      address,
      phone,
      payment,
      status_id: status
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

      if (updatedOrderItemIds.length > 0) {
        const updatedItems = orderItems
          .filter(({ id }) => updatedOrderItemIds.includes(id))
          .map(({ id, quantity, item_price, Product: { id: product_id } }) => ({
            id,
            product_id,
            item_price,
            quantity,
            order_id: order.id
          }));

        await updatedItems.map(item => orderItemUtil.update(item.id, item));
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
          <Form
            noValidate
            onSubmit={handleSubmit}
            className="position-relative h-100"
          >
            <div className="overflow-scroll h-100 px-3 pt-3" style={{ paddingBottom: 75 }}>
              <Form.Group as={Row} className="mb-3" controlId="addressForm">
                <Col>
                  <FloatingLabel controlId="address" label="Address">
                    <Form.Control
                      type="text"
                      name="address"
                      placeholder="Address"
                      defaultValue={fields.address}
                      isInvalid={!!errors.address}
                      onBlur={form.handleBlurEvent}
                      onChange={form.handleChangeEvent}
                      className="bg-dark border-secondary text-secondary"
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="phoneForm">
                <Col>
                  <FloatingLabel controlId="phone" label="Phone">
                    <Form.Control
                      type="text"
                      name="phone"
                      placeholder="Phone"
                      defaultValue={fields.phone}
                      isInvalid={!!errors.phone}
                      onBlur={form.handleBlurEvent}
                      onChange={form.handleChangeEvent}
                      className="bg-dark border-secondary text-secondary"
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.phone}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="paymentForm">
                <Col>
                  <FloatingLabel controlId="payment" label="Payment Type">
                    <Form.Select
                      aria-label="Payment Type"
                      name="payment"
                      defaultValue={fields.payment}
                      isInvalid={!!errors.payment}
                      onBlur={form.handleBlurEvent}
                      onChange={form.handleChangeEvent}
                      className="bg-dark border-secondary text-secondary"
                    >
                      <option value="">Select One</option>

                      {['Card', 'COD'].map(title => (
                        <option key={`${title}-type`} value={title}>
                          {title}
                        </option>
                      ))}
                    </Form.Select>

                    <Form.Control.Feedback type="invalid">
                      {errors.payment}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="statusForm">
                <Col>
                  <FloatingLabel controlId="status" label="Status">
                    <Form.Select
                      aria-label="Status"
                      name="status"
                      defaultValue={fields.status}
                      isInvalid={!!errors.status}
                      onBlur={form.handleBlurEvent}
                      onChange={form.handleChangeEvent}
                      className="bg-dark border-secondary text-secondary"
                    >
                      <option value="">Select One</option>

                      {statuses.map(({ id, title }) => (
                        <option key={`${title}-type`} value={id}>
                          {title}
                        </option>
                      ))}
                    </Form.Select>

                    <Form.Control.Feedback type="invalid">
                      {errors.status}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="itemsForm">
                <Col>
                  <OrderItems
                    items={orderItems ?? []}
                    isExistingOrder={order.id !== undefined}
                    products={products}
                    existingItems={order.items ? order.items : []}
                    addItems={addItems}
                    removeItems={removeItems}
                    updateItemQuantity={updateItemQuantity}
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
