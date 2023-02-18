import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Custom Components.
import ActionBar from './ActionBar';
import DataTable from './DataTable';

export default function PageContent(props) {
  const handleGetItems = async (queryParams = {}) => {
    dispatch(reduxActions.storeItems(queryParams));
  }

  const handleAddItem = async newItem => {
    dispatch(reduxActions.addItem(newItem));
  }

  const handleUpdateItem = async updatedItem => {
    dispatch(reduxActions.updateItem(updatedItem));
  }

  const handleRemoveItem = async itemId => {
    dispatch(reduxActions.removeItem(itemId));
  }

  const dispatch = useDispatch();

  const {
    config: {
      actionBarProps = {},
      tableColumns = [],
      loadFunctions = [],
      unloadFunctions = [],
      filterField = ''
    } = {},
    reduxActions = {}
  } = props;

  const pageKey = window.location.pathname.replace('/', '');
  const items = useSelector(state => state[pageKey].value);
  const filterItems = useSelector(state => state[filterField]?.value ?? []);

  useEffect(() => {
    loadFunctions.forEach(fn => dispatch(fn()));

    return () => {
      unloadFunctions.forEach(fn => dispatch(fn()));
    }
  }, []);

  return (
    <div>
      <h1 className="text-capitalize">{pageKey.replace('-', ' ')}</h1>

      <ActionBar
        type={pageKey}
        filterItems={filterItems}
        getItems={handleGetItems}
        addItem={handleAddItem}
        {...actionBarProps}
      />

      <DataTable
        items={items}
        columns={tableColumns}
        filterItems={filterItems}
        pageKey={pageKey}
        handleUpdateItem={handleUpdateItem}
        handleRemoveItem={handleRemoveItem}
      />
    </div>
  );
}
