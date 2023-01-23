export default function orderStatusesReducer(state = [], action) {
  const { payload, type } = action;
  let updatedOrderStatuses = [...state];

  switch (type) {
    case 'STORE_ORDER_STATUSES':
      updatedOrderStatuses = [...payload];
      break;
    case 'ADD_ORDER_STATUS':
      updatedOrderStatuses = [...state, payload];
      break;
    case 'REMOVE_ORDER_STATUS':
      updatedOrderStatuses = updatedOrderStatuses.filter(({ id }) => id !== payload);
      break;
    case 'UPDATE_ORDER_STATUS':
      for (let i = 0; i < updatedOrderStatuses.length; i++) {
        const orderStatus = updatedOrderStatuses[i];

        if (orderStatus.id === payload.id) {
          updatedOrderStatuses[i] = payload
          break;
        }
      }

      updatedOrderStatuses = [...updatedOrderStatuses]
      break;
    default:
      updatedOrderStatuses = [...state];
      break;
  }

  return [...updatedOrderStatuses];
};