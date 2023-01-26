import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// Router components and helpers.
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Firebase.
import firebase from 'firebase/compat/app';
import { onAuthStateChanged } from 'firebase/auth';

// Bootstrap Components.
import Container from 'react-bootstrap/Container';

// Custom Components.
import Categories from './Categories';
import CategoryTypes from './CategoryTypes';
import Dashboard from './Dashboard';
import Error404 from './Error404';
import Login from './Login';
import MasterPage from './MasterPage';
import Order, { loader as orderLoader } from './Order';
import Orders from './Orders';
import Product, { loader as productLoader } from './Product';
import Products from './Products';

export default function AuthRoutes(props) {
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

  const handleLogout = () => {
    firebase.auth().signOut();
    setUser({});
    localStorage.setItem('user', JSON.stringify({}));
  };

  const router = createBrowserRouter([{
    path: '/',
    element: (
      <MasterPage handleLogout={handleLogout}><Dashboard /></MasterPage>
    ),
    errorElement: <Error404 />,
  }, {
    path: '/products',
    element: (
      <MasterPage handleLogout={handleLogout}><Products /></MasterPage>
    ),
    errorElement: <Error404 />,
  }, {
    path: '/products/:productId',
    element: (
      <MasterPage handleLogout={handleLogout}><Product /></MasterPage>
    ),
    errorElement: <Error404 />,
    loader: productLoader
  }, {
    path: '/categories',
    element: (
      <MasterPage handleLogout={handleLogout}><Categories /></MasterPage>
    ),
    errorElement: <Error404 />,
  }, {
    path: '/category-types',
    element: (
      <MasterPage handleLogout={handleLogout}><CategoryTypes /></MasterPage>
    ),
    errorElement: <Error404 />,
  }, {
    path: '/orders',
    element: (
      <MasterPage handleLogout={handleLogout}><Orders /></MasterPage>
    ),
    errorElement: <Error404 />,
  },
  {
    path: '/orders/:orderId',
    element: (
      <MasterPage handleLogout={handleLogout}><Order /></MasterPage>
    ),
    errorElement: <Error404 />,
    loader: orderLoader
  }]);

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
        <RouterProvider router={router} />
      ) : (
        <Login auth={firebase.auth()} />
      )}
    </Container>
  );
}
