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

export default orderStatusSlice.reducer;