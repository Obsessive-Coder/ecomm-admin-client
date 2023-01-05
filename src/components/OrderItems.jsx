import React from 'react';

// Bootstrap Components.
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';


export default function OrderItems({ items }) {
  return (
    <div>
      <h5>Items</h5>

      <div>
        <Button type="button" variant="success" className="btn-sm text-primary">
          Add
        </Button>

        <Button type="button" variant="info" className="btn-sm text-primary">
          Edit
        </Button>
      </div>

      <ListGroup variant="flush">
        {items.map(({ title, item_price, quantity, }) => (
          <ListGroup.Item
            key={`order-item-${title}`}
            className="d-flex justify-content-between text-secondary border-dark"
          >
            <span>{title}</span>
            <span>x{quantity}</span>
            <span>${quantity * item_price}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
