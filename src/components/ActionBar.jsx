import React, { useState } from 'react';

// Bootstrap Components.
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Plus as PlusIcon } from 'react-bootstrap-icons';

// Custom Components.
import AddEditProduct from './AddEditProduct';
import AddEditCategory from './AddEditCategory';

export default function ActionBar(props) {
  const {
    categories = [],
    categoryTypes = [],
    type,
    isAddVisible = true,
    isSearchVisible = false,
    isFilterVisible = false,
    isSortVisible = false,
    addItem,
    getItems
  } = props;

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('0');
  const [direction, setDirection] = useState('0');

  const handleTitleOnChange = ({ target }) => setTitle(target.value);

  const handleCategoryOnChange = ({ target }) => {
    setCategoryId(target.value);
    handleSearch(direction, target.value, title)
  };

  const handleSortOnChange = ({ target }) => {
    setDirection(target.value);
    handleSearch(target.value, categoryId, title);
  }

  const handleSearch = (direction, categoryId) => {
    const queryParams = {
      ...(direction === '0' ? {} : {
        order: { column: 'price', direction }
      }),
      ...(categoryId === '0' ? {} : {
        [type === 'product' ? 'category_id' : 'id']: categoryId
      }),
      ...(title ? { title } : {})
    };

    getItems(queryParams)
  };

  const handleSubmit = event => {
    event.preventDefault();
    handleSearch(direction, categoryId, title);
  };

  return (
    <div className="d-flex flex-column flex-md-row align-items-center my-5 my-md-3">
      <Form onSubmit={handleSubmit} className="flex-fill me-md-3 me-lg-5">
        <Row>
          {/* Search */}
          {isSearchVisible && (
            <Form.Group as={Col} md={6} controlId="search" className="flex-fill my-2">
              <FloatingLabel controlId="search" label="Title Search">
                <Form.Control
                  type="text"
                  placeholder="Search by title"
                  onChange={handleTitleOnChange}
                />
              </FloatingLabel>
            </Form.Group>
          )}

          {/* Category Filter */}
          {isFilterVisible && (
            <Form.Group as={Col} sm={6} md={3} controlId="categoryId" className="my-2">
              <FloatingLabel controlId="categoryId" label="Filter Category">
                <Form.Select arial-label="Category Filter" onChange={handleCategoryOnChange}>
                  <option value="0">Select One</option>

                  {categories.map(({ id, title }) => (
                    <option key={`${title}-categoryId`} value={id}>
                      {title}
                    </option>
                  ))}
                </Form.Select>
              </FloatingLabel>
            </Form.Group>
          )}

          {/* Price Sort */}
          {isSortVisible && (
            <Form.Group as={Col} sm={6} md={3} controlId="price" className="my-2">
              <FloatingLabel controlId="price" label="Sort Price">
                <Form.Select arial-label="Sort Price" onChange={handleSortOnChange}>
                  <option value="0">Select One</option>
                  <option value="ASC">Low to High</option>
                  <option value='DESC'>High to Low</option>
                </Form.Select>
              </FloatingLabel>
            </Form.Group>
          )}
        </Row>
      </Form>

      {isAddVisible && (
        <>
          {type === 'product' && (
            <AddEditProduct
              categories={categories}
              buttonContent={(
                <div className="d-flex align-items-center justify-content-center">
                  <PlusIcon size={36} />{' '}
                  Add Product
                </div>
              )}
              addItem={addItem}
              buttonClassName="align-self-stretch align-self-md-auto btn-block btn-lg btn-primary"
            />
          )}

          {(type === 'category' || type === 'categoryTypes') && (
            <AddEditCategory
              categories={categories}
              categoryTypes={categoryTypes}
              type={type}
              buttonContent={(
                <div className="d-flex align-items-center justify-content-center">
                  <PlusIcon size={36} />{' '}
                  <span>
                    {type === 'categoryTypes' ? ' Add Type' : 'Add Category'}
                  </span>
                </div>
              )}
              addItem={addItem}
              buttonClassName="align-self-stretch align-self-md-auto btn-block btn-lg btn-primary"
            />
          )}
        </>
      )}
    </div >
  );
}
