
// Redux stores and actions.
import { reduxActions } from '../../reducers/category';
import { clearItems as clearCategoryTypes, storeItems as storeCategoryTypes } from '../../reducers/categoryType';

export const actionBarProps = { isSearchVisible: true };

export const tableColumns = [{
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

export const pageConfig = {
  reduxActions,
  config: {
    actionBarProps: { ...actionBarProps },
    loadFunctions: [storeCategoryTypes],
    unloadFunctions: [reduxActions.clearItems, clearCategoryTypes],
    tableColumns: [...tableColumns],
    filterField: 'category-types'
  }
};

export default pageConfig;