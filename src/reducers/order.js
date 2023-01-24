export default function orderReducer(state = [], action) {
  const { payload, type } = action;
  let updatedOrders = [...state];

  switch (type) {
    case 'STORE_ORDERS':
      updatedOrders = [...payload];
      break;
    case 'ADD_ORDER':
      updatedOrders = [...state, payload];
      break;
    case 'REMOVE_ORDER':
      updatedOrders = updatedOrders.filter(({ id }) => id !== payload);
      break;
    case 'UPDATE_ORDER':
      for (let i = 0; i < updatedOrders.length; i++) {
        const order = updatedOrders[i];

        if (order.id === payload.id) {
          updatedOrders[i] = payload
          break;
        }
      }

      updatedOrders = [...updatedOrders]
      break;
    default:
      updatedOrders = [...state];
      break;
  }

  return [...updatedOrders];
};