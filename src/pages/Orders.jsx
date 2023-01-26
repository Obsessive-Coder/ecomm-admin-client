import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';

// Custom Components.
import PageContent from '../components/PageContent';

// Styles, utils, and other helpers.
import { reduxActions } from '../reducers/order';
import { storeItems as storeStatuses } from '../reducers/orderStatus';
import { storeItems as storeProducts } from '../reducers/product';

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

export default function Orders(props) {
  const dispatch = useDispatch();

  const filterItems = useSelector(state => state['order-statuses'].value);
  const pageConfig = {
    actionBarProps: {
      ...actionBarProps,
      filterItems
    },
    tableColumns,
  };


  useEffect(() => {
    dispatch(reduxActions.storeItems());
    dispatch(storeStatuses());
    dispatch(storeProducts());
  }, []);
  return (<PageContent config={pageConfig} reduxActions={reduxActions} />);
}