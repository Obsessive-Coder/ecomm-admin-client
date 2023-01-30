// Redux stores and actions.
import { reduxActions } from '../../reducers/product';
import { clearItems as clearCategories, storeItems as storeCategories } from '../../reducers/category';

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

export const pageConfig = {
  reduxActions,
  config: {
    actionBarProps: { ...actionBarProps },
    loadFunctions: [reduxActions.storeItems, storeCategories],
    unloadFunctions: [reduxActions.clearItems, clearCategories],
    tableColumns: [...tableColumns],
    filterField: 'categories'
  }
};

export default pageConfig;