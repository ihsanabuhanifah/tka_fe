"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import TextEditor from "@/components/TextEditor";
import axiosClient from "@/service/axios";
import { useState } from "react";

/* =====================
   ✅ Yup Schema
===================== */
const soalSchema = Yup.object().shape({
  materi: Yup.string().required("Wajib diisi"),
  mapel_id: Yup.string().required("Wajib dipilih"),
  point: Yup.number().required("Wajib diisi").min(1),
  tipe: Yup.string().required("Wajib dipilih"),
  soal: Yup.object().shape({
    pertanyaan: Yup.string().required("Wajib diisi"),
    pilihan: Yup.array().of(
      Yup.object().shape({
        id: Yup.string().required(),
        label: Yup.string().required(),
        teks: Yup.string().required(),
      })
    ),
  }),
  jawaban: Yup.mixed().test("jawaban-required", "Wajib diisi", function (value) {
    const { tipe } = this.parent;
    if (tipe === "ES") return true;
    if (tipe === "PG" && !value) return false;
    if (tipe === "MCMA" && (!Array.isArray(value) || value.length === 0))
      return false;
    if (tipe === "MTF" && (!Array.isArray(value) || value.length === 0))
      return false;
    return true;
  }),
});

/* =====================
   ✅ Options
===================== */
const tipeSoalOptions = [
  { value: "PG", text: "Pilihan Ganda" },
  { value: "MCMA", text: "Multi Pilihan" },
  { value: "MTF", text: "Multi True/False" },
  { value: "ES", text: "Essay" },
];

const mapelOptions = [
  { value: "matematika", label: "Matematika" },
  { value: "bahasa_indonesia", label: "Bahasa Indonesia" },
  { value: "ipa", label: "IPA" },
  { value: "ips", label: "IPS" },
];

const pointOptions = [
  { value: 1, label: "1 Point" },
  { value: 2, label: "2 Point" },
  { value: 3, label: "3 Point" },
  { value: 5, label: "5 Point" },
];

type Pilihan = {
  id: string;
  label: string;
  teks: string;
};

type SoalFormValues = {
  materi: string;
  mapel_id: string;
  point: number;
  tipe: string;
  soal: {
    pertanyaan: string;
    pilihan: Pilihan[];
  };
  jawaban: string | string[] | boolean[];
};

