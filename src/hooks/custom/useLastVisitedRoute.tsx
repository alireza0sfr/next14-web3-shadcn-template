import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import routes from "~/consts/routes";
import { createStorage } from "~/helpers/storage/storageFactory";

interface IProps {
  /**
   * The key to use for storing the route in session storage
   * @default "lastVisitedRoute"
   */
  key?: string;

  /**
   * Array of routes to exclude from tracking
   * @default []
   */
  excludeRoutes?: string[];

  /**
   * Whether to save the current route on initial load
   * @default false
   */
  saveCurrentRouteOnInitialLoad?: boolean;
}

/**
 * Custom hook to track and retrieve the last visited route
 * @param {Object} options - Configuration options for the hook
 * @param {string} options.key - The key to use for storing the route in session storage
 * @param {string[]} options.excludeRoutes - Array of routes to exclude from tracking
 * @param {boolean} options.saveCurrentRouteOnInitialLoad - Whether to save the current route on initial load
 * @returns {Object} An object containing functions to interact with the last visited route
 *
 * @example
 * const { saveCurrentRouteInHistory, goToLastVisitedRoute } = useLastVisitedRoute({
 *   key: "lastRoute",
 *   excludeRoutes: ["/login"],
 *   saveCurrentRouteOnInitialLoad: true,
 * });
 *
 * // Save the current route
 * saveCurrentRouteInHistory();
 *
 * // Navigate to the last visited route
 * goToLastVisitedRoute("/home");
 */

export function useLastVisitedRoute({
  key = "lastVisitedRoute",
  excludeRoutes = [],
  saveCurrentRouteOnInitialLoad = false,
}: IProps) {
  const router = useRouter();
  const pathname = usePathname();
  const storage = createStorage<string>({ type: "session" });

  /**
   * Saves the current route to session storage
   * @param {string} [route] - The route to save. If not provided, uses the current pathname.
   */
  const saveCurrentRouteInHistory = async (route?: string) => {
    const routeToSave = route || pathname;

    // Save the route only if it's not excluded
    if (!excludeRoutes.includes(routeToSave)) {
      await storage.setItem(key, routeToSave);
    }
  };

  /**
   * Retrieves the last visited route from session storage
   * @returns {Promise<string | null>} The last visited route or null if not found
   */
  const getLastVisitedRoute = async (): Promise<string | null> => {
    return await storage.getItem(key);
  };

  /**
   * Clears the last visited route from session storage
   */
  const clearLastVisitedRoute = async () => {
    await storage.removeItem(key);
  };

  /**
   * Navigates to the last visited route
   * @param {string} fallbackRoute - The route to navigate to if no last visited route is found
   */
  const goToLastVisitedRoute = async (fallbackRoute: string = routes.HOME) => {
    const lastRoute = await getLastVisitedRoute();
    if (lastRoute) {
      router.push(lastRoute);
    } else {
      router.push(fallbackRoute);
    }
  };

  // Save the current route on component mount if enabled
  useEffect(() => {
    if (saveCurrentRouteOnInitialLoad) {
      saveCurrentRouteInHistory();
    }
  }, [saveCurrentRouteOnInitialLoad, pathname]);

  return {
    /**
     * Saves the current route to session storage.
     */
    saveCurrentRouteInHistory,
    /**
     * Retrieves the last visited route from session storage.
     */
    getLastVisitedRoute,
    /**
     * Clears the last visited route from session storage.
     */
    clearLastVisitedRoute,
    /**
     * Navigates to the last visited route or a fallback route if no last route is found.
     */
    goToLastVisitedRoute,
  };
}
