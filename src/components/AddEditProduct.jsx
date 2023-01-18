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
import ImageUpload from './ImageUpload';

// Styles, utils, and other helpers.
import FileUtil from '../utils/api/FIleUtil';
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

  const [fields, errors, form] = useFormInputValidation({
    title: product.title ?? '',
    description: product.description ?? '',
    price: product.price ?? '',
    quantity: product.quantity ?? '',
    category: product.category_id ?? ''
  }, {
    title: 'required',
    description: 'required',
    price: 'required',
    quantity: 'required',
    category: 'required'
  });

  const [imageData, setImageData] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const handleShow = () => setIsOpen(true);
  const handleHide = () => setIsOpen(false);

  const [isActive, setIsActive] = useState(product?.active ?? false)

  const fileUtil = new FileUtil();
  const productUtil = new ProductUtil();

  const handleSubmit = async event => {
    event.preventDefault();

    const { active } = event.target;
    const { title, description, price, category, quantity } = fields;

    const isValid = await form.validate(event);
    if (!isValid) return;

    const updatedProduct = {
      ...product,
      title,
      description,
      price: parseFloat(parseFloat(price).toFixed(4)),
      quantity: parseInt(quantity),
      active: +active.checked,
      category_id: category,
      image_url: 'https://via.placeholder.com/350x150'
    };

    if (imageData) {
      const { data: url } = await fileUtil.create(imageData);
      updatedProduct.image_url = url;
    }

    if (product.id) {
      // Update the product.
      productUtil.update(product.id, updatedProduct);
      updateItem(updatedProduct);
    } else {
      // Create a new product.
      const { data } = await productUtil.create(updatedProduct);
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
        <Offcanvas.Header closeButton closeVariant="white" className="bg-dark">
          <Offcanvas.Title>
            {product.id ? 'Update Product' : 'Create Product'}
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="overflow-hidden p-0">
          <Form
            noValidate
            onSubmit={handleSubmit}
            className="position-relative h-100"
          >
            <div className="overflow-scroll h-100 px-3 pt-3" style={{ paddingBottom: 75 }}>
              <Form.Group as={Row} className="mb-3" controlId="imageForm">
                <Col>
                  <ImageUpload
                    imageUrl={imageData?.image ?? product.image_url}
                    setImageData={setImageData}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="activeForm">
                <Col>
                  <Form.Check
                    name="active"
                    type="switch"
                    id="active"
                    label="Active"
                    checked={isActive}
                    onChange={() => setIsActive(!isActive)}
                    className="active-switch"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="titleForm">
                <Col>
                  <FloatingLabel controlId="title" label="Title">
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder="Title"
                      defaultValue={fields.title}
                      isInvalid={!!errors.title}
                      onBlur={form.handleBlurEvent}
                      onChange={form.handleChangeEvent}
                      className="bg-dark border-secondary text-secondary"
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.title}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="descriptionForm">
                <Col>
                  <FloatingLabel controlId="description" label="Description">
                    <Form.Control
                      as="textarea"
                      name="description"
                      placeholder="Description"
                      defaultValue={fields.description}
                      isInvalid={!!errors.description}
                      onBlur={form.handleBlurEvent}
                      onChange={form.handleChangeEvent}
                      rows={14}
                      className="bg-dark border-secondary text-secondary"
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="priceForm">
                <Col>
                  <FloatingLabel controlId="price" label="Price">
                    <Form.Control
                      type="number"
                      name="price"
                      placeholder="Price"
                      defaultValue={fields.price}
                      isInvalid={!!errors.price}
                      onBlur={form.handleBlurEvent}
                      onChange={form.handleChangeEvent}
                      min={0}
                      className="bg-dark border-secondary text-secondary"
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.price}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="quantityForm">
                <Col>
                  <FloatingLabel controlId="quantity" label="Quantity">
                    <Form.Control
                      type="number"
                      name="quantity"
                      placeholder="Quantity"
                      defaultValue={fields.quantity}
                      isInvalid={!!errors.quantity}
                      onBlur={form.handleBlurEvent}
                      onChange={form.handleChangeEvent}
                      min={0}
                      className="bg-dark border-secondary text-secondary"
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.quantity}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="categoryForm">
                <Col>
                  <FloatingLabel controlId="category" label="Category">
                    <Form.Select
                      aria-label="Category"
                      name="category"
                      defaultValue={fields.category}
                      isInvalid={!!errors.category}
                      onBlur={form.handleBlurEvent}
                      onChange={form.handleChangeEvent}
                      className="bg-dark border-secondary text-secondary"
                    >
                      <option value="">Select One</option>

                      {categories.map(({ id, title }) => (
                        <option key={`${title}-category`} value={id}>
                          {title}
                        </option>
                      ))}
                    </Form.Select>

                    <Form.Control.Feedback type="invalid">
                      {errors.category}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
              </Form.Group>
            </div>

            <Form.Group
              as={Row}
              className="position-absolute py-2 bg-primary"
              style={{ left: 0, right: 0, bottom: 0 }}
            >
              <Col className="d-flex">
                <Button variant="outline-secondary" type="button" onClick={handleHide} className="flex-grow-1 mx-2">
                  Cancel
                </Button>

                <Button type="submit" variant="outline-primary" className="flex-grow-1 mx-2 text-success">
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
