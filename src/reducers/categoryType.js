import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import CategoryTypeUtil from '../utils/api/CategoryTypeUtil';

const apiUtil = new CategoryTypeUtil();

export const storeItems = createAsyncThunk(
  'category-types/storeItems',
  async (params = {}, thunkAPI) => {
    const { data } = await apiUtil.findAll(params);
    return data;
  }
);

export const addItem = createAsyncThunk(
  'category-types/addItem',
  async (newItem, thunkAPI) => {
    const { data } = await apiUtil.create(newItem);
    return data;
  }
);

export const updateItem = createAsyncThunk(
  'category-types/updateItem',
  async (updatedItem, thunkAPI) => {
    await apiUtil.update(updatedItem.id, updatedItem);
    return updatedItem;
  }
);

export const removeItem = createAsyncThunk(
  'category-types/removeItem',
  async (itemId, thunkAPI) => {
    await apiUtil.delete(itemId);
    return itemId;
  }
);

export const categoryTypeSlice = createSlice({
  name: 'category-types',
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

export const { clearItems } = categoryTypeSlice.actions;
export const reduxActions = { storeItems, addItem, updateItem, removeItem, clearItems };

export default categoryTypeSlice.reducer;