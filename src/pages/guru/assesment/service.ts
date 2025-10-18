import axiosClient from "@/service/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

import type { ProfileResponse } from "../interface";
import type { SoalFormValues } from "./Question";
import { usePagination } from "@/hooks/usePagination";

const getProfile = (): Promise<ProfileResponse> => {
  return axiosClient.get("auth/profile").then((n) => n.data);
};

export const useProfile = () => {
  const { data, isFetching, isLoading } = useQuery({
    queryFn: () => getProfile(),
    queryKey: ["auth/profile"],
    select: (res) => res.data,
    staleTime: 60 * 1000 * 60 * 24,
  });

  return { data, isFetching, isLoading };
};

export const bankSoalService = {
  create: async (data: any) => {
    const res = await axiosClient.post("/bank-soal/create", data);
    return res.data;
  },
  update: async (data: any) => {
    const res = await axiosClient.put("/bank-soal/update", data);
    return res.data;
  },

  list: async (params: any) => {
    const res = await axiosClient.get("/bank-soal/list", { params });
    return res.data;
  },
};

export const ujianService = {
  list: async (params: { page_size: string; page: string }) => {
    const res = await axiosClient.get("/ujian/list", { params });
    return res.data;
  },
  create: async (data: any) => {
    const res = await axiosClient.post("/ujian/create", data);
    return res.data;
  },

  add: async (
    id: string,
    data: {
      soal: string[];
      soals: any[];
    }
  ) => {
    const res = await axiosClient.put(`/ujian/add-soal/${id}`, data);
    return res.data;
  },

  detail: async (id: string) => {
    const res = await axiosClient.get(`/ujian/detail/${id}`);
    return res.data;
  },
  delete: async (id: string, payload: { id: string }[] , id_soal: string) => {
   
    const res = await axiosClient.put(`/ujian/delete/${id}`, {
      soalIds: payload.map((i: { id: string }) => i.id),
      id_soal: id_soal
    });
    return res.data;
  },
};

export const useListBankSoal = (mapel_id: string, soal: string[]) => {
  const {
    params,
    setParams,
    handleFilter,
    handleClear,
    handlePageSize,
    handlePage,
    filterParams,
  } = usePagination({ page: "1", page_size: "10", mapel_id, soal: soal });

  const { data, isFetching, isLoading } = useQuery({
    queryFn: () =>
      bankSoalService.list({
        ...filterParams,
      }),
    queryKey: ["/bank-soal/list/ujian"],

    select: (res) => res.data,
    // staleTime: 60 * 1000 * 60 * 24,
  });

  return {
    data,
    isFetching,
    isLoading,
    params,

    setParams,
    handlePageSize,
    handlePage,
    handleFilter,
    handleClear,
  };
};

export const useListUjian = () => {
  const {
    params,
    setParams,
    handleFilter,
    handleClear,
    handlePageSize,
    handlePage,
    filterParams,
  } = usePagination({ page: "1", page_size: "10" });

  const { data, isFetching, isLoading } = useQuery({
    queryFn: () => ujianService.list(filterParams),
    queryKey: ["/ujian/list"],

    select: (res) => res.data,
    // staleTime: 60 * 1000 * 60 * 24,
  });

  return {
    data,
    isFetching,
    isLoading,
    params,

    setParams,
    handlePageSize,
    handlePage,
    handleFilter,
    handleClear,
  };
};

export const useDetailUjian = (id: string) => {
  const { data, isFetching, isLoading } = useQuery({
    queryFn: () => ujianService.detail(id),
    queryKey: ["/ujian/detail", id],
    enabled: !!id === true,
    select: (res) => res.data,
    staleTime: 60 * 1000 * 60 * 24,
  });

  return { data, isFetching, isLoading };
};

export const useUpdateBankSoal = (ujian_id: string) => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: (payload: SoalFormValues) => {
      return bankSoalService.update(payload);
    },
    onSuccess: (res) => {
      const previousDetail = queryClient.getQueryData<any>(["/ujian/detail", ujian_id]);
      console.log("prevDetail", previousDetail);
      console.log("Res", res.data);

      if (!previousDetail) return;

      // Update cache ujian detail secara lokal berdasarkan id
      const updatedSoal = previousDetail.data.soal.map((item: any) =>
        item.id === res.data.id ? res.data : item
      );

      queryClient.setQueryData<any>(["/ujian/detail", ujian_id], {
        ...previousDetail,
        data: {
          ...previousDetail.data,
          soal: updatedSoal,
        },
      });

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Perbaharui Berhasil",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  return mutate;
};


export const useCreateUjian = () => {
  const navigate = useNavigate();
  const mutate = useMutation({
    mutationFn: (payload: any) => {
      return ujianService.create(payload);
    },
    onSuccess: (res) => {
      console.log("res", res);

      navigate(`${res.data.id}`);
    },
  });

  return mutate;
};

export const useCreateBankSoal = (ujian_id: string) => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: (payload: SoalFormValues) => bankSoalService.create(payload),

    onSuccess: async (res) => {
      try {
        // await queryClient.cancelQueries(["/ujian/detail",ujian_id]);

        // Simpan snapshot lama
        const previousDetail = queryClient.getQueryData<any>([
          "/ujian/detail",
          ujian_id,
        ]);
        console.log("prevDetail", previousDetail);

        // Update cache ujian detail secara lokal
        return queryClient.setQueryData<any>(
          ["/ujian/detail", ujian_id],
          () => {
            return {
              ...previousDetail,
              data: {
                ...previousDetail.data,
                soal: [...previousDetail.data.soal, res.data],
              },
            };
          }
        );
      } catch (err) {
        console.log("er", err);
      }
    },
  });

  return mutate;
};



export const useAddSoaltoUjian = (ujian_id: string) => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: (payload: {
      soal : [],
      soals : any[]
    }) => ujianService.add(ujian_id,payload),

    onSuccess: async (res) => {
      try {
        // await queryClient.cancelQueries(["/ujian/detail",ujian_id]);

        // Simpan snapshot lama
        const previousDetail = queryClient.getQueryData<any>([
          "/ujian/detail",
          ujian_id,
        ]);
        console.log("prevDetail", previousDetail);


        console.log("res", res)

        

        // Update cache ujian detail secara lokal
        return queryClient.setQueryData<any>(
          ["/ujian/detail", ujian_id],
          () => {
            return {
              ...previousDetail,
              data: {
                ...previousDetail.data,
                soal: [...previousDetail.data.soal, ...res],
              },
            };
          }
        );
      } catch (err) {
        console.log("er", err);
      }
    },
  });

  return mutate;
};


export const useDeleteSoalFromUjian = (ujian_id: string) => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: (payload: any) => {
      return ujianService.delete(ujian_id, payload.payload, payload.id_soal);
    },

    onSuccess: (res: any) => {
      const previousDetail = queryClient.getQueryData<any>(["/ujian/detail", ujian_id]);
      console.log("prevDetail", previousDetail);
      console.log("res", res);

      if (!previousDetail) return;

      // Hapus soal dari array berdasarkan id_soal
      const updatedSoal = previousDetail.data.soal.filter(
        (item: any) => item.id !== res.id_soal
      );

      // Update cache lokal
      queryClient.setQueryData<any>(["/ujian/detail", ujian_id], {
        ...previousDetail,
        data: {
          ...previousDetail.data,
          soal: updatedSoal,
        },
      });

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Soal berhasil dihapus",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  return mutate;
};

