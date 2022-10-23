import React, { useState } from 'react';

// Router components and helpers.
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Bootstrap Components.
import Container from 'react-bootstrap/Container';

// Custom components.
import MainHeader from '../components/MainHeader';
import Dashboard from './Dashboard';
import Products, { loader as productsLoader } from './Products';
import Product, { loader as productLoader } from './Product';
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
}]);

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
