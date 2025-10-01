import axiosClient from "@/service/axios";
import { useQuery } from "@tanstack/react-query";

import type { ProfileResponse } from "./interface";

const getProfile = (): Promise<ProfileResponse> => {
  return axiosClient.get("auth/profile").then(n => n.data);
};

export const useProfile = () => {
  const { data, isFetching, isLoading } = useQuery({
    queryFn: () => getProfile(),
    queryKey: ["auth/profile"],
    select: (res) => res.data,
  });

  return { data, isFetching, isLoading };
};
