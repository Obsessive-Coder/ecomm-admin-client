import React from 'react';
import { useSelector } from 'react-redux';

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
  tableColumns: [...tableColumns]
};

function Categories() {
  const filterItems = useSelector(state => state['category-types'].value);
  pageConfig.actionBarProps = { ...pageConfig.actionBarProps, filterItems };

  return (<PageContent config={pageConfig} reduxActions={reduxActions} />);
}

Categories.displayName = 'Categories';
export default Categories;

