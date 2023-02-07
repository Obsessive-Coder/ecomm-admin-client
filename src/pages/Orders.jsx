import React from 'react'
import { useSelector } from 'react-redux';

// Custom Components.
import PageContent from '../components/PageContent';

// Styles, utils, and other helpers.
import { reduxActions } from '../reducers/order';
import { clearItems as clearStatuses, storeItems as storeStatuses } from '../reducers/orderStatus';
import { clearItems as clearProducts, storeItems as storeProducts } from '../reducers/product';

const actionBarProps = { isSearchVisible: true, isSortVisible: true };

const tableColumns = [{
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

const pageConfig = {
  actionBarProps: { ...actionBarProps },
  loadFunctions: [reduxActions.storeItems, storeStatuses, storeProducts],
  unloadFunctions: [reduxActions.clearItems, clearStatuses, clearProducts],
  tableColumns: [...tableColumns],
  filterField: 'order-statuses'
};

function Orders() {
  return (<PageContent config={pageConfig} reduxActions={reduxActions} />);
}

Orders.displayName = 'Orders';
export default Orders;
