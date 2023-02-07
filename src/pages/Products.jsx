import React from 'react'
import { useSelector } from 'react-redux';

// Custom Components.
import PageContent from '../components/PageContent';

// Style, utils, and other helpers.
import { reduxActions } from '../reducers/product';
import { clearItems as clearCategories, storeItems as storeCategories } from '../reducers/category';

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

const pageConfig = {
  actionBarProps: { ...actionBarProps },
  loadFunctions: [reduxActions.storeItems, storeCategories],
  unloadFunctions: [reduxActions.clearItems, clearCategories],
  tableColumns: [...tableColumns],
};

function Products() {
  return (<PageContent config={pageConfig} reduxActions={reduxActions} />)
}

Products.displayName = 'Products';
export default Products;
