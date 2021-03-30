import { useState } from "react";
import { createIndexesArray, indexToRender } from "./pagination-helper";

interface IProps{
  page:number,
  total:number,
  setOffset:(index:number) => void,
}

const Pagination = (props:IProps) => {
  const [page, setPage] = useState(props.page);
  const maxPages = props.total;
  const indexes : number[] = createIndexesArray(maxPages);

  /**
   * Change page
   * @param index Number of the selected page
   */
  const changePage = (index:number) => {
    const lastIndex = indexes.length - 1;
    if (index > 0 && index <= indexes[lastIndex]) {
      setPage(index);
      props.setOffset(index);
    }
  }

  /**
   * Array with pagination elements
   */
  const elements = indexToRender(page,indexes,maxPages).map((index:number) => {
    return (<p
        key={index}
        onClick={() => changePage(index)}
        className={page === index ? "active" : ""}>
        {index}
      </p>
    )
  });

  return (
    <div className="pagination">
      <p onClick={() => changePage(page - 1)}>&laquo;</p>
      {elements}
      <p onClick={() => changePage(page + 1)}>&raquo;</p>
    </div>
  );
}

export default Pagination;
