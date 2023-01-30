import React from 'react';

// Custom Components.
import PageContent from '../components/PageContent';

// Styles, utils, and other helpers.
import { reduxActions } from '../reducers/category';
import { clearItems as clearCategoryTypes, storeItems as storeCategoryTypes } from '../reducers/categoryType';

const actionBarProps = { isSearchVisible: true };

const tableColumns = [{
  label: 'title',
  componentName: 'Data'
}, {
  label: 'type',
  componentName: 'Data'
}, {
  label: 'active',
  componentName: 'ActiveSwitch'
}, {
  label: 'actions',
  componentName: 'Actions'
}];

const pageConfig = {
  actionBarProps: { ...actionBarProps },
  loadFunctions: [reduxActions.storeItems, storeCategoryTypes],
  unloadFunctions: [reduxActions.clearItems, clearCategoryTypes],
  tableColumns: [...tableColumns],
  filterField: 'category-types'
};

function Categories() {
  return (<PageContent config={pageConfig} reduxActions={reduxActions} />);
}

Categories.displayName = 'Categories';
export default Categories;

