import { useQuery } from "@tanstack/react-query";
import useFetcher from "./useFetcher";
import { useNavigate } from "react-router-dom";

const useGetData = ({ queryKey, url, options = {}, shouldValidate = true }) => {
  const { jsonFetcher } = useFetcher();
  const navigate = useNavigate();

  // 1. Destructure and remove the callbacks from the options object
  //    before spreading the rest of the options later.
  const { ...restOptions } = options;

  // 2. Base Query Configuration (static)
  const baseOptions = {
    queryKey,
    queryFn: () => jsonFetcher({ url, method: "GET" }),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  };

  // 3. Define the merged callbacks using a consistent pattern

  // 4. Combine all options
  const finalOptions = {
    ...baseOptions,
    ...restOptions,
  };

  return useQuery(finalOptions);
};

export default useGetData;
