import React, { useState } from 'react';

// Bootstrap Components.
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function Confirm({ children, title, buttonContent, buttonClassName, handleConfirm }) {
  const [isOpen, setIsOpen] = useState(false);
  const show = () => setIsOpen(true);
  const hide = () => setIsOpen(false);

  const handleConfirmClick = () => {
    handleConfirm();
    hide();
  };

  return (
    <>
      <Button variant="link" onClick={show} className={`${buttonClassName}`}>
        {buttonContent}
      </Button>

      <Modal
        // size="sm"
        show={isOpen}
        onHide={hide}
        aria-labelledby="confirm-modal"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title id="confirm-modal">
            {title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {children}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={hide}>Cancel</Button>
          <Button variant="outline-primary" onClick={handleConfirmClick}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
