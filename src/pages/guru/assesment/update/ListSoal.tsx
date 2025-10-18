"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAddSoaltoUjian, useListBankSoal } from "../service";
import RenderMathHTML from "@/components/RenderMathHTML";
import { set } from "lodash";

interface ListSoalProps {
  mapel_id?: string;
  soal?: string[];
  ujian_id?: string;
}

export default function ListSoal({ mapel_id, soal, ujian_id }: ListSoalProps) {
  const { data, isFetching, isLoading, params, handlePage } = useListBankSoal(
    mapel_id as string,
    soal as string[]
  );

  const mutate = useAddSoaltoUjian(ujian_id as string);
  const [selectedSoalIds, setSelectedSoalIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  console.log("soal", soal);

  useEffect(() => {
    if (data && selectAll) {
      setSelectedSoalIds(data.map((item: any) => item.id));
    }
    if (!selectAll) {
      setSelectedSoalIds([]);
    }
  }, [selectAll, data]);

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center py-20 text-blue-500">
        <Loader2 className="animate-spin mr-2" />
        Memuat data soal...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-20">
        Belum ada soal untuk mapel ini.
      </div>
    );
  }

  const toggleSelect = (soalId: string) => {
    setSelectedSoalIds((prev) =>
      prev.includes(soalId)
        ? prev.filter((id) => id !== soalId)
        : [...prev, soalId]
    );
  };

  const handleTambahKeUjian = () => {
    const selectedSoalData = data
      .filter((item: any) => selectedSoalIds.includes(item.id))
      .map((item: any) => ({
        ...item,
        // soal: JSON.parse(item.soal) // pastikan soal jadi object lagi
      }));

      mutate.mutate({
      soal: [...((soal as string[]) || []), ...selectedSoalIds],
      soals: selectedSoalData,
    } as any , {
      onSuccess : () => {
        setSelectedSoalIds([]);
        setSelectAll(false);
      }
    });
    // Tambahkan API call di sini
  };

  return (
    <div>
      <div
        style={{ height: "calc(100vh - 100px)" }}
        className="container mx-auto py-6  max-w-4xl overflow-y-auto"
      >
        <h1 className=" font-bold text-gray-800 mb-6 flex items-center gap-2">
          📘 Daftar Bank Soal
        </h1>
        <Separator className="mb-4" />

        {/* Pilih Semua */}
        {/* <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={() => setSelectAll(!selectAll)}
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-gray-700 font-medium">Pilih Semua</span>
        </label> */}

        <div className="flex flex-col gap-4">
          {data
            .filter((item: any) => !soal?.includes(item.id))
            .map((item: any) => {
              const soalData = JSON.parse(item.soal);
              const isSelected = selectedSoalIds.includes(item.id);

              return (
                <Card
                  key={item.id}
                  className={`transition-all duration-300 border rounded-xl shadow-md hover:shadow-xl cursor-pointer ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <CardContent className="flex items-start gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(item.id)}
                      className="mt-2 w-5 h-5 accent-blue-600"
                    />

                    {/* Konten Soal */}
                    <div className="flex-1">
                      <CardTitle className="text-sm">
                        <RenderMathHTML html={soalData.pertanyaan} />
                      </CardTitle>

                      {/* <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className="bg-blue-50 text-blue-600 py-1 px-2 rounded-full">
                        {item.mapel?.nama_mapel}
                      </Badge>
                      <Badge className="bg-blue-50 text-blue-600 py-1 px-2 rounded-full">
                        {item.tingkat_kesulitan}
                      </Badge>
                      <Badge className="bg-blue-50 text-blue-600 py-1 px-2 rounded-full">
                        {item.tingkat_sekolah.toUpperCase()}
                      </Badge>
                    </div> */}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
      <div
        style={{
          height: "100px",
        }}
        className="flex justify-between  mt-6 items-start"
      >
        <div className="flex gap-2">
          <Button
          type="button"
            variant="outline"
            // disabled={params.page === 1}
            // onClick={() => handlePage(params.page - 1)}
          >
            ←
          </Button>
          <Button
           type="button"
            variant="outline"
            // disabled={params.page === data.totalPages}
            // onClick={() => handlePage(params.page + 1)}
          >
            →
          </Button>
        </div>

        <Button
         type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          onClick={handleTambahKeUjian}
          disabled={selectedSoalIds.length === 0}
        >
          Tambah ke Ujian ({selectedSoalIds.length})
        </Button>
      </div>
    </div>
  );
}
