"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AssessmentBuilderModal from "./AssesmentCreate";
import { useListUjian } from "./service";
import {
  Loader2,
  CalendarDays,
  FileText,
  Edit3,
 
} from "lucide-react";
import { useNavigate } from "react-router";

// ✅ Gambar berdasarkan mata pelajaran


export default function AssessmentBuilder() {
  const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
  const {
    data,
    isFetching,
    isLoading,
    params,
    handlePage,
  } = useListUjian();

  console.log("data ujian:", data);

  return (
    <>
      <AssessmentBuilderModal open={open} setOpen={setOpen} />

      <div className="container mx-auto py-10 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">📚 Daftar Ujian</h1>
          <Button onClick={() => setOpen(true)}>➕ Buat Ujian</Button>
        </div>

        <Separator className="mb-8" />

        {isLoading || isFetching ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.map((ujian: any) => {
              const mapelKey = ujian.mapel_nama
                ? ujian.mapel_nama.toLowerCase().replace(/\s+/g, "_")
                : "default";
            

              return (
                <Card
                  key={ujian.id}
                  className="hover:shadow-lg  border border-blue-500 hover:scale-[1.01] transition-all  rounded-2xl overflow-hidden"
                >
                  {/* Gambar Mata Pelajaran */}
                  <div className="relative w-full h-32 bg-gray-200">
                    <img
                      src={"https://cdn-icons-png.flaticon.com/512/2772/277212"}
                      alt={ujian.mapel_nama}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
                      <p className="text-white text-sm font-semibold p-2">
                        {ujian.nama_mapel || "Mata Pelajaran"}
                      </p>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span className="truncate max-w-[200px] text-lg font-semibold">
                        {ujian.nama_ujian}
                      </span>
                      <Badge
                        variant={
                          ujian.is_published ? "default" : "secondary"
                        }
                      >
                        {ujian.is_published ? "Published" : "Draft"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      Kode: <span className="font-medium">{ujian.kode}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarDays className="w-4 h-4" />
                      {ujian.tanggal_mulai
                        ? new Date(ujian.tanggal_mulai).toLocaleDateString(
                            "id-ID",
                            { day: "2-digit", month: "short", year: "numeric" }
                          )
                        : "-"}
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText className="w-4 h-4" />
                      {ujian.jumlah_soal || 0} Soal
                    </div>

                    {/* Informasi tambahan */}
                   

                  
                    <p className="text-gray-500 text-sm">
                      Dibuat oleh <strong>{ujian.user_name}</strong>
                    </p>
                  </CardContent>

                  <CardFooter className="flex justify-between">
                  
                    <Button
                      size="sm"
                      className="bg-blue-400"
                      onClick={() => {
                        navigate(`${ujian.id}`);
                      }
                        
                      }
                    >
                      <Edit3 className="w-4 h-4 mr-2" /> Edit
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-10 space-x-4">
          <Button
            variant="outline"
            // disabled={params.page === 1}
            // onClick={() => handlePage(params.page - 1)}
          >
            ← Sebelumnya
          </Button>
          <span className="text-sm text-gray-500">
            Halaman {params.page} dari {data?.total_page || 1}
          </span>
          <Button
            variant="outline"
            // disabled={params.page >= data?.total_page}
            // onClick={() => handlePage(params.page + 1)}
          >
            Selanjutnya →
          </Button>
        </div>
      </div>
    </>
  );
}
