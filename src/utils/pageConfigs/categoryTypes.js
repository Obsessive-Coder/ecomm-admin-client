// Redux stores and actions.
import { reduxActions } from '../../reducers/categoryType';

export const actionBarProps = { isSearchVisible: true };

export const tableColumns = [{
  label: 'title',
  componentName: 'Data'
}, {
  label: 'active',
  componentName: 'ActiveSwitch'
}, {
  label: 'actions',
  componentName: 'Actions'
}];

export const pageConfig = {
  reduxActions,
  config: {
    actionBarProps: { ...actionBarProps },
    loadFunctions: [],
    unloadFunctions: [reduxActions.clearItems],
    tableColumns: [...tableColumns]
  }
};

export default pageConfig;