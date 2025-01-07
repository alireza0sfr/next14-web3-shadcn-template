import { useEffect, useRef, useState, useCallback } from "react";
import io, { Socket as SocketIOClient, SocketOptions } from "socket.io-client";

/**
 * Configuration options for the socket connection.
 */
interface UseSocketOptions extends Partial<SocketOptions> {
  /** The URL of the socket server to connect to */
  url: string;
}

/**
 * A custom hook for managing WebSocket connections.
 *
 * @template TClientEvents - A type representing the events that can be emitted by the client
 * @template TServerEvents - A type representing the events that can be received from the server
 *
 * @param {UseSocketOptions} options - Configuration options for the socket connection
 * @returns An object containing the socket instance, connection status, and utility functions
 */
export function useSocket<
  TClientEvents extends Record<string, any> = Record<string, any>,
  TServerEvents extends Record<string, any> = Record<string, any>
>(options: UseSocketOptions) {
  const { url, ...socketOptions } = options;
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<SocketIOClient<TServerEvents, TClientEvents> | null>(
    null
  );
  const [eventData, setEventData] = useState<
    Partial<{
      [K in keyof TServerEvents]: TServerEvents[K] extends (
        ...args: any[]
      ) => void
        ? Parameters<TServerEvents[K]>[0]
        : never;
    }>
  >({});

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(url, {
      ...socketOptions,
      transports: ["websocket"],
    }) as SocketIOClient<TServerEvents, TClientEvents>;

    // Set up event listeners
    socketRef.current.on("connect", () => {
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [url, socketOptions]);

  /**
   * Emits an event to the socket server.
   *
   * @param {keyof TClientEvents & string} event - The name of the event to emit
   * @param {Parameters<TClientEvents[K]>} args - The arguments to send with the event
   */
  const emit = useCallback(
    <K extends keyof TClientEvents & string>(
      event: K,
      ...args: Parameters<TClientEvents[K]>
    ) => {
      if (socketRef.current) {
        socketRef.current.emit(event, ...args);
      }
    },
    []
  );

  /**
   * Subscribes to a server event.
   *
   * @param {keyof TServerEvents & string} event - The name of the event to subscribe to
   * @param {TServerEvents[K]} callback - The callback function to be called when the event is received
   */
  const on = useCallback(
    <K extends keyof TServerEvents & string>(
      event: K,
      callback: TServerEvents[K]
    ) => {
      if (socketRef.current) {
        socketRef.current.on(event, callback);
      }
    },
    []
  );

  /**
   * Unsubscribes from a server event.
   *
   * @param {keyof TServerEvents & string} event - The name of the event to unsubscribe from
   */
  const off = useCallback(
    <K extends keyof TServerEvents & string>(event: K) => {
      if (socketRef.current) {
        socketRef.current.off(event);
      }
    },
    []
  );

  /**
   * Manually reconnects the socket if disconnected.
   */
  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.connect();
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    eventData,
    emit,
    on,
    off,
    reconnect,
  };
}
