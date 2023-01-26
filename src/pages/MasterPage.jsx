import React, { useState } from 'react';
import { connect } from 'react-redux';

// Bootstrap Components.
import Container from 'react-bootstrap/Container';

// Custom Components.
import MainHeader from '../components/MainHeader';
import Sidebar from '../components/Sidebar';

// Style, utils, and other helpers.
import '../style.css';

function MasterPage({ children, handleLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebarIsOpen = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Container fluid>
      <MainHeader handleOpenSidebar={toggleSidebarIsOpen} />

      <Sidebar
        isOpen={isSidebarOpen}
        handleClose={toggleSidebarIsOpen}
        handleLogout={handleLogout}
      />

      <Container fluid className="page-content mb-5">
        {children}
      </Container>
    </Container>
  )
}

export default connect()(MasterPage);
