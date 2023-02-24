import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Custom Components.
import ActionBar from './ActionBar';
import DataTable from './DataTable';

export default function PageContent(props) {
  const handleGetItems = async () => {
    const queryParams = {
      ...(direction === '0' ? {} : {
        order: { column: pageKey === 'orders' ? 'updatedAt' : 'price', direction }
      }),
      ...(categoryId === '0' ? {} : {
        ...(pageKey === 'products' ? { category_id: categoryId } : {}),
        ...(pageKey === 'categories' ? { type_id: categoryId } : {}),
        ...(pageKey === 'orders' ? { status_id: categoryId } : {})
      }),
      ...(title ? {
        [pageKey === 'orders' ? 'recipient_name' : 'title']: title
      } : {}),
      page: pageIndex,
      limit: rowLimit
    };

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

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('0');
  const [direction, setDirection] = useState('0');
  const [rowLimit, setRowLimit] = useState(25);
  const [pageIndex, setPageIndex] = useState(0);

  const pageKey = window.location.pathname.replace('/', '');
  const data = useSelector(state => state[pageKey].value);
  const filterItems = useSelector(state => state[filterField]?.value.rows ?? []);

  useEffect(() => {
    handleGetItems();
    loadFunctions.forEach(fn => dispatch(fn()));

    return () => {
      unloadFunctions.forEach(fn => dispatch(fn()));
    }
  }, [title, categoryId, direction, pageIndex]);

  return (
    <div>
      <h1 className="text-capitalize">{pageKey.replace('-', ' ')}</h1>

      <ActionBar
        type={pageKey}
        filterItems={filterItems}
        categoryId={categoryId}
        direction={direction}
        addItem={handleAddItem}
        getItems={handleGetItems}
        setTitle={setTitle}
        setCategoryId={setCategoryId}
        setDirection={setDirection}
        {...actionBarProps}
      />

      <DataTable
        data={data}
        columns={tableColumns}
        filterItems={filterItems}
        pageKey={pageKey}
        rowLimit={rowLimit}
        pageIndex={pageIndex}
        handleGetItems={handleGetItems}
        handleUpdateItem={handleUpdateItem}
        handleRemoveItem={handleRemoveItem}
        setPageIndex={setPageIndex}
      />
    </div>
  );
}
