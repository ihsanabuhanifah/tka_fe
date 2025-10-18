"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Eye } from "lucide-react"; // Only need Eye icon here
import { useState } from "react";
import { useAddSoaltoUjian, useListBankSoal } from "../service";
import RenderMathHTML from "@/components/RenderMathHTML";
import FilterSoal from "./FilterSoal";

// 🆕 Import Modal Component
import SoalPreviewModal from "./Preview";

/* -----------------------------
   Tipe Data Soal
----------------------------- */
interface SoalItem {
  id: string;
  materi: string;
  point: number;
  tipe: "PG" | "MCMA" | "MTF" | "ES"; // Updated Tipe
  soal: string; // JSON string for question content and options
  pembahasan: string;
  tingkat_kesulitan: string;
  is_public: number;
  nama_guru: string | null;
  tingkat_sekolah: string;
  jawaban: string;
  created_at: string;
  updated_at: string;
}

/* -----------------------------
   Komponen utama
----------------------------- */
interface ListSoalProps {
  mapel_id?: string;
  soal?: string[];
  ujian_id?: string;
}

export default function ListSoal({ mapel_id, soal, ujian_id }: ListSoalProps) {
  const {
    data: rawData,
    isFetching,
    isLoading,
    params,
    setParams,
    handleFilter,
    handleClear,
  } = useListBankSoal(mapel_id as string);

  const mutate = useAddSoaltoUjian(ujian_id as string);
  const [selectedSoalIds, setSelectedSoalIds] = useState<string[]>([]);

  // 🆕 State untuk Modal Preview
  const [previewSoal, setPreviewSoal] = useState<SoalItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter out questions already in the exam
  const data = (rawData as SoalItem[])?.filter(
    (item: SoalItem) => !soal?.includes(item.id)
  );

  // ubah filter state
  const handleChange = (field: string, value: string) => {
    setParams((prev: any) => ({ ...prev, [field]: value }));
  };

  // toggle pilih
  const toggleSelect = (soalId: string) => {
    setSelectedSoalIds((prev) =>
      prev.includes(soalId)
        ? prev.filter((id) => id !== soalId)
        : [...prev, soalId]
    );
  };

  // 🆕 Buka Modal Preview
  const handlePreview = (item: SoalItem) => {
    setPreviewSoal(item);
    setIsModalOpen(true);
  };

  // tambah ke ujian
  const handleTambahKeUjian = () => {
    const selectedSoalData = rawData
      ?.filter((item: SoalItem) => selectedSoalIds.includes(item.id))
      .map((item: SoalItem) => ({
        ...item,
      }));

    mutate.mutate(
      {
        soal: [...((soal as string[]) || []), ...selectedSoalIds],
        soals: selectedSoalData,
      } as any,
      {
        onSuccess: () => {
          setSelectedSoalIds([]);
        },
      }
    );
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center py-20 text-blue-500">
        <Loader2 className="animate-spin mr-2" />
        Memuat data soal...
      </div>
    );
  }

  const getTipeText = (tipe: string) => {
    switch (tipe) {
      case "PG":
        return "Pilihan Ganda";
      case "MCMA":
        return "Multi Pilihan";
      case "MTF":
        return "Multi True/False";
      case "ES":
        return "Essay";
      default:
        return "Lainnya";
    }
  };

  return (
    <div className="h-full ">
      <div
        style={{ height: "calc(100vh - 80px)" }}
        className="container mx-auto h-full   py-6 max-w-5xl overflow-y-auto no-scrollbar"
      >
        {/* 🔍 Filter Soal */}
        <FilterSoal
          filters={params}
          onChange={handleChange}
          onFilter={handleFilter}
          onClear={handleClear}
        />

        <Separator className="mb-4" />

        {/* 📄 List Soal */}
        <div className="flex flex-col gap-4">
          {!data || data.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              Belum ada soal untuk filter ini.
            </div>
          ) : (
            data.map((item: SoalItem) => {
              const soalData = JSON.parse(item.soal);
              const isSelected = selectedSoalIds.includes(item.id);

              return (
                <Card
                  key={item.id}
                  className={`transition-all duration-300 border rounded-xl shadow-md ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <CardContent className="flex items-start gap-4 p-6 transition-colors">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(item.id)}
                      className="mt-2 w-5 h-5 accent-blue-600 cursor-pointer"
                      title="Pilih Soal"
                    />

                    {/* Konten utama */}
                    <div className="flex-1 space-y-3">
                      {/* Header info */}
                      <div className="flex flex-wrap items-center gap-x-6 text-sm text-gray-600">
                        <div>
                          Kesulitan:{" "}
                          <span className="text-gray-800 font-medium">
                            {item.tingkat_kesulitan}
                          </span>
                        </div>
                        <div>
                          Sekolah:{" "}
                          <span className="text-gray-800 font-medium uppercase">
                            {item.tingkat_sekolah}
                          </span>
                        </div>
                        <div>
                          Tipe:{" "}
                          <span className="text-gray-800 font-medium">
                            {getTipeText(item.tipe)}
                          </span>
                        </div>
                        <div>
                          Poin:{" "}
                          <span className="text-gray-800 font-medium">
                            {item.point}
                          </span>
                        </div>
                      </div>
                      <div className="text-gray-600">
                        Materi:{" "}
                        <span className="text-gray-800 font-medium">
                          {item.materi}
                        </span>
                      </div>

                      {/* Pertanyaan */}
                      <div className="text-gray-900 leading-relaxed text-sm border rounded-lg px-3 py-3 bg-gray-50 line-clamp-3">
                        <RenderMathHTML html={soalData.pertanyaan} />
                      </div>

                      {/* Footer & Preview Button */}
                      <div className="flex justify-between items-center pt-2">
                        <div className="text-xs text-gray-500">
                          Pembuat:{" "}
                          <span className="font-medium text-gray-700">
                            {item.nama_guru || "Ihsan Santana Wibawa"}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreview(item)}
                          className="flex items-center gap-1 text-xs text-blue-600 border-blue-500 hover:bg-blue-50"
                          title="Lihat Detail Soal"
                        >
                          <Eye className="h-4 w-4" />
                          Lihat Detail
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* 📦 FOOTER - Pagination + Tombol Tambah */}

      {/* 🆕 Soal Preview Modal */}
      <SoalPreviewModal
        soal={previewSoal}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
      <div className="h-[80px] relative">
        <div className="absolute bottom-0 left-0 right-0   p-4 shadow-lg flex justify-between items-center z-10">
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              ← Sebelumnya
            </Button>
            <Button variant="outline" disabled>
              Selanjutnya →
            </Button>
          </div>

          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 font-semibold transition duration-200"
            onClick={handleTambahKeUjian}
            disabled={selectedSoalIds.length === 0 || mutate.isPending}
          >
            {mutate.isPending && (
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
            )}
            {mutate.isPending
              ? "Memproses..."
              : `Tambah ke Ujian (${selectedSoalIds.length})`}
          </Button>
        </div>
      </div>
    </div>
  );
}
