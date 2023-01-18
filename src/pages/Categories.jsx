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
import CategoryUtil from '../utils/api/CategoryUtil';
import CategoryTypeUtil from '../utils/api/CategoryTypeUtil';

export async function loader() {
  const { data: categoryTypes } = await new CategoryTypeUtil().findAll({ order: { column: 'title' } });
  const { data: categories } = await new CategoryUtil().findAll({ order: { column: 'title' } });
  return { categoryTypes, categories };
}

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

export default function Categories() {
  const { categoryTypes } = useLoaderData();
  const [categories, setCategories] = useState(useLoaderData().categories);
  const [rowLimit, setRowLimit] = useState(25);
  const [pageCount, setPageCount] = useState(Math.ceil(categories.length / rowLimit));
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCategories, setPageCategories] = useState(categories.slice(0, rowLimit));

  const allCategories = useLoaderData().categories;

  const categoryUtil = new CategoryUtil();

  const getCategories = async queryParams => {
    const { data: categories } = await categoryUtil.findAll(queryParams);
    setCategories(categories);

    const updatedPageCategories = categories.slice(pageIndex * rowLimit, (pageIndex * rowLimit) + rowLimit);
    setPageCategories(updatedPageCategories);

    setPageCount(Math.ceil(categories.length / rowLimit));
  };

  const handleAddCategory = newCategory => {
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);

    const updatedPageCategories = updatedCategories.slice(pageIndex * rowLimit, (pageIndex * rowLimit) + rowLimit);
    setPageCategories(updatedPageCategories);

    setPageCount(Math.ceil(updatedCategories.length / rowLimit));
  };

  const handleUpdateCategory = updatedCategory => {
    const { id: updatedId } = updatedCategory;
    categoryUtil.update(updatedId, updatedCategory);

    const updatedCategories = [...categories];
    for (let i = 0; i < updatedCategories.length; i++) {
      const category = updatedCategories[i];

      if (category.id === updatedId) {
        updatedCategories[i] = { ...category, ...updatedCategory };
      }
    }

    updatePageCategories(pageIndex, updatedCategories);
    setCategories([...updatedCategories]);
  };

  const handleRemoveCategory = categoryId => {
    categoryUtil.delete(categoryId);

    const filteredCategories = categories.filter(({ id }) => id !== categoryId);
    setCategories([...filteredCategories]);

    let updatedPageCategories = filteredCategories
      .slice(pageIndex * rowLimit, (pageIndex * rowLimit) + rowLimit);

    if (updatedPageCategories.length === 0) {
      updatedPageCategories = filteredCategories
        .slice((pageIndex - 1) * rowLimit, ((pageIndex - 1) * rowLimit) + rowLimit);

      setPageIndex(pageIndex - 1);
    }

    setPageCategories(updatedPageCategories);
    setPageCount(Math.ceil(filteredCategories.length / rowLimit));
  };

  const updatePageCategories = (index, updatedCategories) => {
    if (index < pageCount) {
      const updatedPageCategories = updatedCategories
        .slice(index * rowLimit, (index * rowLimit) + rowLimit);

      setPageCategories(updatedPageCategories);
      setPageIndex(index);
    }
  };

  return (
    <Container fluid className="px-0">
      <h1>Categories</h1>

      <ActionBar
        isSearchVisible
        isFilterVisible
        type="category"
        categories={allCategories}
        categoryTypes={categoryTypes}
        addItem={handleAddCategory}
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
                      removeItem={handleRemoveCategory}
                      handleUpdate={handleUpdateCategory}
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

      <div>
        <Pagination
          {...bootstrap5PaginationPreset}
          total={pageCount}
          current={pageIndex + 1}
          maxWidth={500}
          previousLabel="<"
          nextLabel=">"
          onPageChange={pageNumber => updatePageCategories(pageNumber - 1)}
        />
      </div>
    </Container>
  );
}
