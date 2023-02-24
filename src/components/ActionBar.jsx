import React, { useState } from 'react';

// Bootstrap Components.
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { Plus as PlusIcon, Search as SearchIcon } from 'react-bootstrap-icons';

// Custom Components.
import AddEditCategory from './AddEditCategory';
import AddEditOrder from './AddEditOrder';
import AddEditProduct from './AddEditProduct';

export default function ActionBar(props) {
  const {
    filterItems = [],
    type,
    categoryId = '0',
    direction = '0',
    isAddVisible = true,
    isSearchVisible = false,
    isSortVisible = false,
    setTitle,
    addItem,
    getItems,
    setCategoryId,
    setDirection
  } = props;

  const handleTitleOnChange = ({ target }) => setTitle(target.value);

  const handleSubmit = event => {
    event.preventDefault();
    getItems();
  };

  return (
    <div className="d-flex flex-column flex-md-row align-items-center">
      <Form onSubmit={handleSubmit} className="flex-fill w-100 me-md-3">
        <Row>
          {/* Search */}
          {isSearchVisible && (
            <Form.Group as={Col} md={6} controlId="searchForm" className="flex-fill my-2">
              <InputGroup>
                <FloatingLabel controlId="search" label={type === 'order' ? 'Recipient Search' : 'Title Search'} className="text-secondary">
                  <Form.Control
                    type="text"
                    placeholder={type === 'order' ? 'Search by recipient' : `Search by title`}
                    onChange={handleTitleOnChange}
                    className="bg-dark border-secondary text-secondary"
                  />
                </FloatingLabel>

                <Button type="submit" variant="outline-secondary" className="btn-sm bg-dark border-secondary">
                  <SearchIcon size={24} />
                </Button>
              </InputGroup>
            </Form.Group>
          )}

          {/* Category Filter */}
          {filterItems.length > 0 && (
            <Form.Group as={Col} sm={6} md={3} controlId="filterForm" className="flex-fill my-2">
              <FloatingLabel controlId="filter" label="Filter Items">
                <Form.Select
                  arial-label="Filter Items"
                  value={categoryId}
                  onChange={({ target: { value } }) => setCategoryId(value)}
                  className="bg-dark border-secondary text-secondary"
                >
                  <option value="0">Select One</option>

                  {filterItems.map(({ id, title }) => (
                    <option key={`filter-item-${id}`} value={id}>
                      {title}
                    </option>
                  ))}
                </Form.Select>
              </FloatingLabel>
            </Form.Group>
          )}

          {/* Price Sort */}
          {isSortVisible && (
            <Form.Group as={Col} sm={6} md={3} controlId="priceForm" className="flex-fill my-2">
              <FloatingLabel controlId="price" label={type === 'orders' ? 'Sort By Date' : 'Sort By Price'}>
                <Form.Select
                  arial-label={type === 'orders' ? 'Sort by date' : 'Sort by price'}
                  value={direction}
                  onChange={({ target: { value } }) => setDirection(value)}
                  className="bg-dark border-secondary text-secondary"
                >
                  <option value="0">Select One</option>
                  <option value="ASC">
                    {type === 'orders' ? 'Old to New' : 'Low to High'}
                  </option>
                  <option value='DESC'>
                    {type === 'orders' ? 'New to Old' : 'High to Low'}
                  </option>
                </Form.Select>
              </FloatingLabel>
            </Form.Group>
          )}
        </Row>
      </Form>

      {isAddVisible && (
        <>
          {type === 'products' && (
            <AddEditProduct
              addItem={addItem}
              buttonContent={(
                <div className="d-flex align-items-center justify-content-center">
                  <PlusIcon size={36} />{' '}
                  <span style={{ height: 36 }}>Add</span>
                </div>
              )}
              buttonClassName="align-self-stretch align-self-md-auto btn-block btn-lg btn-primary text-success"
            />
          )}

          {(type === 'categories' || type === 'category-types') && (
            <AddEditCategory
              type={type}
              addItem={addItem}
              buttonContent={(
                <div className="d-flex align-items-center justify-content-center">
                  <div className="d-flex align-items-center justify-content-center">
                    <PlusIcon size={36} />{' '}
                    <span style={{ height: 36 }}>Add</span>
                  </div>
                </div>
              )}
              buttonClassName="align-self-stretch align-self-md-auto btn-block btn-lg btn-primary text-success"
            />
          )}

          {type === 'orders' && (
            <AddEditOrder
              type={type}
              addItem={addItem}
              buttonContent={(
                <div className="d-flex align-items-center justify-content-center">
                  <PlusIcon size={36} />{' '}
                  <span style={{ height: 36 }}>Add</span>
                </div>
              )}
              buttonClassName="align-self-stretch align-self-md-auto btn-block btn-lg btn-primary text-success"
            />
          )}
        </>
      )}
    </div >
  );
}
