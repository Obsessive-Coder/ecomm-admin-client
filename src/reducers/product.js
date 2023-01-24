import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ProductUtil from '../utils/api/ProductUtil';

const apiUtil = new ProductUtil();

export const storeItems = createAsyncThunk(
  'products/storeItems',
  async (params = {}, thunkAPI) => {
    const { data } = await apiUtil.findAll(params);
    return data;
  }
);

export const addItem = createAsyncThunk(
  'products/addItem',
  async (newItem, thunkAPI) => {
    const { data } = await apiUtil.create(newItem);
    return data;
  }
);

export const updateItem = createAsyncThunk(
  'products/updateItem',
  async (updatedItem, thunkAPI) => {
    await apiUtil.update(updatedItem.id, updatedItem);
    return updatedItem;
  }
);

export const removeItem = createAsyncThunk(
  'products/removeItem',
  async (itemId, thunkAPI) => {
    await apiUtil.delete(itemId);
    return itemId;
  }
);

export const productSlice = createSlice({
  name: 'products',
  initialState: { value: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(storeItems.fulfilled, (state, action) => {
      state.value = action.payload;
    });

    builder.addCase(addItem.fulfilled, (state, action) => {
      state.value = [...state.value, action.payload];
    });

    builder.addCase(updateItem.fulfilled, (state, { payload }) => {
      state.value = state.value.map(value => {
        let item = { ...value };
        if (item.id === payload.id) {
          item = { ...payload };
        }
        return { ...item };
      });
    });

    builder.addCase(removeItem.fulfilled, (state, action) => {
      state.value = state.value.filter(({ id }) => id !== action.payload);
    });
  }
});

export const reduxActions = { storeItems, addItem, updateItem, removeItem };

export default productSlice.reducer;

// export default function productReducer(state = [], action) {
//   const { payload, type } = action;
//   let updatedProducts = [...state];

//   switch (type) {
//     case 'STORE_PRODUCTS':
//       updatedProducts = [...payload];
//       break;
//     case 'ADD_PRODUCT':
//       updatedProducts = [...state, payload];
//       break;
//     case 'REMOVE_PRODUCT':
//       updatedProducts = updatedProducts.filter(({ id }) => id !== payload);
//       break;
//     case 'UPDATE_PRODUCT':
//       for (let i = 0; i < updatedProducts.length; i++) {
//         const product = updatedProducts[i];

//         if (product.id === payload.id) {
//           updatedProducts[i] = payload
//           break;
//         }
//       }

//       updatedProducts = [...updatedProducts]
//       break;
//     default:
//       updatedProducts = [...state];
//       break;
//   }

//   return [...updatedProducts];
// };