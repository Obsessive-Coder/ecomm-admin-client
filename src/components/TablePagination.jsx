import React from 'react';

// Bootstrap Components.
import Pagination from 'react-bootstrap/Pagination';

export default function TablePagination({ pageIndex, pageCount, updatePageProducts }) {
  const handleNext = () => {
    const nextIndex = pageIndex + 1;
    if (nextIndex <= pageCount - 1) {
      updatePageProducts(nextIndex);
    }
  };

  const handlePrevious = () => {
    const prevIndex = pageIndex - 1;
    if (prevIndex >= 0) {
      updatePageProducts(prevIndex);
    }
  };


  return (
    <Pagination className="justify-content-center">
      <Pagination.First onClick={() => updatePageProducts(0)} />
      <Pagination.Prev onClick={handlePrevious} />

      {Array.from(Array(pageCount).keys()).map((index) => (
        <Pagination.Item
          key={index}
          active={pageIndex === index}
          onClick={() => updatePageProducts(index)}
        >
          {index + 1}
        </Pagination.Item>
      ))}

      <Pagination.Next onClick={handleNext} />
      <Pagination.Last onClick={() => updatePageProducts(pageCount - 1)} />
    </Pagination>
  );
}
