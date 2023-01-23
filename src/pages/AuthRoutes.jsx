import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';

// Router components and helpers.
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Bootstrap Components.
import Container from 'react-bootstrap/Container';

// Custom Components.
import MainHeader from '../components/MainHeader';
import Dashboard from './Dashboard';
import Categories from './Categories';
import CategoryTypes from './CategoryTypes';
import Order, { loader as orderLoader } from './Order';
import Orders from './Orders';
import Product, { loader as productLoader } from './Product';
import Products from './Products';
import Error404 from './Error404';
import Sidebar from '../components/Sidebar';

// Style, utils, and other helpers.
import CategoryUtil from '../utils/api/CategoryUtil';
import CategoryTypeUtil from '../utils/api/CategoryTypeUtil';
import OrderUtil from '../utils/api/OrderUtil';
import OrderStatusUtil from '../utils/api/OrderStatusUtil';
import ProductUtil from '../utils/api/ProductUtil';

const router = createBrowserRouter([{
  path: '/',
  element: <Dashboard />,
  errorElement: <Error404 />,
}, {
  path: '/products',
  element: <Products />
}, {
  path: '/products/:productId',
  element: <Product />,
  errorElement: <Error404 />,
  loader: productLoader
}, {
  path: '/categories',
  element: <Categories />
}, {
  path: '/category-types',
  element: <CategoryTypes />
}, {
  path: '/orders',
  element: <Orders />
},
{
  path: '/orders/:orderId',
  element: <Order />,
  loader: orderLoader
}]);

function AuthRoutes(props) {
  const { handleLogout } = props;

  const dispatch = useDispatch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebarIsOpen = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    (async () => {
      const { data: categories } = await new CategoryUtil()
        .findAll({ order: { column: 'title' } });

      dispatch({ type: 'STORE_CATEGORIES', payload: [...categories] });

      const { data: categoryTypes } = await new CategoryTypeUtil()
        .findAll({ order: { column: 'title' } });

      dispatch({ type: 'STORE_CATEGORY_TYPES', payload: [...categoryTypes] });

      const { data: orders } = await new OrderUtil().findAll({ order: { column: 'updatedAt' } });
      dispatch({ type: 'STORE_ORDERS', payload: [...orders] });

      const { data: orderStatuses } = await new OrderStatusUtil().findAll({ order: { column: 'title' } });
      dispatch({ type: 'STORE_ORDER_STATUSES', payload: orderStatuses });

      const { data: products } = await new ProductUtil().findAll({ order: { column: 'title' } });
      dispatch({ type: 'STORE_PRODUCTS', payload: [...products] });
    })();
  });

  return (
    <div>
      <MainHeader handleOpenSidebar={toggleSidebarIsOpen} />

      <div id="sidebar no-print">
        <Sidebar
          isOpen={isSidebarOpen}
          handleClose={toggleSidebarIsOpen}
          handleLogout={handleLogout}
        />
      </div>

      <Container fluid className="page-content mb-5">
        <RouterProvider router={router} />
      </Container>
    </div>
  );
}

export default connect()(AuthRoutes);
