import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// Custom Components.
import PageContent from '../components/PageContent';

// Styles, utils, and other helpers.
import { reduxActions } from '../reducers/categoryType';

const actionBarProps = { isSearchVisible: true };

const tableColumns = [{
  label: 'title',
  componentName: 'Data'
}, {
  label: 'active',
  componentName: 'ActiveSwitch'
}, {
  label: 'actions',
  componentName: 'Actions'
}];

export default function CategoryTypes() {
  const dispatch = useDispatch();

  const pageConfig = {
    actionBarProps: { ...actionBarProps },
    tableColumns
  };

  useEffect(() => {
    dispatch(reduxActions.storeItems());
  }, []);

  return (
    <PageContent config={pageConfig} reduxActions={reduxActions} />
  );
}
