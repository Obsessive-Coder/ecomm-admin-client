import React from 'react';

// Bootstrap Components.
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import { X as XIcon } from 'react-bootstrap-icons';

// Custom Components.
import AddItemDropdown from './AddItemDropdown';


export default function OrderItems(props) {
  const {
    items = [], isExistingOrder, products, addItems, removeItems, updateItemQuantity, existingItems = []
  } = props;
  const handleDeleteAllItems = () => {
    const productIds = items.map(({ product_id }) => product_id);
    removeItems(productIds);
  };

  const isItemExisting = productId => existingItems.filter(({ product_id }) => product_id === productId).length > 0;

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
          items={items}
          products={products.filter(({ active }) => active)}
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
        {items.map(({ id, order_id, item_price, quantity, product_id: productId }) => {
          const { quantity: productQuantity, title } = products
            .filter(({ id }) => id === productId)[0];

          let quantityOptions = [...Array(productQuantity + ((isExistingOrder && isItemExisting(productId)) ? quantity : 0)).keys()];

          const availableQuantity = order_id === undefined ? productQuantity : productQuantity + quantity;

          return (
            <ListGroup.Item
              key={`order-item-${title}-${availableQuantity}`}
              className="d-flex justify-content-between align-items-center px-0 text-secondary border-dark"
            >
              <Button
                type="button"
                variant="outline-danger"
                size="sm"
                onClick={() => removeItems([productId])}
                className="p-1 border-0"
              >
                <XIcon size={18} />
              </Button>

              <div className="d-flex align-items-center flex-fill flex-wrap">
                <span className="flex-fill px-2">{title}</span>

                <InputGroup className="input-group-sm w-auto">
                  <Button
                    variant="outline-danger"
                    data-product-id={productId}
                    data-amount={-1}
                    onClick={updateItemQuantity}
                  >
                    -
                  </Button>

                  <Form.Select
                    key={`quantity-${quantity}`}
                    name="quantity"
                    defaultValue={quantity}
                    data-product-id={productId}
                    onChange={updateItemQuantity}
                    className="mx-2 form-select-sm bg-dark border-secondary text-secondary"
                    style={{ width: 100 }}
                  >
                    {quantityOptions.map(value => (
                      <option key={`quantity-${value + 1}`}>{value + 1}</option>
                    ))}
                  </Form.Select>

                  <Button
                    variant="outline-danger"
                    data-product-id={productId}
                    data-amount={1}
                    onClick={updateItemQuantity}
                  >
                    +
                  </Button>
                </InputGroup>
              </div>
            </ListGroup.Item>
          )
        })}
      </ListGroup>
    </div>
  );
}
