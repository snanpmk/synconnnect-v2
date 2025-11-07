import { useQuery } from "@tanstack/react-query";
import useFetcher from "./useFetcher";
import { useNavigate } from "react-router-dom";

const useGetData = ({ queryKey, url, options, shouldValidate = true }) => {
  const { jsonFetcher } = useFetcher();
  const navigate = useNavigate();
  const defaultErrorOptions = {
    onError: (error) => {
      if (error?.response?.status === 401) {
        navigate("/login");
      }

      if (options?.onError) {
        options.onError(error);
      }
    },
  };

  const baseOptions = {
    queryKey,
    queryFn: () => jsonFetcher({ url, method: "GET" }),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  };

  const finalOptions = {
    ...baseOptions,
    ...options,
    ...(shouldValidate ? defaultErrorOptions : {}),
  };

  if (shouldValidate) {
    const originalOnError = finalOptions.onError;
    const originalOnSuccess = finalOptions.onSuccess;

    finalOptions.onError = (error) => {
      originalOnError?.(error);
    };

    finalOptions.onSuccess = (data) => {
      originalOnSuccess?.(data);
    };
  }

  return useQuery(finalOptions);
};

export default useGetData;
