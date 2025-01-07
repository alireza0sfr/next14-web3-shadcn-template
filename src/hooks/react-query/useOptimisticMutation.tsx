import {
  MutationFunction,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

/**
 * Props for the `useOptimisticMutation` hook.
 *
 * @template TState - The type of the state managed by the hook.
 * @template TVariables - The type of the variables passed to the mutation function.
 * @template TContext - The type of the context passed to the mutation callbacks.
 * @template TResult - The type of the result returned by the mutation function.
 */
type UseOptimisticMutationProps<TState, TVariables, TContext, TResult> = {
  /** The current state managed by the hook. */
  state: TState;
  /** The mutation function that performs the actual mutation. */
  mutationFn: MutationFunction<TResult, TVariables>;
  /** The function that performs the optimistic update on the state. */
  optimisticUpdateFn: (state: TState, variables: TVariables) => void;
  /** The query key used to identify the query in the cache. */
  queryKey: QueryKey;
  /** Optional callback function to be called on mutation error. */
  onError?: (error: unknown) => void;
  /** Optional callback function to be called on mutation success. */
  onSuccess?: (data: TResult) => void;
  /** Optional parameter to enable/disable refetching the query after settled. */
  shouldRefetchQuery?: boolean;
};

/**
 * A custom hook that provides optimistic updates for mutations in React Query.
 *
 * @template TState - The type of the state managed by the hook.
 * @template TVariables - The type of the variables passed to the mutation function.
 * @template TContext - The type of the context passed to the mutation callbacks.
 * @template TResult - The type of the result returned by the mutation function.
 *
 * @param {UseOptimisticMutationProps<TState, TVariables, TContext, TResult>} props - The props for the hook.
 * @returns {import("@tanstack/react-query").UseMutationResult<TResult, unknown, TVariables, unknown>} - The result of the mutation.
 *
 * @example
 * const { mutate } = useOptimisticMutation({
 *   state: currentState,
 *   mutationFn: updateTodo,
 *   optimisticUpdateFn: (state, variables) => {
 *     state.todos = state.todos.map((todo) =>
 *       todo.id === variables.id ? { ...todo, ...variables } : todo
 *     );
 *   },
 *   queryKey: ["todos"],
 *   onSuccess: (data) => {
 *     console.log("Todo updated successfully:", data);
 *   },
 *   onError: (error) => {
 *     console.error("Failed to update todo:", error);
 *   },
 * });
 *
 * return (
 *   <button
 *     onClick={() =>
 *       mutate({ id: 1, title: "Updated Todo", completed: true })
 *     }
 *   >
 *     Update Todo
 *   </button>
 * );
 */

export const useOptimisticMutation = <TState, TVariables, TContext, TResult>({
  state,
  mutationFn,
  optimisticUpdateFn,
  queryKey,
  onSuccess,
  onError,
  shouldRefetchQuery = true,
}: UseOptimisticMutationProps<TState, TVariables, TContext, TResult>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables: TVariables) => {
      /** Cancel any outgoing refetches (so they don't overwrite our optimistic update) */
      await queryClient.cancelQueries({ queryKey: queryKey });

      /** Snapshot the previous state */
      const previousState = queryClient.getQueryData<TState>(queryKey);

      /** Optimistically update to the new state */
      optimisticUpdateFn(state, variables);

      /** Return a context object with the snapshotted value */
      return { previousState };
    },
    onError: (error, variables, context) => {
      /** Rollback to the previous state on error */
      queryClient.setQueryData<TState>(queryKey, context?.previousState);

      /** Call the onError callback if provided */
      if (onError) onError(error);
    },
    onSettled: () => {
      if (shouldRefetchQuery) {
        /** Invalidate the query to refetch the data */
        queryClient.invalidateQueries({ queryKey: queryKey });
      }
    },
    onSuccess: (data) => {
      /** Call the onSuccess callback if provided */
      if (onSuccess) onSuccess(data);
    },
  });
};
