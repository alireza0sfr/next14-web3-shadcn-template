import { useCallback, useEffect, useState } from "react";

import {
  ExtendedNotificationOptions,
  isNotificationSupported,
  isServiceWorkerSupported,
  requestNotificationPermission,
  showNotification,
} from "~/helpers/notification/notificationUtils";

type NotificationPermissionStatus = "default" | "granted" | "denied";

/**
 * Creates a custom hook for managing notifications in a React component.
 *
 * @returns {Object} An object containing notification-related functions and state.
 * @property {boolean} isSupported - Indicates whether the browser supports notifications.
 * @property {NotificationPermissionStatus} permission - The current notification permission status.
 * @property {function} requestPermission - Function to request notification permission from the user.
 * @property {function} notify - Function to show a notification with optional custom icon.
 */
export function useNotification() {
  // State to track whether notifications are supported by the browser
  const [isSupported, setIsSupported] = useState(false);

  // State to track the current notification permission status
  const [permission, setPermission] =
    useState<NotificationPermissionStatus>("default");

  // Effect to check if notifications are supported and set the initial permission status
  useEffect(() => {
    const supported = isNotificationSupported();

    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission as NotificationPermissionStatus);
    }

    // Register service worker if supported
    if (isServiceWorkerSupported() && !!navigator) {
      navigator.serviceWorker.register("/sw.js").then(
        function (registration) {
          // console.log(
          //   "ServiceWorker registration successful with scope: ",
          //   registration.scope
          // );
        },
        function (err) {
          console.log("ServiceWorker registration failed: ", err);
        }
      );
    }
  }, []);

  /**
   * Requests notification permission from the user.
   *
   * @returns {Promise<boolean>} A promise that resolves to `true` if permission is granted, otherwise `false`.
   */
  const requestPermission = useCallback(async () => {
    if (!isNotificationSupported()) {
      console.log("Notifications are not supported in this browser.");
      return false;
    }

    const isGranted = await requestNotificationPermission();
    setPermission(Notification.permission as NotificationPermissionStatus);
    return isGranted;
  }, [isNotificationSupported]);

  /**
   * Shows a notification
   *
   * @param {ExtendedNotificationOptions} options - The options for the notification.
   * @returns {Promise<void>} A promise that resolves when the notification is shown.
   */
  const notify = useCallback(
    async (options: ExtendedNotificationOptions) => {
      if (!isNotificationSupported()) {
        console.log("Notifications are not supported in this browser.");
        return;
      }

      const notificationIcon = options?.icon || "/images/favicon.svg";

      await showNotification({
        ...options,
        icon: notificationIcon,
      });

      setPermission(Notification.permission as NotificationPermissionStatus);
    },
    [isNotificationSupported]
  );

  return {
    isSupported,
    permission,
    requestPermission,
    notify,
  };
}
