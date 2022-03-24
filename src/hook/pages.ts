import { useEffect, useState } from "react";

const usePages = function <T>(pageSize: number, list: T[]) {
  const [pageIdx, updatePageIdx] = useState(1);
  const pageCount = Math.ceil(list.length / pageSize);
  const [table, updateTable] = useState<T[]>([]);
  const handleChangePage = function (index: number) {
    if (index < 1) {
      return;
    }
    if (index > pageCount) {
      return;
    }
    updatePageIdx(index);
  }

  useEffect(() => {
    const arr = list.slice((pageIdx-1) * pageSize, pageIdx * pageSize)
    updateTable(arr);
  }, [pageIdx, pageSize, list]);

  return [pageIdx, pageCount, table, handleChangePage] as const;
}

export default usePages;

