import { configureStore } from '@reduxjs/toolkit'

// Reducers.
import categoryTypeReducer from './reducers/categoryTypes';

export default configureStore({
  reducer: {
    //   categories: categoriesReducer,
    categoryTypes: categoryTypeReducer,
    //   orders: ordersReducer,
    //   orderStatuses: orderStatusesReducer,
    //   products: productsReducer
  }
})