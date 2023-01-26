import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';

// Custom Components.
import PageContent from '../components/PageContent';

// Style, utils, and other helpers.
import { reduxActions } from '../reducers/product';
import { storeItems as storeCategories } from '../reducers/category';

const actionBarProps = { isSearchVisible: true, isSortVisible: true };

const tableColumns = [{
  label: 'title',
  componentName: 'Data'
}, {
  label: 'description',
  componentName: 'Data'
}, {
  label: 'category',
  componentName: 'Data'
}, {
  label: 'price',
  componentName: 'Data',
}, {
  label: 'quantity',
  componentName: 'Data',
}, {
  label: 'active',
  componentName: 'ActiveSwitch'
}, {
  label: 'view',
  componentName: 'ViewLink'
}, {
  label: 'actions',
  componentName: 'Actions'
}];

export default function Products() {
  const dispatch = useDispatch();

  const filterItems = useSelector(state => state.categories.value);
  const pageConfig = {
    actionBarProps: {
      ...actionBarProps,
      filterItems
    },
    tableColumns,
  };

  useEffect(() => {
    dispatch(reduxActions.storeItems());
    dispatch(storeCategories());
  }, []);

  return (<PageContent config={pageConfig} reduxActions={reduxActions} />)
}