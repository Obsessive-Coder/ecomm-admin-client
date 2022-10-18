import React from 'react'

// Bootstrap Components.
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { List } from 'react-bootstrap-icons';

// Custom Components.
import NavItems from './NavItems';


export default function MainHeader({ isSidebarOpen, handleOpenSidebar, handleCloseSidebar }) {

  return (
    <header>
      <Navbar expand="md" className="border-bottom border-dark" style={{ height: 50 }}>
        <Container fluid className="justify-content-start">
          <Button variant="outline-secondary" className="d-lg-none border-0" onClick={handleOpenSidebar}>
            <List color="dark" size="28" />
          </Button>

          <Navbar.Brand className="d-none d-lg-block">
            <Nav.Link href="/">E-comm Site</Nav.Link>
          </Navbar.Brand>

          <Offcanvas show={isSidebarOpen} onHide={handleCloseSidebar} style={{ width: '14rem' }}>
            <Offcanvas.Header closeButton>
              <Navbar.Brand>
                <Nav.Link href="/">
                  <Offcanvas.Title>E-comm Site</Offcanvas.Title>
                </Nav.Link>
              </Navbar.Brand>
            </Offcanvas.Header>

            <Offcanvas.Body>
              <NavItems />
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </Navbar>
    </header>
  )
}
