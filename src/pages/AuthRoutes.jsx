import React from 'react';
import { useSelector } from 'react-redux';

// Router components and helpers.
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

// Bootstrap Components.
import Container from 'react-bootstrap/Container';

// Custom Components.
import Categories from './Categories';
import CategoryTypes from './CategoryTypes';
import Dashboard from './Dashboard';
import MasterPage from './MasterPage';
import Order, { loader as orderLoader } from './Order';
import Orders from './Orders';
import Product, { loader as productLoader } from './Product';
import Products from './Products';

import Error404 from './Error404';
import Login from './Login';

const pages = [
  Categories,
  CategoryTypes,
  Dashboard,
  Order,
  Orders,
  Product,
  Products,
];

const getPathname = str => {
  // Taken from https://plainenglish.io/blog/convert-string-to-different-case-styles-snake-kebab-camel-and-pascal-case-in-javascript-da724b7220d7

  console.log('HERE: ', str);
  return `/${str.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(char => char.toLowerCase())
    .join('-')}`
};

export default function AuthRoutes() {
  const { uid: userId } = useSelector(({ user }) => user.value);
  const isAuthenticated = !!userId;

  const x = [{
    path: '/dashboard',
    element: Dashboard,
    errorElement: <Error404 />
  }];

  // const authRoutes = x.map(x => ({
  //   ...x,
  //   element: <MasterPage><x.element /></MasterPage>
  // }))

  const authRoutes = pages.map(PageComponent => {
    return ({
      path: getPathname(PageComponent.name),
      element: isAuthenticated ? (
        <MasterPage><PageComponent /></MasterPage>
      ) : (
        <Navigate to="/login" />
      ),
      errorElement: <Error404 />
    })
  });

  console.log(authRoutes)

  const routes = [{
    path: '/',
    element: <Navigate to={isAuthenticated ? '/dashboard' : '/login'} />,
    errorElement: <Error404 />
  }]
    .concat([...authRoutes])
    .concat([{
      path: '/login',
      element: isAuthenticated ? <Navigate to="/dashboard" /> : <Login />,
      errorElement: <Error404 />
    }]);

  const router = createBrowserRouter(routes);;

  return (
    <Container fluid>
      <RouterProvider router={router} />
    </Container>
  );
}
