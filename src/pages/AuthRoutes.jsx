import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


// Router components and helpers.
import { createBrowserRouter, Navigate, RouterProvider, redirect } from 'react-router-dom';

// Bootstrap Components.
import Container from 'react-bootstrap/Container';

// Custom Components.
import Dashboard from './Dashboard';
import MasterPage from './MasterPage';
import Order from './Order';
import Product from './Product';

import Error404 from './Error404';
import Login from './Login';
import PageContent from '../components/PageContent';

import pageConfigs from '../utils/pageConfigs';

import { storeUser } from '../reducers/user';

const otherPages = {
  dashboard: { component: Dashboard },
  'orders/:id': { component: Order },
  'products/:id': { component: Product }
};

function AuthRoutes() {
  const dispatch = useDispatch();

  const { uid, email } = useSelector(({ user }) => user.value);
  const isAuthenticated = !!uid;

  const auth = getAuth();
  onAuthStateChanged(auth, async user => {
    if (user) {
      const accessToken = await user.getIdToken();
      if (accessToken !== user.accessToken) {
        dispatch(storeUser({ uid, email, accessToken }))
      }
    } else {
      redirect('/login');
    }
  });

  const withMasterPage = (Component, props = {}) => (
    isAuthenticated ? (
      <MasterPage><Component {...props} /></MasterPage>
    ) : (
      <Navigate replace to="/login" />
    )
  );

  const getRoute = (Component, path, props = {}) => ({
    path: `/${path.toLowerCase()}`,
    errorElement: <Error404 />,
    element: withMasterPage(Component, { key: path, ...props })
  });

  const configRoutes = Object.keys(pageConfigs)
    .map(key => getRoute(PageContent, key, pageConfigs[key]));

  const otherRoutes = Object.keys(otherPages)
    .map(key => getRoute(otherPages[key].component, key, {}));

  const routes = [
    {
      path: '/',
      element: <Navigate replace to={isAuthenticated ? '/dashboard' : '/login'} />,
      errorElement: <Error404 />
    }
  ]
    .concat(configRoutes)
    .concat(otherRoutes)
    .concat([{
      path: '/login',
      element: isAuthenticated ? <Navigate replace to="/dashboard" /> : <Login />,
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

