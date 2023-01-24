import { createSlice } from '@reduxjs/toolkit'

export const categoryTypeSlice = createSlice({
  name: 'categoryTypes',
  initialState: { value: [] },
  reducers: {
    storeItems: (state, action) => {
      state.value = [...action.payload];
    },
    addItem: (state, action) => {
      state.value = [...state.value, action.payload];
    },
    updateItem: (state, { payload }) => {
      state.value = state.value.map(type => {
        let categoryType = { ...type };
        if (categoryType.id === payload.id) {
          categoryType = { ...payload };
        }
        return { ...categoryType };
      });
    },
    removeItem: (state, { payload }) => {
      state.value = state.value.filter(({ id }) => id !== payload);
    }
  }
})

// Action creators are generated for each case reducer function
export const { storeItems, addItem, updateItem, removeItem } = categoryTypeSlice.actions;

export const { actions: reduxActions } = categoryTypeSlice;

export default categoryTypeSlice.reducer;