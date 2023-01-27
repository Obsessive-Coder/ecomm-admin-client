import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Bootstrap Components.
import Table from 'react-bootstrap/Table';

// Other Components.
import Pagination, { bootstrap5PaginationPreset } from 'react-responsive-pagination';

// Custom Components.
import ActionBar from './ActionBar';
import Actions from './Actions';
import ActiveSwitch from './ActiveSwitch';
import StatusBadge from './StatusBadge';
import ViewLink from './ViewLink';

const components = {
  Actions,
  ActiveSwitch,
  StatusBadge,
  ViewLink,
  Data: ({ value = '' }) => (<span>{value}</span>),
};

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

  const updatePageIndex = pageNumber => {
    const index = pageNumber - 1;
    if (index < pageCount) {
      setPageIndex(index);
    }
  };

  const getCellValue = (item = {}, label = '') => {
    const { filterItems } = actionBarProps;
    let value = item[label];

    switch (label) {
      case 'category':
        value = filterItems.filter(({ id }) => id === item.category_id)[0]?.title;
        break;
      case 'type':
        value = filterItems.filter(({ id }) => id === item.type_id)[0]?.title;
        break;
      case 'status':
        value = filterItems.filter(({ id }) => id === item.status_id)[0]?.title;
        break;
      case 'date':
        value = new Date(value).toLocaleDateString("en-US");
        break;
      default:
        break;
    }

    if (label === 'price' || label === 'total' || label === 'shipping') {
      value = `$${value}`;
    }
    return value;
  };

  const dispatch = useDispatch();
  const [rowLimit, setRowLimit] = useState(25);
  const [pageIndex, setPageIndex] = useState(0);

  const {
    config: {
      actionBarProps = {},
      tableColumns = [],
      loadFunctions = [],
      unloadFunctions = []
    } = {},
    reduxActions = {}
  } = props;

  const pageKey = window.location.pathname.replace('/', '');

  const items = useSelector(state => state[pageKey].value);
  const pageItems = items.slice(pageIndex * rowLimit, (pageIndex * rowLimit) + rowLimit);
  const pageCount = Math.ceil(items.length / rowLimit);

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
        getItems={handleGetItems}
        addItem={handleAddItem}
        {...actionBarProps}
      />

      <Table responsive striped bordered hover className="table-dark">
        <thead className="text-secondary">
          <tr>
            {tableColumns.map(({ label }) => (
              <th key={`${label}-heading`} style={{ maxWidth: 200 }}>
                <span className="text-capitalize">{label}</span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {pageItems.map(item => (
            <tr key={`item-${item.id}`}>
              {tableColumns.map(({ label, componentName }, index) => {
                const DataContent = components[componentName];
                return (
                  <td
                    key={`data-${item.id}-${label}-${item[label]}`}
                    style={{ maxWidth: 200 }}
                    className="text-truncate text-secondary"
                  >
                    <DataContent
                      value={getCellValue(item, label)}
                      id={item.id}
                      index={index}
                      type={pageKey}
                      label={label}
                      isActive={item.active}
                      item={item}
                      status={actionBarProps?.filterItems?.filter(({ id }) => id === item.status_id)[0]?.title}
                      toUrl={`/${pageKey}/${item.id}`}
                      handleUpdate={handleUpdateItem}
                      removeItem={handleRemoveItem}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>

      {pageItems.length === 0 && (
        <div className="text-center">
          <h2>{`There are no ${pageKey.replace('-', ' ')} to show.`}</h2>
        </div>
      )}

      {pageCount > 1 && (
        <div>
          <Pagination
            {...bootstrap5PaginationPreset}
            total={pageCount}
            current={pageIndex + 1}
            maxWidth={500}
            previousLabel="<"
            nextLabel=">"
            onPageChange={updatePageIndex}
          />
        </div>
      )}
    </div>
  );
}
