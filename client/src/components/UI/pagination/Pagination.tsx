import { useState } from "react";
import { useEffect } from "react";
import { indexToRender } from "./PaginationHelper";

interface IProps {
  page: number;
  total: number | string;
  setOffset: (index: number) => void;
}

const Pagination = ({ page, total, setOffset }: IProps) => {
  const [pagesToRender, setPagesToRender] = useState<number[]>([1]);
  const maxPages = total;

  useEffect(() => {
    setPagesToRender(indexToRender(page, +maxPages));
  }, [page, maxPages]);

  /**
   * Change page
   * @param index Number of the selected props.page
   */
  const changePage = (index: number) => {
    if (index > 0 && index <= maxPages) {
      setOffset(index);
    }
  };

  return (
    <div className="pagination">
      <p onClick={() => changePage(page - 1)}>&laquo;</p>
      {pagesToRender.map((index: number) => (
        <p
          key={index}
          onClick={() => changePage(index)}
          className={page === index ? "active" : ""}
        >
          {index}
        </p>
      ))}

      <p onClick={() => changePage(page + 1)}>&raquo;</p>
    </div>
  );
};

export default Pagination;
