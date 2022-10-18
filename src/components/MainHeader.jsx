import React from 'react'

// Bootstrap Components.
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


export default function MainHeader() {

  return (
    <header>
      <Navbar expand="md" className="border-bottom border-dark">
        <Container fluid className="justify-content-start">
          <Navbar.Toggle aria-controls="main-nav" />

          <Navbar.Brand>
            <Nav.Link href="/">E-comm Site</Nav.Link>
          </Navbar.Brand>

          <Navbar.Collapse id="main-nav">
            <Nav>
              Sidebar Content
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}
