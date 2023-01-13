import React, { useState } from 'react';

// Bootstrap Components.
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import { Plus as PlusIcon } from 'react-bootstrap-icons';

const CustomMenu = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <Form.Control
          autoFocus
          type="text"
          placeholder="Filter Products"
          defaultValue={value}
          onChange={(e) => setValue(e.target.value)}
          className="form-control-sm mx-2 w-auto bg-dark border-secondary text-secondary"
        />

        <ul className="list-unstyled m-0" style={{ height: 200, overflow: 'auto' }}>
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().includes(value),
          )}
        </ul>
      </div>
    );
  },
);

export default function AddItemDropdown({ items = [], products = [], addItems, removeItems }) {
  const [selectedIds, setSelectedIds] = useState(items.map(({ Product }) => Product.id));

  const handleItemClick = (event) => {
    const itemId = event.target.getAttribute('data-id');
    const isSelected = selectedIds.includes(itemId);

    let updatedSelectedIds = [...selectedIds];
    if (isSelected) {
      updatedSelectedIds = updatedSelectedIds.filter(id => id !== itemId);
      removeItems([itemId]);
    } else {
      updatedSelectedIds.push(itemId);

      const selectedProduct = products.filter(({ id }) => id === itemId)[0];

      addItems([{
        title: selectedProduct.title,
        item_price: selectedProduct.price,
        quantity: 1,
        Product: selectedProduct
      }]);
    }

    setSelectedIds([...updatedSelectedIds]);
  };

  return (
    <Dropdown drop="up" className="d-inline-block">
      <Dropdown.Toggle variant="success" size="sm" className="text-primary add-item-dropdown">
        <PlusIcon size={24} />
      </Dropdown.Toggle>

      <Dropdown.Menu as={CustomMenu}>
        {products.map(({ id, title }, index) => (
          <Dropdown.Item
            key={`product-item-${id}`}
            eventKey={index}
            data-id={id}
            active={selectedIds.includes(id)}
            onClick={handleItemClick}
          >
            {title}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
