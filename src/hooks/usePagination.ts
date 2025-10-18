import { type ChangeEvent, useEffect, useState } from "react";

interface PaginationParams {
  page: string;
  page_size: string;
}

export const usePagination = <T extends PaginationParams>(defaultParams: T) => {
  let [params, setParams] = useState<T>(defaultParams);
  let [keyword, setKeyword] = useState("");
  let [filterParams, setFilterParams] = useState<T>(defaultParams);
  const handleKeyword = (keyword: string) => {
    setFilterParams(() => {
      return { ...params, keyword: keyword, page: 1 };
    });
    setParams(() => {
      return { ...params, keyword: keyword, page: 1 };
    });
  };

  const handleFilter = () => {
    setFilterParams(() => {
      return {
        ...params,
        page: 1,
      };
    });
    setParams((prevParams) => {
      return {
        ...prevParams,
        page: 1,
      };
    });
  };

  const handleSearch = (e: ChangeEvent<any>) => {
    setKeyword(e.target.value);
  };
  useEffect(() => {
    const interval = setTimeout(() => {
      handleKeyword(keyword);
    }, 500);

    return () => clearTimeout(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const handleClear = () => {
    setFilterParams(defaultParams);
    setParams(defaultParams);
  };

  const handlePageSize = (e: ChangeEvent<any>) => {
    setParams((params) => ({ ...params, page_size: e.target.value, page: 1 }));
    setFilterParams((params) => ({
      ...params,
      page_size: e.target.value,
      page: 1,
    }));
  };

  const handlePage = (page: number) => {
    setParams((params) => ({ ...params, page: page }));
    setFilterParams((params) => ({ ...params, page: page }));
  };

  return {
    params,
    setParams,
    handleFilter,
    handleClear,
    handlePageSize,
    handlePage,
    filterParams,
    handleSearch
  };
};