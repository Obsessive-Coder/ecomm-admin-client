import React from 'react';
// Bootstrap Components.
import Dropdown from 'react-bootstrap/Dropdown';
import { Gear as GearIcon } from 'react-bootstrap-icons';


export default function PaginationOptions({ rowLimit = 5, setRowLimit = () => null }) {
  return (
    <Dropdown onSelect={value => setRowLimit(parseInt(value))}>
      <Dropdown.Toggle variant="dark" className="text-info pagination-options">
        <GearIcon />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Header>Items Per Page</Dropdown.Header>

        {[5, 10, 15, 20, 25, 50, 100].map(value => (
          <Dropdown.Item
            key={`row-limit-${value}`}
            active={value === rowLimit}
            eventKey={value}
            className="text-body"
          >
            {value}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
