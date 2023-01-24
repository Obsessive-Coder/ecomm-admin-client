import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';

// Bootstrap Components.
import Container from 'react-bootstrap/Container';

// Custom Components.
import MainHeader from '../components/MainHeader';
import Sidebar from '../components/Sidebar';

// Style, utils, and other helpers.
import CategoryUtil from '../utils/api/CategoryUtil';
import CategoryTypeUtil from '../utils/api/CategoryTypeUtil';
import OrderUtil from '../utils/api/OrderUtil';
import OrderStatusUtil from '../utils/api/OrderStatusUtil';
import ProductUtil from '../utils/api/ProductUtil';
import { storeItems } from '../reducers/categoryTypes';
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
      const { data: categories } = await new CategoryUtil()
        .findAll({ order: { column: 'title' } });
      dispatch({ type: 'STORE_CATEGORIES', payload: [...categories] });

      // const { data: categoryTypes } = await new CategoryTypeUtil()
      //   .findAll({ order: { column: 'title' } });
      // dispatch(storeItems(categoryTypes));

      const { data: orders } = await new OrderUtil().findAll({ order: { column: 'createdAt' } });
      dispatch({ type: 'STORE_ORDERS', payload: [...orders] });

      const { data: orderStatuses } = await new OrderStatusUtil().findAll({ order: { column: 'title' } });
      dispatch({ type: 'STORE_ORDER_STATUSES', payload: orderStatuses });

      const { data: products } = await new ProductUtil().findAll({ order: { column: 'title' } });
      dispatch({ type: 'STORE_PRODUCTS', payload: [...products] });
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
