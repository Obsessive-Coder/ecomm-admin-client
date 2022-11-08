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

export default function AddEditProduct(props) {
  const {
    product = {},
    categories = [],
    buttonContent,
    buttonVariant = 'primary',
    buttonClassName = '',
    addItem,
    updateItem
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const handleShow = () => setIsOpen(true);
  const handleHide = () => setIsOpen(false);

  const handleSubmit = async event => {
    event.preventDefault();

    const { title, description, price, active, category, quantity } = event.target;

    const updatedProduct = {
      ...product,
      title: title.value.trim(),
      description: description.value.trim(),
      price: parseFloat(price.value.trim()).toFixed(2),
      quantity: parseInt(quantity.value.trim()),
      active: active.checked,
      category_id: category.value
    };

    if (product.id) {
      // Update the product.
      ProductUtil.update(product.id, updatedProduct);
      updateItem(updatedProduct);
    } else {
      // Create a new product.
      const { data } = await ProductUtil.create(updatedProduct);
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
            {product.id ? 'Update Product' : 'Create Product'}
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Form onSubmit={handleSubmit} className="position-relative h-100">
            <Form.Group as={Row} className="mb-3" controlId="active">
              <Col>
                <Form.Check
                  defaultChecked={product.active}
                  type="switch"
                  id="active"
                  label="Active"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="title">
              <Col>
                <FloatingLabel controlId="title" label="Title">
                  <Form.Control type="text" placeholder="Title" defaultValue={product.title} className="text-secondary" />
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
                    className="text-secondary"
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
                    className="text-secondary"
                  />
                </FloatingLabel>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="quantity">
              <Col>
                <FloatingLabel controlId="quantity" label="Quantity">
                  <Form.Control
                    type="number"
                    placeholder="Quantity"
                    min={0}
                    defaultValue={product.quantity}
                    className="text-secondary"
                  />
                </FloatingLabel>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="category">
              <Col>
                <FloatingLabel controlId="category" label="Category">
                  <Form.Select aria-label="Category" defaultValue={product.category_id ?? null} className="text-secondary">
                    <option>Select One</option>

                    {categories.map(({ id, title }) => (
                      <option key={`${title}-category`} value={id}>
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
