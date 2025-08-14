import React from "react";
import { LuChevronLeft } from "react-icons/lu";
import { LuChevronRight } from "react-icons/lu";
import { LuChevronsLeft } from "react-icons/lu";
import { LuChevronsRight } from "react-icons/lu";

const Pagination = ({
  totalItems,
  page,
  onPageChange,
  pageSize,
  blockSize,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentBlock = Math.floor((page - 1) / blockSize); // 현재 페이지가 속한 블록 (1-5페이지 -> 0번째 블록)
  const start = currentBlock * blockSize + 1;
  const end = Math.min(start + blockSize - 1, totalPages);

  const gotoPage = (p) => {
    if (p < 1 || p > totalPages) return;
    onPageChange(p);
  };

  const iconStyle =
    "w-[16px] h-[16px] text-[#A3A3A3] cursor-pointer hover:text-[#828282]";

  return (
    <div className="flex items-center justify-center gap-[12px]">
      <button onClick={() => gotoPage(1)}>
        <LuChevronsLeft className={iconStyle} />
      </button>

      <button onClick={() => gotoPage(page - 1)}>
        <LuChevronLeft className={iconStyle} />
      </button>

      <ul className="flex items-center gap-[20px] px-[43px] text-[12px] font-medium font-pretendard">
        {(() => {
          const pageNumbers = [];
          for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
          }

          return pageNumbers.map((p) => (
            <li key={p}>
              <button
                onClick={() => gotoPage(p)}
                className={`text-sm ${
                  p === page
                    ? "text-[#212121]"
                    : "text-[#A3A3A3] cursor-pointer"
                }`}
              >
                {p}
              </button>
            </li>
          ));
        })()}
      </ul>

      <button onClick={() => gotoPage(page + 1)}>
        <LuChevronRight className={iconStyle} />
      </button>

      <button onClick={() => gotoPage(totalPages)}>
        <LuChevronsRight className={iconStyle} />
      </button>
    </div>
  );
};

export default Pagination;
