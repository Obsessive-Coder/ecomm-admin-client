import React from 'react';

// Custom Components.
import PageContent from '../components/PageContent';

// Styles, utils, and other helpers.
import CategoryTypeUtil from '../utils/api/CategoryTypeUtil';
import { reduxActions } from '../reducers/categoryTypes';

const categoryTypeUtil = new CategoryTypeUtil();

const actionBarProps = {
  isAddVisible: true,
  isSearchVisible: true,
  isFilterVisible: false,
  isSortVisible: false
};

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

export default function CategoryTypes(props) {
  return (
    <PageContent
      actionBarProps={actionBarProps}
      apiUtil={categoryTypeUtil}
      reduxActions={reduxActions}
      tableColumns={tableColumns}
    >
      Category Types
    </PageContent>
  );
}
