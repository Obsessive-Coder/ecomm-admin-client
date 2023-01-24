import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';

// Bootstrap Components.
import Container from 'react-bootstrap/Container';

// Custom Components.
import MainHeader from '../components/MainHeader';
import Sidebar from '../components/Sidebar';

// Style, utils, and other helpers.
import CategoryUtil from '../utils/api/CategoryUtil';
import OrderUtil from '../utils/api/OrderUtil';
import OrderStatusUtil from '../utils/api/OrderStatusUtil';
import ProductUtil from '../utils/api/ProductUtil';
import '../style.css';

export async function masterPageLoader({ params }) {
  console.log('HERE - Master Page: ', params);
  return null;
}

function MasterPage({ children, handleLogout }) {
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebarIsOpen = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    (async () => {
      const { data: orders } = await new OrderUtil().findAll({ order: { column: 'createdAt' } });
      dispatch({ type: 'STORE_ORDERS', payload: [...orders] });

      const { data: orderStatuses } = await new OrderStatusUtil().findAll({ order: { column: 'title' } });
      dispatch({ type: 'STORE_ORDER_STATUSES', payload: orderStatuses });
    })();
  });

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
