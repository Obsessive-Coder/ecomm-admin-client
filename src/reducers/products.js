export default function productReducer(state = [], action) {
  const { payload, type } = action;
  let updatedProducts = [...state];

  switch (type) {
    case 'STORE_PRODUCTS':
      updatedProducts = [...payload];
      break;
    case 'ADD_PRODUCT':
      updatedProducts = [...state, payload];
      break;
    case 'REMOVE_PRODUCT':
      updatedProducts = updatedProducts.filter(({ id }) => id !== payload);
      break;
    case 'UPDATE_PRODUCT':
      for (let i = 0; i < updatedProducts.length; i++) {
        const product = updatedProducts[i];

        if (product.id === payload.id) {
          updatedProducts[i] = payload
          break;
        }
      }

      updatedProducts = [...updatedProducts]
      break;
    default:
      updatedProducts = [...state];
      break;
  }

  return [...updatedProducts];
};