import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import OrderUtil from '../utils/api/OrderUtil';
import OrderItemUtil from '../utils/api/OrderItemUtil';

const apiUtil = new OrderUtil();
const orderItemUtil = new OrderItemUtil();

export const storeItems = createAsyncThunk(
  'orders/storeItems',
  async (params = {}, thunkAPI) => {
    const { data } = await apiUtil.findAll(params);
    return data;
  }
);

export const addItem = createAsyncThunk(
  'orders/addItem',
  async ({ newItem, items }, thunkAPI) => {
    const { data: { id: order_id } } = await apiUtil.create(newItem);

    await Promise.all(items.map(async item => await orderItemUtil.create({ ...item, order_id })));

    const { data } = await apiUtil.findOne(order_id);

    return data;
  }
);

export const updateItem = createAsyncThunk(
  'orders/updateItem',
  async ({ updatedOrder, deletedItemIds = [], newItems = [], updatedItems = [] }, thunkAPI) => {
    await apiUtil.update(updatedOrder.id, updatedOrder);

    if (deletedItemIds.length > 0) {
      await Promise.all(deletedItemIds.map(async id => await orderItemUtil.delete(id)));
    }

    if (newItems.length > 0) {
      await Promise.all(newItems.map(async item => await orderItemUtil.create(item)));
    }

    if (updatedItems.length > 0) {
      await Promise.all(updatedItems.map(async item => await orderItemUtil.update(item.id, item)));
    }

    const { data } = await apiUtil.findOne(updatedOrder.id);
    return data;
  }
);

export const removeItem = createAsyncThunk(
  'orders/removeItem',
  async (itemId, thunkAPI) => {
    await apiUtil.delete(itemId);
    return itemId;
  }
);

export const orderSlice = createSlice({
  name: 'orders',
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

export default orderSlice.reducer;