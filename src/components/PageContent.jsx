import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Bootstrap Components.
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

// Other Components.
import Pagination, { bootstrap5PaginationPreset } from 'react-responsive-pagination';

// Custom Components.
import ActionBar from './ActionBar';
import Actions from './Actions';
import ActiveSwitch from './ActiveSwitch';

const components = {
  Actions,
  ActiveSwitch,
  Data: ({ value = '' }) => (<span>{value}</span>),
};

export default function PageContent(props) {
  const dispatch = useDispatch();

  const handleGetItems = async (queryParams = {}) => {
    const { data } = await apiUtil.findAll(queryParams);
    dispatch(reduxActions.storeItems(data));
  }

  const handleAddItem = async newItem => {
    const { data } = await apiUtil.create(newItem);
    dispatch(reduxActions.addItem(data));
  }

  const handleUpdateItem = async updatedItem => {
    await apiUtil.update(updatedItem.id, updatedItem);
    dispatch(reduxActions.updateItem(updatedItem));
  }

  const handleRemoveItem = async itemId => {
    await apiUtil.delete(itemId);
    dispatch(reduxActions.removeItem(itemId));
  }

  const updatePageIndex = pageNumber => {
    const index = pageNumber - 1;
    if (index < pageCount) {
      setPageIndex(index);
    }
  };


  const [rowLimit, setRowLimit] = useState(25);
  const [pageIndex, setPageIndex] = useState(0);

  const items = useSelector(state => state.categoryTypes.value);
  const pageItems = items.slice(pageIndex * rowLimit, (pageIndex * rowLimit) + rowLimit);

  const pathname = window.location.pathname.replace('/', '');
  const pageCount = Math.ceil(items.length / rowLimit);

  const {
    apiUtil,
    reduxActions,
    actionBarProps = {},
    tableColumns = []
  } = props;


  const { isAddVisible, isSearchVisible, isFilterVisible, isSortVisible } = actionBarProps;


  useEffect(() => {
    handleGetItems();
  }, []);

  return (
    <Container fluid>
      <h1 className="text-capitalize">{pathname.replace('-', ' ')}</h1>

      <ActionBar
        type={pathname}
        isAddVisible={isAddVisible}
        isSearchVisible={isSearchVisible}
        isFilterVisible={isFilterVisible}
        isSortVisible={isSortVisible}
        getItems={handleGetItems}
        addItem={handleAddItem}
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
                      value={item[label]}
                      id={item.id}
                      index={index}
                      type={pathname}
                      label={label}
                      isActive={item.active}
                      item={item}
                      handleUpdate={handleUpdateItem}
                      removeItem={handleRemoveItem}
                      categoryTypes={items}
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
          <h2>{`There are no ${pathname.replace('-', ' ')} to show.`}</h2>
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
    </Container>
  );
}
