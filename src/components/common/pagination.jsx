import React from "react";
import PropTypes from "prop-types";

/* 

Input:
  number of item
  number of items per page
  activePage

Output: 
  number of pages

Event: 
  onChangePage 

*/

const Pagination = ({ itemCount, pageSize, currentPage, onPageChange }) => {
  let numberOfPages = Math.ceil(itemCount / pageSize);
  if (numberOfPages === 1) return null;
  let classes = "page-item";
  return (
    <ul className="pagination">
      {getPageNumbers(numberOfPages).map(p => (
        <li
          key={p}
          className={currentPage === p ? classes + " active" : ""}
          onClick={() => onPageChange(p)}
        >
          <button className="page-link">{p}</button>
        </li>
      ))}
    </ul>
  );
};

export function paginate(items, pageNumber, pageSize) {
  let start = (pageNumber - 1) * pageSize;
  // corner case
  if (start >= items.length) return items;
  let paginated = [];
  for (let i = start; i < Math.min(items.length, start + pageSize); i++) {
    paginated.push(items[i]);
  }
  return paginated;
}

function getPageNumbers(numberOfPages) {
  let pageNumbers = new Array(numberOfPages);
  for (let i = 1; i <= numberOfPages; i++) {
    pageNumbers[i] = i;
  }
  return pageNumbers;
}

Pagination.propTypes = {
  itemCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};

export default Pagination;
