import React, { useState } from 'react';

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

  const [isOpen, setIsOpen] = useState(false);
  const handleShow = () => setIsOpen(true);
  const handleHide = () => setIsOpen(false);

  const categoryUtil = new CategoryUtil();
  const categoryTypeUtil = new CategoryTypeUtil();

  const handleSubmit = async event => {
    event.preventDefault();

    const { title, active, type: typeSelect } = event.target;

    const updatedCategory = {
      ...category,
      title: title.value.trim(),
      active: active.checked,
      ...(typeSelect ? { type_id: typeSelect.value } : {})
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
        <Offcanvas.Header closeButton className="bg-dark">
          <Offcanvas.Title>
            {category.id ? 'Update Category' : 'Create Category'}
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Form onSubmit={handleSubmit} className="position-relative h-100">
            <Form.Group as={Row} className="mb-3" controlId="active">
              <Col>
                <Form.Check
                  defaultChecked={category.active}
                  type="switch"
                  id="active"
                  label="Active"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="title">
              <Col>
                <FloatingLabel controlId="title" label="Title">
                  <Form.Control type="text" placeholder="Title" defaultValue={category.title} className="text-secondary" />
                </FloatingLabel>
              </Col>
            </Form.Group>

            {type === 'category' && (
              <Form.Group as={Row} className="mb-3" controlId="type">
                <Col>
                  <FloatingLabel controlId="type" label="Type">
                    <Form.Select
                      aria-label="Category Type"
                      defaultValue={category.type_id ?? null}
                      className="text-secondary"
                    >
                      <option>Select One</option>

                      {categoryTypes.map(({ id, title }) => (
                        <option key={`${title}-type`} value={id}>
                          {title}
                        </option>
                      ))}
                    </Form.Select>
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
