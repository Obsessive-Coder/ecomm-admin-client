import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import OrderstatusUtil from '../utils/api/OrderStatusUtil';

const apiUtil = new OrderstatusUtil();

export const storeItems = createAsyncThunk(
  'order-statuses/storeItems',
  async (params = {}, thunkAPI) => {
    const { data } = await apiUtil.findAll(params);
    return data;
  }
);

export const addItem = createAsyncThunk(
  'order-statuses/addItem',
  async (newItem, thunkAPI) => {
    const { data } = await apiUtil.create(newItem);
    return data;
  }
);

export const updateItem = createAsyncThunk(
  'order-statuses/updateItem',
  async (updatedItem, thunkAPI) => {
    await apiUtil.update(updatedItem.id, updatedItem);
    return updatedItem;
  }
);

export const removeItem = createAsyncThunk(
  'order-statuses/removeItem',
  async (itemId, thunkAPI) => {
    await apiUtil.delete(itemId);
    return itemId;
  }
);

export const orderStatusSlice = createSlice({
  name: 'order-statuses',
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

export const { clearItems } = orderStatusSlice.actions;
export const reduxActions = { storeItems, addItem, updateItem, removeItem, clearItems };

export default orderStatusSlice.reducer;