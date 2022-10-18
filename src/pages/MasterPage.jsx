import React, { useState } from 'react';

// Router components and helpers.
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Bootstrap Components.
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

// Custom components.
import MainHeader from '../components/MainHeader';
import Dashboard from './Dashboard';
import Products, { loader as productsLoader } from './Products';
import Product, { loader as productLoader } from './Product';
import Error404 from './Error404';
import NavItems from '../components/NavItems';

// Styles, utils, and other helpers.
import '../style.css';

const router = createBrowserRouter([{
  path: '/',
  element: <Dashboard />,
  errorElement: <Error404 />,
}, {
  path: '/products/',
  element: <Products />,
  loader: productsLoader
}, {
  path: '/products/:productId',
  element: <Product />,
  errorElement: <Error404 />,
  loader: productLoader
}]);

export default function MasterPage({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpenSidebar = () => setIsSidebarOpen(true);

  const handleCloseSidebar = () => setIsSidebarOpen(false)

  return (
    <Container fluid>
      <MainHeader
        isSidebarOpen={isSidebarOpen}
        handleOpenSidebar={handleOpenSidebar}
        handleCloseSidebar={handleCloseSidebar}
      />

      <div className="d-flex">
        <div
          className="d-none d-lg-block offcanvas offcanvas-start show border border-dark"
          style={{ top: 50, left: 12, width: '14rem' }}
        >
          <NavItems />
        </div>

        <div className="flex-fill p-4 page-content">
          <RouterProvider router={router} />
        </div>
      </div>
    </Container>
  )
}
