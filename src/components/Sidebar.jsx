import React from 'react'
import { useMediaQuery } from 'react-responsive';

// Bootstrap Components.
import Offcanvas from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {
  BagFill as BagFillIcon,
  List as ListIcon,
  MenuButtonFill as MenuButtonFillIcon
} from 'react-bootstrap-icons';

// TODO: Put into constants file.
const navItems = [{
  path: '/',
  label: 'dashboard',
  Icon: MenuButtonFillIcon,
}, {
  path: '/products',
  label: 'products',
  Icon: BagFillIcon
}, {
  path: '/categories',
  label: 'categories',
  Icon: ListIcon
}];

export default function Sidebar({ isOpen, handleClose }) {
  const isLargeScreen = useMediaQuery({ query: '(min-width: 992px )' });
  return (
    <Offcanvas
      scroll={isLargeScreen}
      backdrop={!isLargeScreen}
      show={isLargeScreen || isOpen}
      onHide={handleClose}
      style={{ width: '14rem' }}
    >
      <Offcanvas.Header closeButton={!isLargeScreen && isOpen} className="border-bottom border-dark" style={{ height: 50 }}>
        <Navbar.Brand>
          <Nav.Link href="/">
            <Offcanvas.Title>E-comm Site</Offcanvas.Title>
          </Nav.Link>
        </Navbar.Brand>
      </Offcanvas.Header>

      <Offcanvas.Body>
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
      </Offcanvas.Body>
    </Offcanvas>
  );
}
