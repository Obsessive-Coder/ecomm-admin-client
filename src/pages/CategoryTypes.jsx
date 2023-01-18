import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

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

export async function loader() {
  const { data: categoryTypes } = await new CategoryTypeUtil().findAll({ order: { column: 'title' } });
  return { categoryTypes };
}

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

export default function CategoryTypes() {
  const [categoryTypes, setCategoryTypes] = useState(useLoaderData().categoryTypes);
  const [rowLimit, setRowLimit] = useState(25);
  const [pageCount, setPageCount] = useState(Math.ceil(categoryTypes.length / rowLimit));
  const [pageIndex, setPageIndex] = useState(0);
  const [pageTypes, setPageTypes] = useState(categoryTypes.slice(0, rowLimit));

  const allTypes = useLoaderData().categoryTypes;
  const categoryTypeUtil = new CategoryTypeUtil();

  const getTypes = async queryParams => {
    const { data: categoryTypes } = await categoryTypeUtil.findAll(queryParams);
    setCategoryTypes(categoryTypes);

    const updatedPageTypes = categoryTypes.slice(pageIndex * rowLimit, (pageIndex * rowLimit) + rowLimit);
    setPageTypes(updatedPageTypes);

    setPageCount(Math.ceil(categoryTypes.length / rowLimit));
  };

  const addType = newType => {
    const updatedTypes = [...categoryTypes, newType];
    setCategoryTypes(updatedTypes);

    const updatedPageTypes = updatedTypes.slice(pageIndex * rowLimit, (pageIndex * rowLimit) + rowLimit);
    setPageTypes(updatedPageTypes);

    setPageCount(Math.ceil(updatedTypes.length / rowLimit));
  };

  const updateType = updatedType => {
    const { id: updatedId } = updatedType;
    categoryTypeUtil.update(updatedId, updatedType);

    const updatedTypes = [...categoryTypes];
    for (let i = 0; i < updatedTypes.length; i++) {
      const categoryType = updatedTypes[i];

      if (categoryType.id === updatedId) {
        updatedTypes[i] = { ...categoryType, ...updatedType };
      }
    }

    updatePageTypes(pageIndex, updatedTypes);
    setCategoryTypes([...updatedTypes]);
  };

  const removeType = typeId => {
    categoryTypeUtil.delete(typeId);

    const filteredTypes = categoryTypes.filter(({ id }) => id !== typeId);
    setCategoryTypes([...filteredTypes]);

    let updatedPageTypes = filteredTypes
      .slice(pageIndex * rowLimit, (pageIndex * rowLimit) + rowLimit);

    if (updatedPageTypes.length === 0) {
      updatedPageTypes = filteredTypes
        .slice((pageIndex - 1) * rowLimit, ((pageIndex - 1) * rowLimit) + rowLimit);

      setPageIndex(pageIndex - 1);
    }

    setPageTypes(updatedPageTypes);
    setPageCount(Math.ceil(filteredTypes.length / rowLimit))
  };

  const updatePageTypes = (index, updatedTypes) => {
    if (index < pageCount) {
      const updatedPageTypes = updatedTypes
        .slice(index * rowLimit, (index * rowLimit) + rowLimit);

      setPageTypes(updatedPageTypes);
      setPageIndex(index);
    }
  };

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
            onPageChange={pageNumber => updatePageTypes(pageNumber - 1)}
          />
        </div>
      )}
    </Container>
  );
}
