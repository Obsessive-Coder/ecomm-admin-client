import React from 'react'
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

// Bootstrap Components.
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {
  BagFill as BagFillIcon,
  BoxArrowInLeft as BoxArrowInLeftIcon,
  Cart as CartIcon,
  List as ListIcon,
  MenuButtonFill as MenuButtonFillIcon
} from 'react-bootstrap-icons';

// TODO: Put into constants file.
const navItems = [{
  path: '/dashboard',
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
}, {
  path: '/category-types',
  label: 'category types',
  Icon: ListIcon
}, {
  path: '/orders',
  label: 'orders',
  Icon: CartIcon
}, {
  path: '/login',
  label: 'logout',
  Icon: BoxArrowInLeftIcon
}];

export default function Sidebar({ isOpen, handleClose, handleLogout }) {
  const isLargeScreen = useMediaQuery({ query: '(min-width: 992px )' });
  const { pathname } = window.location;

  return (
    <Offcanvas
      scroll={isLargeScreen}
      backdrop={!isLargeScreen}
      show={isLargeScreen || isOpen}
      onHide={handleClose}
      style={{ width: '14rem' }}
      className="shadow no-print"
    >
      <Offcanvas.Header closeButton={!isLargeScreen && isOpen} closeVariant="white" className="border-bottom border-dark" style={{ height: 50 }}>
        <Navbar.Brand className="border-0">
          <Nav.Link as={Link} to="/">
            <Offcanvas.Title>Admin Site</Offcanvas.Title>
          </Nav.Link>
        </Navbar.Brand>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <Nav defaultActiveKey="/dashboard" activeKey={pathname} className="flex-column">
          {navItems.map(({ path, label, Icon }) => (
            <Nav.Item key={`nav-item-${label}`} className="d-flex align-items-center p-2">
              <Icon />
              <Nav.Link
                as={Link}
                to={path}
                active={path === pathname}
                onClick={label === 'logout' ? handleLogout : null}
                className="flex-fill p-2 text-capitalize text-secondary fs-6"
              >
                {label}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
