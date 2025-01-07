import { useState, useCallback } from "react";
import {
  keepPreviousData,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

import { IResponseData } from "~/types/api/general";

/**
 * Filters out specific keys from `UseQueryOptions` to create a new type for query filters.
 */
type QueryFilters<T> = Omit<
  UseQueryOptions<T>,
  "queryKey" | "queryFn" | "enabled"
>;

/**
 * Merges default query options with additional query filters.
 *
 * @param {UseQueryOptions<T>} defaultOptions - The default options for the query.
 * @param {QueryFilters<T>} [queryFilters] - Additional filters to apply to the query options.
 * @returns {UseQueryOptions<T>} - The merged query options.
 */
const mergeQueryOptions = <T,>(
  defaultOptions: UseQueryOptions<T>,
  queryFilters?: QueryFilters<T>
): UseQueryOptions<T> => {
  return {
    ...defaultOptions,
    ...queryFilters,
  };
};

/**
 * A function type for fetching paginated data.
 *
 * @template T - The type of data returned by the fetch function.
 * @param {number} pageIndex - The current page index.
 * @param {number} pageSize - The number of items per page.
 * @returns {Promise<IResponseData<T>>} - A promise that resolves to the response data.
 */
type TFetchDataFunction<T> = (
  pageIndex: number,
  pageSize: number
) => Promise<IResponseData<T>>;

/**
 * A custom React hook to handle pagination with `react-query`.
 *
 * @template T - The type of data returned by the fetch function.
 *
 * @param {Object} params - The parameters for the pagination hook.
 * @param {TFetchDataFunction<T>} params.fetchData - A function to fetch paginated data.
 * @param {any[]} params.queryKey - The query key for `react-query`.
 * @param {number} [params.initialPageSize=10] - The initial number of items per page.
 * @param {QueryFilters<IResponseData<T>>} [params.queryFilters] - Additional filters for the query options.
 * @param {boolean} [params.enabled=true] - Whether the query is enabled.
 *
 * @example
 * const {
 *   data,
 *   isLoading,
 *   pageIndex,
 *   setPageIndex,
 *   pageSize,
 *   setPageSize,
 *   total,
 *   isFetching,
 *   hasNextPage,
 *   hasPreviousPage,
 *   totalPages,
 * } = usePagination({
 *   fetchData: fetchUsers,
 *   queryKey: ["users"],
 *   initialPageSize: 20,
 * });
 *
 * return (
 *   <div>
 *     {isLoading ? (
 *       <p>Loading...</p>
 *     ) : (
 *       <ul>
 *         {data?.map((user) => (
 *           <li key={user.id}>{user.name}</li>
 *         ))}
 *       </ul>
 *     )}
 *     <button onClick={() => setPageIndex(pageIndex - 1)} disabled={!hasPreviousPage}>
 *       Previous
 *     </button>
 *     <button onClick={() => setPageIndex(pageIndex + 1)} disabled={!hasNextPage}>
 *       Next
 *     </button>
 *   </div>
 * );
 */

const usePagination = <T,>({
  fetchData,
  queryKey,
  initialPageSize,
  queryFilters,
  enabled = true,
}: {
  fetchData: TFetchDataFunction<T>;
  queryKey: any[];
  initialPageSize?: number;
  queryFilters?: QueryFilters<IResponseData<T>>;
  enabled?: boolean;
}) => {
  const [pageSize, setPageSize] = useState(initialPageSize || 10);
  const [pageIndex, setPageIndex] = useState(0);

  const fetchItems = useCallback(
    async (pageIndex: number, pageSize: number) => {
      try {
        const response = await fetchData(pageIndex, pageSize);
        return response;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Re-throw the error to be handled by useQuery
      }
    },
    [fetchData]
  );

  const defaultOptions: UseQueryOptions<IResponseData<T>> = {
    queryKey: [...queryKey, pageIndex, pageSize],
    queryFn: () => fetchItems(pageIndex, pageSize),
    placeholderData: keepPreviousData,
    enabled: pageIndex > -1 && enabled, // Disable query when pageIndex is 0
  };

  const { data, isFetching, isLoading } = useQuery(
    mergeQueryOptions(defaultOptions, queryFilters)
  );

  return {
    /**
     * The paginated data returned from the API.
     */
    data: data?.data,
    /**
     * Indicates whether the data is currently being loaded for the first time.
     */
    isLoading,
    /**
     * The current page index.
     */
    pageIndex,
    /**
     * A function to set the current page index.
     */
    setPageIndex,
    /**
     * The number of items per page.
     */
    pageSize,
    /**
     * A function to set the number of items per page.
     */
    setPageSize,
    /**
     * The total number of items available.
     */
    total: data?.paging?.totalItems,
    /**
     * Indicates whether the data is currently being fetched.
     */
    isFetching,
    /**
     * Indicates whether there is a next page of data.
     */
    hasNextPage: data?.paging?.hasNextPage !== null,
    /**
     * Indicates whether there is a previous page of data.
     */
    hasPreviousPage: data?.paging?.hasPreviousPage !== null || false,
    /**
     * The total number of pages.
     */
    totalPages: data?.paging?.totalPages || 0,
  };
};

export default usePagination;
