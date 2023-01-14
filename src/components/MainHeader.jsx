import React from 'react'

// Bootstrap Components.
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import { List as ListIcon } from 'react-bootstrap-icons';

export default function MainHeader({ handleOpenSidebar }) {
  return (
    <header className="no-print">
      <Navbar expand="md" className="border-bottom border-dark" style={{ height: 50 }}>
        <Container fluid className="justify-content-start">
          <Button
            variant="outline-primary"
            onClick={handleOpenSidebar}
            className="d-lg-none border-0 text-secondary"
          >
            <ListIcon size="28" />
          </Button>

          {/* IMPORTANT: Put additional header items here. */}
        </Container>
      </Navbar>
    </header>
  )
}
