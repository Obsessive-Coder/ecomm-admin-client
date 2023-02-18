import React, { useState } from 'react';

// Bootstrap Components.
import Table from 'react-bootstrap/Table';

// Other Components.
import { Link } from 'react-router-dom';
import Pagination, { bootstrap5PaginationPreset } from 'react-responsive-pagination';

// Custom Components.
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

export default function DataTable(props) {
  const {
    items = [],
    columns = [],
    filterItems = [],
    isSmall = false,
    pageKey = '',
    tableClassName = '',
    handleUpdateItem = () => null,
    handleRemoveItem = () => null
  } = props;

  const getCellValue = (item = {}, label = '') => {
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

  const updatePageIndex = pageNumber => {
    const index = pageNumber - 1;
    if (index < pageCount) {
      setPageIndex(index);
    }
  };

  const [rowLimit, setRowLimit] = useState(isSmall ? 2 : 25);
  const [pageIndex, setPageIndex] = useState(0);

  const pageItems = items.slice(pageIndex * rowLimit, (pageIndex * rowLimit) + rowLimit);
  const pageCount = Math.ceil(items.length / rowLimit);

  return (
    <div>
      <Table responsive striped bordered hover className={`table-dark ${tableClassName}`}>
        <thead className="text-body">
          <tr>
            {columns.map(({ label }) => (
              <th key={`${label}-heading`} style={{ maxWidth: 200 }}>
                <span className="text-capitalize">
                  {label.replace('_', ' ')}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {pageItems.map(item => (
            <tr key={`item-${item.id}`}>
              {columns.map(({ label, componentName }, index) => {
                const DataContent = components[componentName];
                return (
                  <td
                    key={`data-${item.id}-${label}-${item[label]}`}
                    style={{ maxWidth: 200 }}
                    className="text-truncate text-body"
                  >
                    <DataContent
                      value={getCellValue(item, label)}
                      id={item.id}
                      index={index}
                      type={pageKey}
                      label={label}
                      isActive={item.active}
                      item={item}
                      status={filterItems?.filter(({ id }) => id === item.status_id)[0]?.title}
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

      {isSmall ? (
        <div className="mx-2 text-end">
          <Link to="/orders" className="text-body">
            Show All
          </Link>
        </div>
      ) : (
        pageCount > 1 && (
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
        )
      )}
    </div>
  );
}
