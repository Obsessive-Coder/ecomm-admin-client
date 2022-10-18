import React from 'react'

// Bootstrap Components.
import Nav from 'react-bootstrap/Nav';
import { BagFill, MenuButtonFill } from 'react-bootstrap-icons';

// TODO: Put into constants file.
const navItems = [{
  path: '/',
  label: 'dashboard',
  Icon: MenuButtonFill,
}, {
  path: '/products',
  label: 'products',
  Icon: BagFill
}];

export default function NavItems() {
  return (
    <Nav defaultActiveKey="/" className="flex-column">
      {navItems.map(({ path, label, Icon }) => (
        <Nav.Item key={label} className="d-flex align-items-center p-2">
          <Icon />
          <Nav.Link href={path} className="p-2 text-capitalize text-dark">
            {label}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  )
}
