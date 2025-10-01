import axiosClient from "@/service/axios";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";

export interface loginInterface {
  email: string;
  name: string;
  foto_profile: string;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const mutate = useMutation({
    mutationFn: (payload: loginInterface) => {
      return axiosClient.post("auth/login", payload);
    },

    onSuccess: (res) => {
      Cookies.set("tka_token", res?.data?.data?.access_token, {
        expires: 7,
        path: "/",
      });

      navigate("/guru");
    },
  });

  return mutate;
};
