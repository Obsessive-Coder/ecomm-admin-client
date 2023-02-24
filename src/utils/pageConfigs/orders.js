// Redux stores and actions.
import { reduxActions } from '../../reducers/order';
import { clearItems as clearStatuses, storeItems as storeStatuses } from '../../reducers/orderStatus';
import { clearItems as clearProducts, storeItems as storeProducts } from '../../reducers/product';

export const actionBarProps = { isSearchVisible: true, isSortVisible: true };

export const tableColumns = [{
  label: 'date',
  componentName: 'Data'
}, {
  label: 'recipient_name',
  componentName: 'Data'
}, {
  label: 'address',
  componentName: 'Data'
}, {
  label: 'phone',
  componentName: 'Data'
}, {
  label: 'payment',
  componentName: 'Data'
}, {
  label: 'shipping',
  componentName: 'Data'
}, {
  label: 'total',
  componentName: 'Data'
},
{
  label: 'status',
  componentName: 'StatusBadge'
}, {
  label: 'view',
  componentName: 'ViewLink'
}, {
  label: 'actions',
  componentName: 'Actions'
}];

export const pageConfig = {
  reduxActions,
  config: {
    actionBarProps: { ...actionBarProps },
    loadFunctions: [storeStatuses, storeProducts],
    unloadFunctions: [reduxActions.clearItems, clearStatuses, clearProducts],
    tableColumns: [...tableColumns],
    filterField: 'order-statuses'
  }
};

export default pageConfig;