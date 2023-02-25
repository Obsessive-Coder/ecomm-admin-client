import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import CategoryUtil from '../utils/api/CategoryUtil';

const apiUtil = new CategoryUtil();

export const storeItems = createAsyncThunk(
  'categories/storeItems',
  async (params = {}, thunkAPI) => {
    const { data } = await apiUtil.findAll(params);
    return data;
  }
);

export const addItem = createAsyncThunk(
  'categories/addItem',
  async (newItem, thunkAPI) => {
    const { data } = await apiUtil.create(newItem);
    return data;
  }
);

export const updateItem = createAsyncThunk(
  'categories/updateItem',
  async (updatedItem, thunkAPI) => {
    await apiUtil.update(updatedItem.id, updatedItem);
    return updatedItem;
  }
);

export const removeItem = createAsyncThunk(
  'categories/removeItem',
  async (itemId, thunkAPI) => {
    await apiUtil.delete(itemId);
    return itemId;
  }
);

export const categorySlice = createSlice({
  name: 'categories',
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

export const { clearItems } = categorySlice.actions;
export const reduxActions = { storeItems, addItem, updateItem, removeItem, clearItems };

export default categorySlice.reducer;