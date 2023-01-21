import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';

// Bootstrap Components.
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

// Other Components.
import Pagination, { bootstrap5PaginationPreset } from 'react-responsive-pagination';

// Custom Components.
import Actions from '../components/Actions';
import ActionBar from '../components/ActionBar';
import ActiveSwitch from '../components/ActiveSwitch';

// Styles, utils, and other helpers.
import CategoryTypeUtil from '../utils/api/CategoryTypeUtil';

const categoryTypeUtil = new CategoryTypeUtil();

const tableColumns = [{
  label: 'title',
  Component: undefined
}, {
  label: 'active',
  Component: ActiveSwitch
}, {
  label: 'actions',
  Component: Actions
}];

function CategoryTypes(props) {
  const { categoryTypes } = props;

  const dispatch = useDispatch();

  const [rowLimit, setRowLimit] = useState(25);
  const [pageIndex, setPageIndex] = useState(0);

  const getTypes = async queryParams => {
    const { data } = await categoryTypeUtil.findAll(queryParams);
    dispatch({ type: 'STORE_CATEGORY_TYPES', payload: data });
  };

  const addType = async newType => {
    const { data } = await categoryTypeUtil.create(newType);
    dispatch({ type: 'ADD_CATEGORY_TYPE', payload: data });
  };

  const updateType = updatedType => {
    categoryTypeUtil.update(updatedType.id, updatedType);
    dispatch({ type: 'UPDATE_CATEGORY_TYPE', payload: updatedType });
  };

  const removeType = typeId => {
    categoryTypeUtil.delete(typeId);
    dispatch({ type: 'REMOVE_CATEGORY_TYPE', payload: typeId });
  };

  const updatePageIndex = index => {
    if (index < pageCount) {
      setPageIndex(index);
    }
  };

  const pageTypes = categoryTypes
    .slice(pageIndex * rowLimit, (pageIndex * rowLimit) + rowLimit);

  const pageCount = Math.ceil(categoryTypes.length / rowLimit);
  const allTypes = [...categoryTypes];

  return (
    <Container fluid className="px-0">
      <h1>Category Types</h1>

      <ActionBar
        isSearchVisible
        type="categoryTypes"
        addItem={addType}
        getItems={getTypes}
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
          {pageTypes.map(categoryType => (
            <tr key={`${categoryType.id}`}>
              {tableColumns.map(({ label, Component }, index) => (
                <td
                  key={`${categoryType.id}-${label}-${categoryType[label]}`}
                  style={{ maxWidth: 200 }}
                  className="text-truncate text-secondary"
                >
                  {Component ? (
                    <Component
                      id={categoryType.id}
                      index={index}
                      label={label}
                      isActive={categoryType.active}
                      item={categoryType}
                      categoryTypes={allTypes}
                      type="categoryTypes"
                      removeItem={removeType}
                      handleUpdate={updateType}
                    />
                  ) : (
                    <span key={`${categoryType.id}-${label}-${categoryType[label]}`}>
                      {categoryType[label] ?? ''}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      {pageTypes.length === 0 && (
        <div className="text-center">
          <h2>There are no category types to show.</h2>
          <p>Try adding category types or updating your search criteria</p>
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
            onPageChange={pageNumber => updatePageIndex(pageNumber - 1)}
          />
        </div>
      )}
    </Container>
  );
}

const mapStateToProps = ({ categoryTypes }) => ({ categoryTypes });

export default connect(mapStateToProps)(CategoryTypes);
