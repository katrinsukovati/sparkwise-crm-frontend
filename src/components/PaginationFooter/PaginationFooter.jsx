import React from "react";
import "./PaginationFooter.scss";

function PaginationFooter({
  currentPage,
  totalPages,
  totalEntries,
  itemsPerPage,
  onPageChange,
}) {
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalEntries);

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 7;
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="pagination-footer">
      <div className="pagination-footer__info">
        {startIndex === endIndex
          ? `Showing all ${totalEntries} entries`
          : `Showing ${startIndex} to ${endIndex} of ${totalEntries} entries`}
      </div>
      <div className="pagination-footer__controls">
        <button
          type="button"
          className="page-btn prev-page"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <button
          type="button"
          className="page-btn start-page"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          Start
        </button>
        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            className={`page-btn ${currentPage === page ? "active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          className="page-btn end-page"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          End
        </button>
        <button
          type="button"
          className="page-btn next-page"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PaginationFooter;
