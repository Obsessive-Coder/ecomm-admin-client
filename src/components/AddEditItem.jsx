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

export default function AddEditItem(props) {
  const handleCancelClick = () => {
    handleHide();
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (item.id) {
      alert('Update Data');
    } else {
      alert('Create Data');
    }
  };

  const {
    item = {},
    type,
    buttonContent,
    buttonVariant = 'primary',
    buttonClassName = '',
    addItem,
    updateItem
  } = props;

  const { id: itemId } = item;

  const [isOpen, setIsOpen] = useState(false);
  const handleShow = () => setIsOpen(true);
  const handleHide = () => setIsOpen(false);

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
            {itemId ? 'Update' : 'Create'}
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Form noValidate
            onSubmit={handleSubmit}
            className="position-relative h-100"
          >

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
                  {itemId ? 'Update' : 'Create'}
                </Button>

              </Col>
            </Form.Group>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
