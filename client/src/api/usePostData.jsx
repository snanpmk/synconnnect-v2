import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFetcher from "./useFetcher";

const usePostData = (options = {}) => {
  const queryClient = useQueryClient();
  const { jsonFetcher } = useFetcher();
  return useMutation({
    mutationFn: ({ url, method = "POST", data }) =>
      jsonFetcher({ url, method, data }),
    onSuccess: (data, variables) => {
      if (options?.invalidateQueries) {
        queryClient.invalidateQueries({ queryKey: options.invalidateQueries });
      }
      if (options.onSuccess) {
        options.onSuccess(data, variables);
      }
    },
    onError: (error, variables) => {
      console.error("POST Form Data Error:", error);
      if (options.onError) {
        options.onError(error, variables);
      }
    },
    ...options,
  });
};

export default usePostData;
