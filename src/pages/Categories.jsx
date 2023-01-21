import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
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
import CategoryUtil from '../utils/api/CategoryUtil';

const categoryUtil = new CategoryUtil();

const tableColumns = [{
  label: 'title',
  Component: undefined
}, {
  label: 'type',
  Component: undefined
}, {
  label: 'active',
  Component: ActiveSwitch
}, {
  label: 'actions',
  Component: Actions
}];

function Categories(props) {
  const { categories, categoryTypes } = props;

  const dispatch = useDispatch();

  const [rowLimit, setRowLimit] = useState(25);
  const [pageIndex, setPageIndex] = useState(0);

  const getCategories = async queryParams => {
    const { data } = await categoryUtil.findAll(queryParams);
    dispatch({ type: 'STORE_CATEGORIES', payload: data });
  };

  const addCategory = async newCategory => {
    const { data } = await categoryUtil.create(newCategory);
    dispatch({ type: 'ADD_CATEGORY', payload: data });
  };

  const updateCategory = updatedCategory => {
    categoryUtil.update(updatedCategory.id, updatedCategory);
    dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
  };

  const removeCategory = categoryId => {
    categoryUtil.delete(categoryId);
    dispatch({ type: 'REMOVE_CATEGORY', payload: categoryId });
  };

  const updatePageIndex = index => {
    if (index < pageCount) {
      setPageIndex(index);
    }
  };

  const pageCategories = categories
    .slice(pageIndex * rowLimit, (pageIndex * rowLimit) + rowLimit);

  const pageCount = Math.ceil(categories.length / rowLimit);
  const allCategories = [...categories];

  return (
    <Container fluid className="px-0">
      <h1>Categories</h1>

      <ActionBar
        isSearchVisible
        isFilterVisible
        type="category"
        categories={allCategories}
        categoryTypes={categoryTypes}
        addItem={addCategory}
        getItems={getCategories}
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
          {pageCategories.map(category => (
            <tr key={`${category.id}`}>
              {tableColumns.map(({ label, Component }, index) => (
                <td
                  key={`${category.id}-${label}-${category[label]}`}
                  style={{ maxWidth: 200 }}
                  className="text-truncate text-secondary"
                >
                  {Component ? (
                    <Component
                      id={category.id}
                      index={index}
                      label={label}
                      isActive={category.active}
                      item={category}
                      categoryTypes={categoryTypes}
                      type="category"
                      removeItem={removeCategory}
                      handleUpdate={updateCategory}
                    />
                  ) : (
                    <span key={`${category.id}-${label}-${category[label]}`}>
                      {label === 'type' ? (
                        categoryTypes.filter(({ id }) => id === category.type_id)[0]?.title
                      ) : (
                        category[label] ?? ''
                      )}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      {pageCategories.length === 0 && (
        <div className="text-center">
          <h2>There are no categories to show.</h2>
          <p>Try adding categories or updating your search criteria</p>
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

const mapStateToProps = ({ categories, categoryTypes }) => ({ categories, categoryTypes });

export default connect(mapStateToProps)(Categories);

