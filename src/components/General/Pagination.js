import React , { useState } from 'react';

export default function Pagination(props) {
    const [page, setpage] = useState(props.page);
    const maxPages = props.total;

    const indexes = [];
    for (let i = 1; i <= maxPages; i++) {
      indexes.push(i);
    }
    function changePage(index) {
      const lastIndex = indexes.length - 1;
      if (index > 0 && index <= indexes[lastIndex]) {
        setpage(index);
        props.setOffset(index);
      }
    }
    function indexToRender() {
      const indexToReturn = [];
      let count = 0;
      if (page > 2 && page < indexes.length - 2) {
        const tmpIndex = page - 2;
        while (count < 5) {
          indexToReturn.push(tmpIndex + count);
          count++;
        }
      } else if (page <= 2) {
        const min = maxPages <= 5 ? maxPages : 5;
        while (count < min) {
          indexToReturn.push(1 + count);
          count++;
        }
      } else {
        if (maxPages <= 5) {
          const tmpFirstIndex = indexes.length - (maxPages - 1);
          while (count < maxPages) {
            indexToReturn.push(tmpFirstIndex + count);
            count++;
          }
        } else {
          const tmpFirstIndex = indexes.length - 4;
          while (count < 5) {
            indexToReturn.push(tmpFirstIndex + count);
            count++;
          }
        }
      }
      return indexToReturn;
    }
    const elements = indexToRender().map((index) => {
      return renderPaginationItem(index, changePage);
    });

  function renderPaginationItem(index, change) {
    return (
      <p
        key={index}
        onClick={() => change(index)}
        className={page === index ? "active" : ""}
      >
        {index}
      </p>
    );
  }

  return (
    <div className="pagination">
      <p onClick={() => changePage(page - 1)}>&laquo;</p>
      {elements}
      <p onClick={() => changePage(page + 1)}>&raquo;</p>
    </div>
  );
}
