import React from 'react';

// Bootstrap Components.
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { X as XIcon } from 'react-bootstrap-icons';

// Custom Components.
import AddItemDropdown from './AddItemDropdown';


export default function OrderItems({ items = [], products, addItems, removeItems }) {
  const handleDeleteAllItems = () => {
    const productIds = items.map(({ Product: { id } }) => id);
    removeItems(productIds);
  };

  return (
    <div>
      <h5>Items</h5>

      {items.length === 0 && (
        <small className="invalid-feedback d-block mb-3">
          Orders require at least 1 item
        </small>
      )}

      <div>
        <AddItemDropdown
          key={`order-items-${items.length}`}
          items={items}
          products={products}
          addItems={addItems}
          removeItems={removeItems}
        />

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
        {items.map(({ id, title, item_price, quantity, Product }) => (
          <ListGroup.Item
            key={`order-item-${title}`}
            className="d-flex justify-content-between align-items-center px-0 text-secondary border-dark"
          >
            <Button
              type="button"
              variant="outline-danger"
              size="sm"
              onClick={() => removeItems([Product.id])}
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
