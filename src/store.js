import { configureStore } from '@reduxjs/toolkit'

// Reducers.
import categoryReducer from './reducers/category';
import categoryTypeReducer from './reducers/categoryType';
import productReducer from './reducers/product';

export default configureStore({
  reducer: {
    categories: categoryReducer,
    ['category-types']: categoryTypeReducer,
    //   orders: orderReducer,
    //   orderStatuses: orderStatusReducer,
    products: productReducer
  }
})