import React, { useState } from 'react';

// Bootstrap Components.
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Row from 'react-bootstrap/Row';

// Styles, utils, and other helpers.
import OrderUtil from '../utils/api/OrderUtil';

export default function AddEditOrder(props) {
  const {
    order = {},
    statuses = [],
    buttonContent,
    buttonVariant = 'primary',
    buttonClassName = '',
    addItem,
    updateItem
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const handleShow = () => setIsOpen(true);
  const handleHide = () => setIsOpen(false);

  const orderUtil = new OrderUtil();

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
      updateItem(updatedOrder);
    } else {
      // Create a new order.
      const { data } = await orderUtil.create(updatedOrder);
      addItem(data);
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

      <Offcanvas show={isOpen} placement="end" onHide={handleHide}>
        <Offcanvas.Header closeButton className="bg-dark">
          <Offcanvas.Title>
            {order.id ? 'Update Category' : 'Create Category'}
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Form onSubmit={handleSubmit} className="position-relative h-100">
            <Form.Group as={Row} className="mb-3" controlId="address">
              <Col>
                <FloatingLabel controlId="address" label="Address">
                  <Form.Control type="text" placeholder="Address" defaultValue={order.address} className="text-secondary" />
                </FloatingLabel>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="phone">
              <Col>
                <FloatingLabel controlId="phone" label="Phone">
                  <Form.Control type="text" placeholder="Phone" defaultValue={order.phone} className="text-secondary" />
                </FloatingLabel>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="payment">
              <Col>
                <FloatingLabel controlId="payment" label="Payment Type">
                  <Form.Select aria-label="Payment Type" defaultValue={order.payment} className="text-secondary">
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
                  <Form.Select aria-label="Status" defaultValue={order.status_id ?? null} className="text-secondary">
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

            <Form.Group
              as={Row}
              className="position-absolute"
              style={{ left: 0, right: 0, bottom: 0 }}
            >
              <Col className="d-flex">
                <Button variant="outline-secondary" type="button" onClick={handleHide} className="flex-grow-1 mx-2">
                  Cancel
                </Button>

                <Button type="submit" variant="outline-primary" className="flex-grow-1 mx-2">
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
