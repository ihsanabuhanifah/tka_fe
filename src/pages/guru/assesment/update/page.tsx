"use client";

import { useParams } from "react-router";
import { useDeleteSoalFromUjian, useDetailUjian } from "../service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import QuestionBuilderSingle from "../Question";
import { useEffect, useRef, useState } from "react";
import ListSoal from "./ListSoal";

export default function UpdateAssesmentPage() {
  const { id } = useParams();
  const { data, isFetching, isLoading } = useDetailUjian(id as string);
  const mutate = useDeleteSoalFromUjian(id as string);
  const containerRef = useRef<HTMLDivElement | null>(null);
  let [active, setActive] = useState<number | null>(null);

  const sortedSoal = (data?.soal || []).sort(
    (a: any, b: any) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: data?.id || "",
      nama_ujian: data?.nama_ujian || "",
      deskripsi: data?.deskripsi || "",
      kode: data?.kode || "",
      user_name: data?.user_name || "",
      nama_mapel: data?.nama_mapel || "",
      mapel_id: data?.mapel_id || "",
      tanggal_mulai: data?.tanggal_mulai?.split("T")[0] || "",
      tanggal_selesai: data?.tanggal_selesai?.split("T")[0] || "",
      durasi_menit: data?.durasi_menit || 60,
      is_published: data?.is_published || false,
      soal: sortedSoal,
    },
    validationSchema: Yup.object({
      nama_ujian: Yup.string().required("Nama ujian wajib diisi"),
      tanggal_mulai: Yup.date().required("Tanggal mulai wajib diisi"),
      tanggal_selesai: Yup.date().required("Tanggal selesai wajib diisi"),
      soal: Yup.array()
        .of(
          Yup.object({
            id: Yup.string().required(),
            pertanyaan: Yup.string().required(),
          })
        )
        .min(1, "Ujian harus memiliki minimal satu soal"),
    }),
    onSubmit: (values) => {
      console.log("submit", values);
    },
  });

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center h-screen  overflow-hidden bg-gray-50 text-gray-700">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        <span>Memuat data ujian...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Data ujian tidak ditemukan.
      </div>
    );
  }

  return (
   
      <div
        className=" space-y-4 pr-2 overflow-hidden grid grid-cols-3 gap-6"
        style={{
          zoom: "90%",
        }}
      >
        <FormikProvider value={formik}>
          <div
            ref={containerRef}
            style={{ height: "calc(100vh - 5px)" }}
            className=" col-span-2 overflow-y-auto "
          >
            <form onSubmit={formik.handleSubmit} className=" py-10">
              <Card className="mb-5">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="text-2xl font-semibold text-gray-800">
                    Detail Ujian
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    Lihat atau ubah informasi ujian berikut.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label>Nama Ujian</Label>
                    <Input
                      name="nama_ujian"
                      value={formik.values.nama_ujian}
                      onChange={formik.handleChange}
                      placeholder="Masukkan nama ujian"
                      className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Deskripsi</Label>
                    <Input
                      name="deskripsi"
                      value={formik.values.deskripsi}
                      onChange={formik.handleChange}
                      placeholder="Masukkan deskripsi ujian"
                      className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Kode Ujian</Label>
                      <Input
                        value={formik.values.kode}
                        disabled
                        className="bg-gray-100 text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pembuat</Label>
                      <Input
                        value={formik.values.user_name}
                        disabled
                        className="bg-gray-100 text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Mapel</Label>
                    <Input
                      value={formik.values.nama_mapel}
                      disabled
                      className="bg-gray-100 text-gray-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Tanggal Mulai</Label>
                      <Input
                        type="date"
                        name="tanggal_mulai"
                        value={formik.values.tanggal_mulai}
                        onChange={formik.handleChange}
                        className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal Selesai</Label>
                      <Input
                        type="date"
                        name="tanggal_selesai"
                        value={formik.values.tanggal_selesai}
                        onChange={formik.handleChange}
                        className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Durasi (menit)</Label>
                    <Input
                      type="number"
                      name="durasi_menit"
                      value={formik.values.durasi_menit}
                      onChange={formik.handleChange}
                      className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <Separator className="my-6" />

                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div>
                      <Label className="font-medium text-gray-700">
                        Publikasikan Ujian
                      </Label>
                    </div>
                    <Switch
                      checked={formik.values.is_published}
                      onCheckedChange={(v) =>
                        formik.setFieldValue("is_published", v)
                      }
                    />
                  </div>

                  <Separator className="my-6" />
                  <Button
                    type="submit"
                    className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-all"
                  >
                    Simpan Perubahan
                  </Button>
                </CardContent>
              </Card>

              <div>
                {formik.values.mapel_id && formik.values.id ? (
                  formik.values.soal.length === 0 ? (
                    <QuestionBuilderSingle
                      mapel_id={formik.values.mapel_id}
                      banksoal={formik.values.soal || []}
                      ujian_id={formik.values.id}
                    />
                  ) : (
                    <>
                      {formik.values.soal.map(
                        (
                          q: { id: string; mapel_id: string; soal: string },
                          index: number
                        ) => (
                          <div
                            key={q.id}
                            onClick={() => setActive(index)}
                            className="relative border rounded-lg p-4 mb-4 bg-white shadow-sm"
                          >
                            {active === index && (
                              <div className="h-full left-0 top-0 bottom-0 rounded-tl-lg rounded-bl-lg absolute w-[30px] bg-blue-500"></div>
                            )}
                            <button
                              type="button"
                              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                              onClick={async () => {
                                mutate.mutate({
                                  payload: formik.values.soal?.filter(
                                    (i: { id: string }) => i.id !== q.id
                                  ),
                                  id_soal: q.id,
                                });
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <QuestionBuilderSingle
                              index={index}
                              mapel_id={formik.values.mapel_id}
                              id={q.id}
                              banksoal={
                                formik.values.soal?.map(
                                  (s: { id: string }) => s.id
                                ) || []
                              }
                              existing={{
                                ...formik.values.soal[index],
                                soal: JSON.parse(
                                  formik.values.soal[index].soal
                                ),
                              }}
                              ujian_id={formik.values.id}
                            />
                          </div>
                        )
                      )}

                      <div
                        onClick={() => setActive(null)}
                        className="relative border rounded-lg p-4 mb-4 bg-white shadow-sm"
                      >
                        {active === null && (
                          <div className="h-full left-0 top-0 bottom-0 rounded-tl-lg rounded-bl-lg absolute w-[30px] bg-blue-500"></div>
                        )}{" "}
                        <QuestionBuilderSingle
                          containerRef={containerRef}
                          mapel_id={formik.values.mapel_id}
                          banksoal={formik.values.soal || []}
                          ujian_id={formik.values.id}
                        />
                      </div>
                    </>
                  )
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    Menunggu data ujian...
                  </div>
                )}
              </div>
            </form>
          </div>

        
           {data?.mapel_id && (
            <ListSoal
              ujian_id={data.id}
              mapel_id={data.mapel_id}
              soal={formik.values.soal?.map((i: { id: string }) => i.id)}
            />
          )}
        
        </FormikProvider>
      </div>
   
  );
}
