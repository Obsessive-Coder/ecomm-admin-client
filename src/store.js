import { configureStore } from '@reduxjs/toolkit'

// Reducers.
import categoryReducer from './reducers/category';
import categoryTypeReducer from './reducers/categoryType';
import orderReducer from './reducers/order';
import orderStatusReducer from './reducers/orderStatus';
import productReducer from './reducers/product';
import userReducer from './reducers/user';

export default configureStore({
  reducer: {
    categories: categoryReducer,
    'category-types': categoryTypeReducer,
    orders: orderReducer,
    'order-statuses': orderStatusReducer,
    products: productReducer,
    user: userReducer
  }
})