export default function QuestionBuilderSingle() {
  const [loading, setLoading] = useState(false);

  const formik = useFormik<SoalFormValues>({
    initialValues: {
      materi: "",
      mapel_id: "",
      point: 1,
      tipe: "PG",
      soal: {
        pertanyaan: "",
        pilihan: [
          { id: generateId(), label: "A", teks: "" },
          { id: generateId(), label: "B", teks: "" },
        ],
      },
      jawaban: "",
    },
    validationSchema: soalSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const payload = {
          ...values,
        };

        await axiosClient.post("/bank-soal/create", payload);
        alert("✅ Soal berhasil disimpan!");
      } catch (err) {
        console.error(err);
        alert("❌ Gagal menyimpan soal");
      } finally {
        setLoading(false);
      }
    },
  });

  function generateId() {
    return Math.random().toString(36).substring(2, 9);
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>🧠 Buat Soal Baru</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <Label>Materi</Label>
              <textarea
                className="w-full border rounded-md p-2 text-sm"
                value={formik.values.materi}
                onChange={(e) =>
                  formik.setFieldValue("materi", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <SelectField
                label="Mapel"
                value={formik.values.mapel_id}
                options={mapelOptions}
                onChange={(v:string) => formik.setFieldValue("mapel_id", v)}
              />

              <SelectField
                label="Point"
                value={formik.values.point.toString()}
                options={pointOptions}
                onChange={(v:string) => formik.setFieldValue("point", parseInt(v))}
              />

              <SelectField
                label="Tipe Soal"
                value={formik.values.tipe}
                options={tipeSoalOptions}
                onChange={(v:string) => handleTipeChange(formik, v)}
              />
            </div>

            <div>
              <Label>Pertanyaan</Label>
              <TextEditor
                value={formik.values.soal.pertanyaan}
                handleChange={(val: string) =>
                  formik.setFieldValue("soal.pertanyaan", val)
                }
              />
            </div>

            {/* render jenis soal */}
            {formik.values.tipe === "PG" && <PilihanGanda formik={formik} />}
            {formik.values.tipe === "MCMA" && <MultiPilihan formik={formik} />}
            {formik.values.tipe === "MTF" && <MultiTrueFalse formik={formik} />}
            {formik.values.tipe === "ES" && (
              <p className="text-sm text-muted-foreground italic">
                Essay tidak membutuhkan jawaban otomatis.
              </p>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "💾 Simpan Soal"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/* =====================
   Reusable Components
===================== */
function SelectField({ label, value, options, onChange }: any) {
  return (
    <div className="space-y-1 w-full">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Pilih ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o: any) => (
            <SelectItem key={o.value} value={o.value.toString()}>
              {o.label || o.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function handleTipeChange(formik: any, tipe: string) {
  const base: { pertanyaan: string; pilihan: Pilihan[] } = { pertanyaan: "", pilihan: [] };
  if (tipe === "PG" || tipe === "MCMA") {
    base.pilihan = [
      { id: generateId(), label: "A", teks: "" },
      { id: generateId(), label: "B", teks: "" },
    ];
  } else if (tipe === "MTF") {
    base.pilihan = [{ id: generateId(), label: "1", teks: "" }];
  }
  formik.setValues({
    ...formik.values,
    tipe,
    soal: base,
    jawaban: tipe === "ES" ? "" : tipe === "PG" ? "" : [],
  });
}
function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

/* =====================
   Komponen PG / MCMA / MTF
===================== */
function PilihanGanda({ formik }: any) {
  const pilihan = formik.values.soal.pilihan;
  return (
    <div className="space-y-2">
      <Label>Pilihan Jawaban</Label>
      {pilihan.map((p: any, idx: number) => (
        <div key={p.id} className="flex gap-2 items-start">
          <Badge variant="secondary">{p.label}</Badge>
          <TextEditor
            value={p.teks}
            handleChange={(val: string) =>
              formik.setFieldValue(`soal.pilihan.${idx}.teks`, val)
            }
          />
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => removePilihan(formik, idx)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" type="button" onClick={() => addPilihan(formik)}>
        <Plus className="h-4 w-4 mr-2" /> Tambah Pilihan
      </Button>
      <Label>Jawaban Benar</Label>
      <Select
        value={formik.values.jawaban}
        onValueChange={(v) => formik.setFieldValue("jawaban", v)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Pilih jawaban benar" />
        </SelectTrigger>
        <SelectContent>
          {pilihan.map((p: any) => (
            <SelectItem key={p.label} value={p.label}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function MultiPilihan({ formik }: any) {
  const pilihan = formik.values.soal.pilihan;
  const jawaban = formik.values.jawaban || [];
  const toggle = (label: string) => {
    const updated = jawaban.includes(label)
      ? jawaban.filter((l: string) => l !== label)
      : [...jawaban, label];
    formik.setFieldValue("jawaban", updated);
  };
  return (
    <div className="space-y-2">
      <Label>Pilihan Jawaban (Bisa lebih dari satu)</Label>
      {pilihan.map((p: any, idx: number) => (
        <div key={p.id} className="flex gap-2 items-start">
          <Badge
            variant={jawaban.includes(p.label) ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => toggle(p.label)}
          >
            {p.label}
          </Badge>
          <TextEditor
            value={p.teks}
            handleChange={(val: string) =>
              formik.setFieldValue(`soal.pilihan.${idx}.teks`, val)
            }
          />
        </div>
      ))}
      <Button variant="outline" onClick={() => addPilihan(formik)}>
        <Plus className="h-4 w-4 mr-2" /> Tambah Pilihan
      </Button>
    </div>
  );
}

function MultiTrueFalse({ formik }: any) {
  const pilihan = formik.values.soal.pilihan;
  const jawaban = formik.values.jawaban || [];
  const update = (idx: number, val: boolean) => {
    const updated = [...jawaban];
    updated[idx] = val;
    formik.setFieldValue("jawaban", updated);
  };
  return (
    <div className="space-y-2">
      <Label>Pernyataan True/False</Label>
      {pilihan.map((p: any, idx: number) => (
        <div key={p.id} className="flex gap-2 items-start">
          <TextEditor
            value={p.teks}
            handleChange={(val: string) =>
              formik.setFieldValue(`soal.pilihan.${idx}.teks`, val)
            }
          />
          <Select
            value={jawaban[idx]?.toString() ?? ""}
            onValueChange={(v) => update(idx, v === "true")}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Jawaban" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Benar</SelectItem>
              <SelectItem value="false">Salah</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => removePilihan(formik, idx)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={() => addPilihan(formik)}>
        <Plus className="h-4 w-4 mr-2" /> Tambah Pernyataan
      </Button>
    </div>
  );
}

/* =====================
   Helpers
===================== */
function addPilihan(formik: any) {
  const q = formik.values.soal.pilihan;
  const nextLabel = String.fromCharCode(65 + q.length);
  const newP = { id: generateId(), label: nextLabel, teks: "" };
  formik.setFieldValue("soal.pilihan", [...q, newP]);
}
function removePilihan(formik: any, idx: number) {
  const q = formik.values.soal.pilihan.filter((_: any, i: number) => i !== idx);
  formik.setFieldValue("soal.pilihan", q);
}
