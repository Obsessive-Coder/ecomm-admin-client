import React, { useState } from 'react';

// Bootstrap Components.
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Row from 'react-bootstrap/Row';

// Styles, utils, and other helpers.
import ProductUtil from '../utils/api/ProductUtil';

export default function AddEditProduct({ product = {}, buttonContent, className = '', addProduct, updateProduct }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleShow = () => setIsOpen(true);
  const handleHide = () => setIsOpen(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const { title, description, price, active } = event.target;

    const updatedProduct = {
      ...product,
      title: title.value.trim(),
      description: description.value.trim(),
      price: price.value.trim(),
      active: active.checked
    };

    if (product.id) {
      // Update the product.
      ProductUtil.update(product.id, updatedProduct);
      updateProduct(updatedProduct);
    } else {
      // Create a new product.
      ProductUtil.create(updatedProduct);
      addProduct(updatedProduct);
    }

    handleHide();
  };

  return (
    <>
      <Button
        variant="link"
        onClick={handleShow}
        className={`text-secondary action-button ${className}`}
      >
        {buttonContent}
      </Button>

      <Offcanvas show={isOpen} placement="end" onHide={handleHide}>
        <Offcanvas.Header closeButton className="bg-dark text-light">
          <Offcanvas.Title>
            {product.id ? 'Update Product' : 'Create Product'}
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3" controlId="title">
              <Col>
                <FloatingLabel controlId="title" label="Title">
                  <Form.Control type="text" placeholder="Title" defaultValue={product.title} />
                </FloatingLabel>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="description">
              <Col>
                <FloatingLabel controlId="description" label="Description">
                  <Form.Control
                    as="textarea"
                    placeholder="Description"
                    rows={14}
                    defaultValue={product.description}
                  />
                </FloatingLabel>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="price">
              <Col>
                <FloatingLabel controlId="price" label="Price">
                  <Form.Control
                    type="number"
                    placeholder="Price"
                    min={0}
                    defaultValue={product.price}
                  />
                </FloatingLabel>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="active">
              <Col>
                <Form.Check
                  defaultChecked={product.active ?? true}
                  type="switch"
                  id="active"
                  label="Active"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Col className="d-flex">
                <Button variant="outline-secondary" type="button" onClick={handleHide} className="flex-grow-1 mx-2">
                  Cancel
                </Button>

                <Button type="submit" variant="outline-primary" className="flex-grow-1 mx-2">
                  {product.id ? 'Update' : 'Create'}
                </Button>
              </Col>
            </Form.Group>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
