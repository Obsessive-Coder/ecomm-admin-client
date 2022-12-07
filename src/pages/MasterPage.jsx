import React, { useState } from 'react';

// Router components and helpers.
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Bootstrap Components.
import Container from 'react-bootstrap/Container';

// Custom components.
import MainHeader from '../components/MainHeader';
import Dashboard from './Dashboard';
import Categories, { loader as categoriesLoader } from './Categories';
import CategoryTypes, { loader as categoryTypesLoader } from './CategoryTypes';
import Order, { loader as orderLoader } from './Order';
import Orders, { loader as ordersLoader } from './Orders';
import Product, { loader as productLoader } from './Product';
import Products, { loader as productsLoader } from './Products';
import Error404 from './Error404';
import Sidebar from '../components/Sidebar';

// Styles, utils, and other helpers.
import '../style.css';

const router = createBrowserRouter([{
  path: '/',
  element: <Dashboard />,
  errorElement: <Error404 />,
}, {
  path: '/products',
  element: <Products />,
  loader: productsLoader
}, {
  path: '/products/:productId',
  element: <Product />,
  errorElement: <Error404 />,
  loader: productLoader
}, {
  path: '/categories',
  element: <Categories />,
  loader: categoriesLoader
}, {
  path: '/category-types',
  element: <CategoryTypes />,
  loader: categoryTypesLoader
}, {
  path: '/orders',
  element: <Orders />,
  loader: ordersLoader
},
{
  path: '/orders/:orderId',
  element: <Order />,
  loader: orderLoader
}
]);

export default function MasterPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebarIsOpen = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Container fluid>
      <MainHeader handleOpenSidebar={toggleSidebarIsOpen} />

      <div id="sidebar">
        <Sidebar isOpen={isSidebarOpen} handleClose={toggleSidebarIsOpen} />
      </div>

      <Container className="page-content">
        <RouterProvider router={router} />
      </Container>
    </Container>
  )
}
