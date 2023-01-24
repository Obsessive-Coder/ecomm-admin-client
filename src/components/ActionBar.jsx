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
    statuses = [],
    products = [],
    type,
    isAddVisible = true,
    isSearchVisible = false,
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
        ...(type === 'products' ? { category_id: categoryId } : {}),
        ...(type === 'categories' ? { type_id: categoryId } : {})
      }),
      ...(title ? {
        [type === 'order' ? 'recipient_name' : 'title']: title
      } : {})
    };

    getItems({
      order: {
        column: type === 'order' ? 'recipient_name' : 'title'
      },
      ...queryParams
    })
  };

  const handleSubmit = event => {
    event.preventDefault();
    handleSearch(direction, categoryId, title);
  };

  return (
    <div className="d-flex flex-column flex-md-row align-items-center mb-5">
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
                  onChange={handleCategoryOnChange}
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
              <FloatingLabel controlId="price" label="Sort Price">
                <Form.Select
                  arial-label="Sort Price"
                  onChange={handleSortOnChange}
                  className="bg-dark border-secondary text-secondary"
                >
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

          {type === 'order' && (
            <AddEditOrder
              categories={filterItems}
              statuses={statuses}
              products={products}
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
