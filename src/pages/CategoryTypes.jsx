import React from 'react';

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

const pageConfig = {
  actionBarProps: { ...actionBarProps },
  loadFunctions: [reduxActions.storeItems],
  unloadFunctions: [reduxActions.clearItems],
  tableColumns: [...tableColumns]
};

export default function CategoryTypes() {
  return (
    <PageContent config={pageConfig} reduxActions={reduxActions} />
  );
}
