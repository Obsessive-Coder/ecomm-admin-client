import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootswatch/dist/slate/bootstrap.min.css";
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import reportWebVitals from './reportWebVitals';
import MasterPage from './pages/MasterPage';

// Reducers.
import categoriesReducer from './reducers/categories';
import categoryTypesReducer from './reducers/categoryTypes';
import ordersReducer from './reducers/orders';
import orderStatusesReducer from './reducers/orderStatuses';
import productsReducer from './reducers/products';

const rootReducer = combineReducers({
  categories: categoriesReducer,
  categoryTypes: categoryTypesReducer,
  orders: ordersReducer,
  orderStatuses: orderStatusesReducer,
  products: productsReducer,
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <MasterPage />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
