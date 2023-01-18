import React, { useState } from 'react';
import { useFormInputValidation } from 'react-form-input-validation';

// Bootstrap Components.
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Row from 'react-bootstrap/Row';

// Styles, utils, and other helpers.
import CategoryUtil from '../utils/api/CategoryUtil';
import CategoryTypeUtil from '../utils/api/CategoryTypeUtil';

export default function AddEditCategory(props) {
  const {
    category = {},
    categoryTypes = [],
    type,
    buttonContent,
    buttonVariant = 'primary',
    buttonClassName = '',
    addItem,
    updateItem
  } = props;

  const [fields, errors, form] = useFormInputValidation({
    title: category.title ?? '',
    type: category.type_id ?? ''
  }, {
    title: 'required',
    type: 'required'
  });

  const [isOpen, setIsOpen] = useState(false);
  const handleShow = () => setIsOpen(true);
  const handleHide = () => setIsOpen(false);

  const [isActive, setIsActive] = useState(category?.active ?? false)

  const categoryUtil = new CategoryUtil();
  const categoryTypeUtil = new CategoryTypeUtil();

  const handleSubmit = async event => {
    event.preventDefault();

    const { active } = event.target;
    const { title, type: typeSelect } = fields;

    const isValid = await form.validate(event);
    if (!isValid) return;

    const updatedCategory = {
      ...category,
      title: title,
      active: +active.checked,
      ...(typeSelect ? { type_id: typeSelect } : {})
    };

    if (category.id) {
      // Update the category.
      updateItem(updatedCategory);
    } else {
      // Create a new category.
      const apiUtil = type === 'categoryTypes' ? categoryTypeUtil : categoryUtil;
      const { data } = await apiUtil.create(updatedCategory);
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
            {category.id ? 'Update Category' : 'Create Category'}
            {type === 'categoryTypes' && ' Type'}
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Form noValidate
            onSubmit={handleSubmit}
            className="position-relative h-100"
          >
            <Form.Group as={Row} className="mb-3" controlId="activeForm">
              <Col>
                <Form.Check
                  type="switch"
                  name="active"
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

            {type === 'category' && (
              <Form.Group as={Row} className="mb-3" controlId="typeForm">
                <Col>
                  <FloatingLabel controlId="type" label="Type">
                    <Form.Select
                      aria-label="Category Type"
                      name="type"
                      defaultValue={fields.type}
                      isInvalid={!!errors.type}
                      onBlur={form.handleBlurEvent}
                      onChange={form.handleChangeEvent}
                      className="bg-dark border-secondary text-secondary"
                    >
                      <option value="">Select One</option>

                      {categoryTypes.map(({ id, title }) => (
                        <option key={`${title}-type`} value={id}>
                          {title}
                        </option>
                      ))}
                    </Form.Select>

                    <Form.Control.Feedback type="invalid">
                      {errors.type}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
              </Form.Group>
            )}

            <Form.Group
              as={Row}
              className="position-absolute"
              style={{ left: 0, right: 0, bottom: 0 }}
            >
              <Col className="d-flex">
                <Button variant="outline-secondary" type="button" onClick={handleHide} className="flex-grow-1 mx-2">
                  Cancel
                </Button>

                <Button type="submit" variant="outline-primary" className="flex-grow-1 mx-2 text-success">
                  {category.id ? 'Update' : 'Create'}
                </Button>
              </Col>
            </Form.Group>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
