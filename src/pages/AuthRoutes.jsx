import React from 'react';
import { useSelector } from 'react-redux';

// Router components and helpers.
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

// Bootstrap Components.
import Container from 'react-bootstrap/Container';

// Custom Components.
import Dashboard from './Dashboard';
import MasterPage from './MasterPage';
import Order, { loader as orderLoader } from './Order';
import Product, { loader as productLoader } from './Product';

import Error404 from './Error404';
import Login from './Login';
import PageContent from '../components/PageContent';

import pageConfigs from '../utils/pageConfigs';

const otherPages = {
  dashboard: { loader: () => null, component: Dashboard },
  'orders/:id': { loader: orderLoader, component: Order },
  'products/:id': { loader: productLoader, component: Product }
};

function AuthRoutes() {
  const { uid: userId } = useSelector(({ user }) => user.value);
  const isAuthenticated = !!userId;

  const withMasterPage = (Component, props = {}) => (
    isAuthenticated ? (
      <MasterPage><Component {...props} /></MasterPage>
    ) : (
      <Navigate to="/login" />
    )
  );

  const getRoute = (Component, path, props = {}, loader = () => null) => ({
    path: `/${path.toLowerCase()}`,
    errorElement: <Error404 />,
    element: withMasterPage(Component, { key: path, ...props }),
    loader
  });

  const configRoutes = Object.keys(pageConfigs)
    .map(key => getRoute(PageContent, key, pageConfigs[key]));

  const otherRoutes = Object.keys(otherPages)
    .map(key => getRoute(otherPages[key].component, key, {}, otherPages[key].loader));

  const routes = [{
    path: '/',
    element: <Navigate to={isAuthenticated ? '/dashboard' : '/login'} />,
    errorElement: <Error404 />
  }]
    .concat(configRoutes)
    .concat(otherRoutes)
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

AuthRoutes.displayName = 'AuthRoutes';
export default AuthRoutes;

