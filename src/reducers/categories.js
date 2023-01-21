export default function categoriesReducer(state = [], action) {
  const { payload, type } = action;
  let updatedCategories = [...state];

  switch (type) {
    case 'STORE_CATEGORIES':
      updatedCategories = [...payload];
      break;
    case 'ADD_CATEGORY':
      updatedCategories = [...state, payload];
      break;
    case 'REMOVE_CATEGORY':
      updatedCategories = updatedCategories.filter(({ id }) => id !== payload);
      break;
    case 'UPDATE_CATEGORY':
      for (let i = 0; i < updatedCategories.length; i++) {
        const category = updatedCategories[i];

        if (category.id === payload.id) {
          updatedCategories[i] = payload
          break;
        }
      }

      updatedCategories = [...updatedCategories]
      break;
    default:
      updatedCategories = [...state];
      break;
  }

  return [...updatedCategories];
};