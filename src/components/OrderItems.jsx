import React from 'react';

// Bootstrap Components.
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { X as XIcon } from 'react-bootstrap-icons';
import { Plus as PlusIcon } from 'react-bootstrap-icons';


export default function OrderItems({ items = [], removeItems }) {
  const handleDeleteAllItems = () => {
    const itemIds = items.map(({ id }) => id);
    removeItems(itemIds);
  };

  return (
    <div>
      <h5>Items</h5>

      <div>
        <Button
          type="button"
          variant="success"
          size="sm"
          className="text-primary"
        >
          <PlusIcon size={24} />
        </Button>

        <Button
          disabled={items.length === 0}
          type="button"
          variant="danger"
          size="sm"
          onClick={handleDeleteAllItems}
          className="mx-2 text-primary"
          style={{ fontSize: 16 }}
        >
          Delete All
        </Button>
      </div>

      <ListGroup variant="flush">
        {items.map(({ id, title, item_price, quantity }) => (
          <ListGroup.Item
            key={`order-item-${title}`}
            className="d-flex justify-content-between align-items-center px-0 text-secondary border-dark"
          >
            <Button
              type="button"
              variant="outline-danger"
              size="sm"
              onClick={() => removeItems([id])}
              className="p-1 border-0"
            >
              <XIcon size={18} />
            </Button>

            <span className="flex-fill px-2">{title}</span>
            <span className="flex-fill">x{quantity}</span>
            <span>${quantity * item_price}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
