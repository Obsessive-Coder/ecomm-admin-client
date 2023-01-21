export default function categoryTypesReducer(state = [], action) {
  const { payload, type } = action;
  let updatedCategoryTypes = [...state];

  switch (type) {
    case 'STORE_CATEGORY_TYPES':
      updatedCategoryTypes = [...payload];
      break;
    case 'ADD_CATEGORY_TYPE':
      updatedCategoryTypes = [...state, payload];
      break;
    case 'REMOVE_CATEGORY_TYPE':
      updatedCategoryTypes = updatedCategoryTypes
        .filter(({ id }) => id !== payload);
      break;
    case 'UPDATE_CATEGORY_TYPE':
      for (let i = 0; i < updatedCategoryTypes.length; i++) {
        const categoryType = updatedCategoryTypes[i];

        if (categoryType.id === payload.id) {
          updatedCategoryTypes[i] = payload
          break;
        }
      }

      updatedCategoryTypes = [...updatedCategoryTypes]
      break;
    default:
      updatedCategoryTypes = [...state];
      break;
  }

  return [...updatedCategoryTypes];
};