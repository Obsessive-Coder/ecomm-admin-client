import React from 'react';

// Bootstrap Components.
import Pagination from 'react-bootstrap/Pagination';

export default function TablePagination({ pageNumber, pageCount, setPageNumber }) {
  const handleNext = () => {
    const nextPage = pageNumber + 1;
    if (nextPage <= pageCount) {
      setPageNumber(nextPage);
    }
  };

  const handlePrevious = () => {
    const prevPage = pageNumber - 1;
    if (prevPage >= 1) {
      setPageNumber(prevPage);
    }
  };


  return (
    <Pagination className="justify-content-center">
      <Pagination.First onClick={() => setPageNumber(1)} />
      <Pagination.Prev onClick={handlePrevious} />

      {Array.from(Array(pageCount).keys()).map((index) => (
        <Pagination.Item
          key={index}
          active={pageNumber === index + 1}
          onClick={() => setPageNumber(index + 1)}
        >
          {index + 1}
        </Pagination.Item>
      ))}

      <Pagination.Next onClick={handleNext} />
      <Pagination.Last onClick={() => setPageNumber(pageCount)} />
    </Pagination>
  );
}
