import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { storeItems as storeProducts } from '../reducers/product';

export default function AddEditOrder(props) {
  const dispatch = useDispatch();

  const {
    order = {},
    buttonContent,
    buttonVariant = 'primary',
    buttonClassName = '',
    addItem,
    updateItem,
  } = props;

  const [fields, errors, form] = useFormInputValidation({
    recipient: order.recipient_name ?? '',
    address: order.address ?? '',
    phone: order.phone ?? '',
    shipping: Number.parseFloat(order.shipping ?? 0).toFixed(2),
    payment: order.payment ?? '',
    status: order.status_id ?? ''
  }, {
    recipient: 'required',
    address: 'required',
    phone: 'required|numeric|digits_between:10,12',
    shipping: 'required',
    payment: 'required',
    status: 'required'
  });

  const products = useSelector(state => state.products.value?.rows ?? []);
  const statuses = useSelector(state => state['order-statuses'].value?.rows ?? []);

  const [isOpen, setIsOpen] = useState(false);
  const handleShow = () => setIsOpen(true);
  const handleHide = () => setIsOpen(false);

  const [orderItems, setOrderItems] = useState(order?.items ?? []);

  const handleCancelClick = () => {
    fields.address = order.address ?? '';
    fields.phone = order.phone ?? '';
    fields.payment = order.payment ?? '';
    fields.status = order.status_id ?? '';
    fields.recipient = order.recipient_name ?? '';
    fields.shipping = Number.parseFloat(order.shipping ?? 0).toFixed(2);

    setOrderItems(order?.items ?? []);
    handleHide();
  }

  const addItems = (items = []) => {
    setOrderItems([...orderItems, ...items]);
  };

  const removeItems = productIds => {
    const updatedOrderItems = orderItems
      .filter(({ product_id }) => !productIds.includes(product_id));
    setOrderItems(updatedOrderItems);
  };

  const updateItemQuantity = event => {
    const { target } = event;
    const productId = target.getAttribute('data-product-id');
    let amount = target.getAttribute('data-amount');
    const isIncrementDecrement = amount !== null;

    if (!isIncrementDecrement) {
      amount = target.value
    }

    const updatedItems = [...orderItems];

    for (let i = 0; i < updatedItems.length; i++) {
      let item = updatedItems[i];

      if (item.product_id === productId) {
        const { quantity: productQuantity } = products
          .filter(({ id }) => id === productId)[0];

        const availableQuantity = order?.id === undefined ? productQuantity : productQuantity + item.quantity;

        const newQuantity = isIncrementDecrement ? parseInt(item.quantity) + parseInt(amount) : parseInt(amount);

        if (newQuantity >= 1 && newQuantity <= availableQuantity) {
          item = { ...item, quantity: newQuantity };
          updatedItems[i] = { ...item };
          setOrderItems(updatedItems);
        }

        break;
      }
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const isValid = await form.validate(event);
    if (!isValid || orderItems.length === 0) return;

    const { address, phone, payment, shipping, recipient: recipient_name, status: status_id } = fields;

    const { id: orderId } = order;

    let updatedOrder = {
      address,
      phone,
      payment,
      shipping,
      recipient_name,
      status_id,
    };

    if (orderId) {
      const updatedOrderItemIds = orderItems.map(({ id }) => id);
      const deletedItemIds = order.items
        .filter(({ id }) => !updatedOrderItemIds.includes(id))
        .map(({ id }) => id);

      const newItems = orderItems
        .filter(({ id }) => !id)
        .map(({ quantity, item_price, product_id }) => ({
          product_id,
          item_price,
          quantity,
          order_id: orderId
        }));


      let updatedItems = [];
      if (updatedOrderItemIds.length > 0) {
        updatedItems = orderItems
          .filter(({ id }) => id && updatedOrderItemIds.includes(id))
          .map(({ id, quantity, item_price, product_id }) => ({
            id,
            product_id,
            item_price,
            quantity,
            order_id: orderId
          }));
      }

      // Update the order.
      updatedOrder = {
        ...updatedOrder,
        id: orderId,
      };

      updateItem({ updatedOrder, deletedItemIds, newItems, updatedItems });
    } else {
      // Create a new order.
      const items = orderItems
        .map(({ quantity, item_price, product_id }) => ({
          product_id,
          item_price,
          quantity
        }));

      addItem({ newItem: updatedOrder, items })
      handleCancelClick();
    }

    setTimeout(() => {
      dispatch(storeProducts());
    }, 300);

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
        <Offcanvas.Header closeButton closeVariant="white" className="bg-dark">
          <Offcanvas.Title>
            {order.id ? 'Update Order' : 'Create Order'}
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="overflow-hidden p-0">
          <Form
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            className="position-relative h-100"
          >
            <div className="overflow-scroll h-100 px-3 pt-3" style={{ paddingBottom: 75 }}>
              <Form.Group as={Row} className="mb-3" controlId="recipientForm">
                <Col>
                  <FloatingLabel controlId="recipient" label="Recipient">
                    <Form.Control
                      type="text"
                      name="recipient"
                      placeholder="Recipient"
                      defaultValue={fields.recipient}
                      isInvalid={!!errors.recipient}
                      onBlur={form.handleBlurEvent}
                      onChange={form.handleChangeEvent}
                      className="bg-dark border-secondary text-secondary"
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.recipient}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
              </Form.Group>

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

              <Form.Group as={Row} className="mb-3" controlId="shippingForm">
                <Col>
                  <FloatingLabel controlId="shipping" label="Shipping">
                    <Form.Control
                      type="number"
                      name="shipping"
                      placeholder="Shipping"
                      step={0.01}
                      defaultValue={fields.shipping}
                      isInvalid={!!errors.shipping}
                      onBlur={form.handleBlurEvent}
                      onChange={form.handleChangeEvent}
                      min={0}
                      className="bg-dark border-secondary text-secondary"
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.shipping}
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
                    addItems={addItems.bind(this)}
                    removeItems={removeItems}
                    updateItemQuantity={updateItemQuantity}
                  />
                </Col>
              </Form.Group>
            </div>

            <Form.Group
              as={Row}
              className="position-absolute py-2 bg-dark"
              style={{ left: 0, right: 0, bottom: 0, zIndex: 10 }}
            >
              <Col className="d-flex">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={handleCancelClick}
                  className="flex-grow-1 btn-sm mx-2"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="outline-success"
                  className="flex-grow-1 btn-sm mx-2"
                >
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
