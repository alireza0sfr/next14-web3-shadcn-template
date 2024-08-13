import {
  MutationFunction,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

type UseOptimisticMutationProps<TState, TVariables, TContext> = {
  state: TState;
  mutationFn: MutationFunction<void, TVariables>;
  optimisticUpdateFn: (state: TState, variables: TVariables) => void;
  queryKey: QueryKey;
  onError?: () => void;
  onSuccess?: () => void;
};

export const useOptimisticMutation = <TState, TVariables, TContext>({
  state,
  mutationFn,
  optimisticUpdateFn,
  queryKey,
  onSuccess,
  onError,
}: UseOptimisticMutationProps<TState, TVariables, TContext>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables: TVariables) => {
      await queryClient.cancelQueries({ queryKey: queryKey });

      const previousState = queryClient.getQueryData<TState>(queryKey);

      optimisticUpdateFn(state, variables);
      return { previousState };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData<TState>(queryKey, context?.previousState);

      if (onError) onError();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });
};
