import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Custom Components.
import PageContent from '../components/PageContent';

// Styles, utils, and other helpers.
import { reduxActions } from '../reducers/category';
import { storeItems as storeCategoryTypes } from '../reducers/categoryType';

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

export default function Categories() {
  const dispatch = useDispatch();

  const filterItems = useSelector(state => state['category-types'].value);
  const pageConfig = {
    actionBarProps: {
      ...actionBarProps,
      filterItems
    },
    tableColumns
  };

  useEffect(() => {
    dispatch(reduxActions.storeItems());
    dispatch(storeCategoryTypes());
  }, []);

  return (<PageContent config={pageConfig} reduxActions={reduxActions} />);
}
