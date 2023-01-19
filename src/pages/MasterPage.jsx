import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import { onAuthStateChanged } from 'firebase/auth';

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
import Login from './Login';
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
}]);

export default function MasterPage() {
  const firebaseConfig = {
    apiKey: "AIzaSyDNCKU_ztvevPFell0ItLvZHj5LXMXvDrM",
    authDomain: "admin-site-7045f.firebaseapp.com",
    projectId: "admin-site-7045f",
    storageBucket: "admin-site-7045f.appspot.com",
    messagingSenderId: "132117631723",
    appId: "1:132117631723:web:0aef2bf89067b71131a4ae",
    measurementId: "G-KE2FHM4V1P"
  };

  firebase.initializeApp(firebaseConfig);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebarIsOpen = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    firebase.auth().signOut();
    setUser({});
    localStorage.setItem('user', JSON.stringify({}));
  };

  useEffect(() => {
    onAuthStateChanged(firebase.auth(), user => {
      let sessionUser = {};

      if (user) {
        sessionUser = { email: user.email, uid: user.uid };
      }

      setUser(sessionUser);
      localStorage.setItem('user', JSON.stringify(sessionUser));
    });
  }, [user.email]);

  return (
    <Container fluid>
      {user.email ? (
        <>
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
          </Container></>
      ) : (
        <Login auth={firebase.auth()} />
      )}
    </Container>
  )
}
