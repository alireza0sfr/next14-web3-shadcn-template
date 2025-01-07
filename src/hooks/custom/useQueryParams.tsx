import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface IProps {
  /**
   * @property {string} paramName - The name of the query parameter to manage.
   */
  paramName: string;

  /**
   * @property {string | string[]} [defaultValue=[]] - The default value(s) to use if the query parameter is not present in the URL.
   */
  defaultValue?: string | string[];

  /**
   * @property {boolean} [usePush=false] - Whether to use `router.push` instead of `router.replace`.
   */
  usePush?: boolean;
}

/**
 * Custom hook to manage query parameters in a Next.js application.
 *
 * @example
 * const { queryParams, setQueryParam } = useQueryParams({
 *   paramName: "filter",
 *   defaultValue: "all",
 * });
 *
 * return (
 *   <div>
 *     <p>Selected Filters: {queryParams.join(", ")}</p>
 *     <button onClick={() => setQueryParam("active")}>Set Filter to Active</button>
 *     <button onClick={() => setQueryParam(["active", "inactive"])}>Set Filters to Active and Inactive</button>
 *   </div>
 * );
 */

const useQueryParams = ({
  paramName,
  defaultValue = [],
  usePush = false,
}: IProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Function to get the current value of the query parameter.
   * @function getQueryParam
   * @returns {string | null} The current value of the query parameter, or `null` if it does not exist.
   */
  const getQueryParam = useCallback(() => {
    return searchParams.get(paramName);
  }, [searchParams, paramName]);

  /**
   * Memoized array of query parameter values.
   * @constant queryParams
   * @type {string[]}
   */
  const queryParams = useMemo(() => {
    const params = getQueryParam();
    return params
      ? params.split(",")
      : Array.isArray(defaultValue)
      ? defaultValue
      : [defaultValue];
  }, [getQueryParam, defaultValue]);

  /**
   * Function to set the value of the query parameter.
   * @function setQueryParam
   * @param {string | string[]} value - The value(s) to set for the query parameter.
   */
  const setQueryParam = useCallback(
    (value: string | string[]) => {
      const params = new URLSearchParams(searchParams);
      if (Array.isArray(value)) {
        params.delete(paramName);
        value.forEach((v) => params.append(paramName, v));
      } else if (value === "") {
        // Remove the parameter if the value is an empty string
        params.delete(paramName);
      } else {
        params.set(paramName, value);
      }
      if (usePush) {
        router.push(`?${params.toString()}`);
      } else {
        router.replace(`?${params.toString()}`);
      }
    },
    [router, searchParams, paramName, usePush]
  );

  return {
    /**
     * A function to get the current value of the query parameter.
     */
    getQueryParam,
    /**
     * A function to set the value of the query parameter.
     */
    setQueryParam,
    /**
     * The current value(s) of the query parameter as an array.
     */
    queryParams,
  };
};

export default useQueryParams;
