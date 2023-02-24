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
  reducers: {
    clearItems(state) {
      state.value = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(storeItems.fulfilled, (state, action) => {
      state.value = action.payload;
    });

    builder.addCase(updateItem.fulfilled, (state, { payload }) => {
      const { value } = state;

      state.value = {
        ...value,
        rows: value.rows.map(value => {
          let item = { ...value };
          if (item.id === payload.id) {
            item = { ...payload };
          }
          return { ...item };
        })
      };
    });
  }
});

export const { clearItems } = productSlice.actions;
export const reduxActions = { storeItems, addItem, updateItem, removeItem, clearItems };


export default productSlice.reducer;