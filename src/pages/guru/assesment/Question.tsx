"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TextEditor from "@/components/TextEditor";
import PilihanGanda from "./PilihanGanda";
import MultiPilihan from "./MultiPilihan";
import MultiTrueFalse from "./MultiTrueFalse";
import { handleTipeChange, generateId } from "./helper";
import { useCreateBankSoal, useUpdateBankSoal } from "./service";
import QuestionMetaFields from "./QuestionMetaField";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/* =====================
   ✅ Type Definition
===================== */
type Pilihan = {
  id: string;
  label: string;
  teks: string;
};

export type SoalFormValues = {
  id?: string;
  ujian_id?: string;
  banksoal?: string[];
  materi: string;
  mapel_id: string;
  point: number;
  tingkat_kesulitan: string;
  tingkat_sekolah: string;
  pembahasan: string;
  is_public: number;

  tipe: string;
  soal: {
    pertanyaan: string;
    pilihan: Pilihan[];
  };
  jawaban: string | string[] | boolean[];
};

/* =====================
   ✅ Component
===================== */
export default function QuestionBuilderSingle({
  banksoal,
  ujian_id,
  mapel_id,
  id,
  index,
  existing,
  containerRef
}: {
  banksoal: string[];
  ujian_id: string;
  mapel_id: string;
  id?: string;
  index?: number;
  existing?: SoalFormValues;
  containerRef ? :any
}) {
  const [showPembahasan, setShowPembahasan] = useState(false);

  const updateSoal = useUpdateBankSoal(ujian_id);
  const createSoal = useCreateBankSoal(ujian_id);
  const [values, setValues] = useState<SoalFormValues>({
    ujian_id: ujian_id,
    materi: existing ? existing.materi : "",
    mapel_id: mapel_id ?? "",
    point: existing ? existing.point : 5,
    tipe: existing ? existing.tipe : "PG",
    tingkat_kesulitan: existing ? existing.tingkat_kesulitan : "mudah",
    tingkat_sekolah: existing ? existing.tingkat_sekolah : "sma",
    pembahasan: existing ? existing.pembahasan : "",
    is_public: existing ? existing.is_public : 0,
    soal: {
      pertanyaan: existing ? existing.soal.pertanyaan : "",
      pilihan: existing
        ? existing.soal.pilihan
        : [
            { id: generateId(), label: "A", teks: "" },
            { id: generateId(), label: "B", teks: "" },
          ],
    },
    jawaban: existing ? JSON.parse(existing.jawaban as string) : "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* =====================
     ✅ Handler Functions
  ===================== */

  const handleChange = (field: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSoalChange = (path: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      soal: {
        ...prev.soal,
        [path]: value,
      },
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!values.materi) newErrors.materi = "Materi wajib diisi";
    if (!values.mapel_id) newErrors.mapel_id = "Mapel wajib dipilih";
    if (!values.soal.pertanyaan)
      newErrors.pertanyaan = "Pertanyaan wajib diisi";

    if (values.tipe === "PG" && !values.jawaban)
      newErrors.jawaban = "Jawaban wajib diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return alert("❌ Ada field yang belum valid!");

    try {
      if (id) {
        updateSoal.mutate({
          ...values,
          id,
        });
      } else {
        createSoal.mutate(
          {
            ...values,
            ujian_id: ujian_id,
            banksoal: banksoal?.map((n : any) => n.id) || [],
          },
          {
            onError: () => {
              alert("✅ Soal berhasil disimpan!");
              // Reset jika mau
            },
            onSuccess: () => {
              setValues({
                ...values,
                materi: "",
                mapel_id: mapel_id ?? "",
                point: 5,
                tipe: "PG",
                soal: {
                  pertanyaan: "",
                  pilihan: [
                    { id: generateId(), label: "A", teks: "" },
                    { id: generateId(), label: "B", teks: "" },
                  ],
                },
                jawaban: "",
              });
              setErrors({});
               if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
            },
          }
        );
      }
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menyimpan soal");
    } finally {
    }
  };

  /* =====================
     ✅ Render
  ===================== */

  return (
    <div className="p-6 ">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>
            🧠{" "}
            {!id
              ? "Buat Soal Baru"
              : `Ubah Soal Nomor ${index ? index + 1 : 1}`}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* MATERI */}

          <QuestionMetaFields
            values={values}
            handleChange={handleChange}
            errors={errors}
            handleTipeChange={handleTipeChange}
            setValues={setValues}
          />

          {/* PERTANYAAN */}
          <div className="space-y-2 mt-2">
            <Label>Pertanyaan</Label>

           
            <TextEditor
              value={values.soal.pertanyaan}
              handleChange={(val: string) =>
                handleSoalChange("pertanyaan", val)
              }
            />
            {errors.pertanyaan && (
              <p className="text-red-500 text-xs">{errors.pertanyaan}</p>
            )}
          </div>

          {/* JENIS SOAL */}
          {values.tipe === "PG" && (
            <PilihanGanda values={values} setValues={setValues} />
          )}
          {values.tipe === "MCMA" && (
            <MultiPilihan values={values} setValues={setValues} />
          )}
          {values.tipe === "MTF" && (
            <MultiTrueFalse values={values} setValues={setValues} />
          )}
          {values.tipe === "ES" && (
            <p className="text-sm text-muted-foreground italic">
              Essay tidak membutuhkan jawaban otomatis.
            </p>
          )}

          <div className="flex items-center justify-between mt-2">
            <Label>Pembahasan</Label>
            <div className="flex items-center gap-2">
              <Switch
                checked={showPembahasan}
                onCheckedChange={(v) => setShowPembahasan(v)}
              />
              <span className="text-sm text-muted-foreground">
                {showPembahasan ? "Sembunyikan" : "Tampilkan"}
              </span>
            </div>
          </div>

          {/* TextEditor Pembahasan */}
          <div
            className={cn(
              "transition-all overflow-hidden",
              showPembahasan
                ? "max-h-[1000px] mt-2 opacity-100"
                : "max-h-0 opacity-0"
            )}
          >
            <TextEditor
              value={values.pembahasan}
              handleChange={(v: string) => handleChange("pembahasan", v)}
            />
          </div>

          <Button
            className="w-full mt-6 py-3 bg-blue-400 hover:bg-blue-500 text-white rounded-lg font-semibold shadow-md transition-all"
            onClick={handleSubmit}
            variant={"secondary"}
            type="button"
            disabled={updateSoal.isPending || createSoal.isPending}
          >
            {updateSoal.isPending || createSoal.isPending
              ? "Menyimpan..."
              : id
              ? "💾 Perbaharui Soal"
              : "💾 Simpan Soal"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
