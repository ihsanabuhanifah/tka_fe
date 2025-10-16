"use client";

import { FormikProvider, useFormik } from "formik";
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
import { Plus, Trash2, Copy } from "lucide-react";
import TextEditor from "@/components/TextEditor";


/* =====================
   ✅ Yup Validation Schema
===================== */
const soalSchema = Yup.object().shape({
  id: Yup.string().required(),
  materi: Yup.string().required("Wajib diisi"),
  mapel_id: Yup.string().required("Wajib dipilih"),
  point: Yup.number().required("Wajib diisi").min(1),
  tipe: Yup.string().required("Wajib dipilih"),
  soal: Yup.object().shape({
    pertanyaan: Yup.string().required("Wajib diisi"),
    pilihan: Yup.array().of(
      Yup.object().shape({
        id: Yup.string().required("wajib diisi"),
        label: Yup.string().required("wajib diisi"),
        teks: Yup.string().required("wajib diisi"),
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

const soalsSchemaArray = Yup.object().shape({
  questions: Yup.array().of(soalSchema).min(1, "Minimal 1 soal"),
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

/* =====================
   ✅ Main Component
===================== */
export default function QuestionListBuilder() {
  type PilihanType = { id: string; label: string; teks: string };
  type SoalType = {
    pertanyaan: string;
    pilihan: PilihanType[];
  };
  type QuestionType = {
    id: string;
    materi: string;
    mapel_id: string;
    point: number;
    tipe: string;
    soal: SoalType;
    jawaban: any;
  };

  const formik = useFormik<{
    questions: QuestionType[];
  }>({
    initialValues: {
      questions: [
        {
          id: generateId(),
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
      ],
    },
    validationSchema: soalsSchemaArray,
    onSubmit: (values) => {
      console.log("Submitted:", values);
      alert("✅ Soal berhasil disimpan!");
    },
  });

  function generateId() {
    return Math.random().toString(36).substring(2, 9);
  }

  const addQuestion = () => {
    const newQuestion = {
      id: generateId(),
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
    };
    
    formik.setFieldValue("questions", [...formik.values.questions, newQuestion]);
  };

  const duplicateQuestion = (index: number) => {
    const q = formik.values.questions[index];
    const copy = {
      ...q,
      id: generateId(),
      soal: {
        ...q.soal,
        pilihan: q.soal.pilihan?.map((p: any) => ({ ...p, id: generateId() })) ?? [],
      },
    };
    const updated = [...formik.values.questions];
    updated.splice(index + 1, 0, copy);
    formik.setFieldValue("questions", updated);
  };

  const deleteQuestion = (index: number) => {
    if (formik.values.questions.length === 1)
      return alert("Minimal 1 soal wajib ada!");
    const filtered = formik.values.questions.filter((_, i) => i !== index);
    formik.setFieldValue("questions", filtered);
  };


  console.log("error", formik.errors)
  console.log("pauy", formik.values)
  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-sm border-border/40">
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-lg font-semibold text-primary">
            🧠 Pembuat Soal Ujian
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit} className="space-y-1">
              {formik.values.questions.map((q, i) => (
                <Card
                  key={q.id}
                  className="border border-border/40 shadow-sm p-5"
                >
                  {/* Header Soal */}
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-base">
                      <span className="text-muted-foreground">Soal</span> {i + 1}
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        onClick={() => duplicateQuestion(i)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => deleteQuestion(i)}
                        disabled={formik.values.questions.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Materi */}
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Materi</Label>
                    <textarea
                      className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary/40"
                      value={q.materi}
                      onChange={(e: any) =>
                        formik.setFieldValue(
                          `questions.${i}.materi`,
                          e.target.value
                        )
                      }
                      placeholder="Tulis materi singkat di sini..."
                    />
                  </div>

                  {/* Mapel + Point + Tipe */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <SelectField
                      label="Mata Pelajaran"
                      value={q.mapel_id}
                      options={mapelOptions}
                      onChange={(v:any) =>
                        formik.setFieldValue(`questions.${i}.mapel_id`, v)
                      }
                    />

                    <SelectField
                      label="Point"
                      value={q.point.toString()}
                      options={pointOptions}
                      onChange={(v:any) =>
                        formik.setFieldValue(
                          `questions.${i}.point`,
                          parseInt(v)
                        )
                      }
                    />

                    <SelectField
                      label="Tipe Soal"
                      value={q.tipe}
                      options={tipeSoalOptions}
                      onChange={(v:any) => handleTipeSoalChange(formik, i, v)}
                    />
                  </div>

                  {/* Pertanyaan */}
                  <div className="space-y-2">
                    <Label>Pertanyaan</Label>
                    {/* <div className="border rounded-md p-3 bg-muted/30">
                      <RenderMathHTML html={q.soal.pertanyaan} />
                    </div> */}
                    <TextEditor
                      value={q.soal.pertanyaan}
                      handleChange={(val: string) =>
                        formik.setFieldValue(
                          `questions.${i}.soal.pertanyaan`,
                          val
                        )
                      }
                    />
                  </div>

                  {/* Jenis Konten Berdasarkan Tipe */}
                  {q.tipe === "PG" && <PilihanGanda i={i} formik={formik} />}
                  {q.tipe === "MCMA" && <MultiPilihan i={i} formik={formik} />}
                  {q.tipe === "MTF" && <MultiTrueFalse i={i} formik={formik} />}
                  {q.tipe === "ES" && (
                    <p className="text-muted-foreground text-sm italic">
                      Soal essay tidak memerlukan jawaban otomatis.
                    </p>
                  )}
                </Card>
              ))}

              <div className="flex justify-between items-center">
                <Button type="button" onClick={addQuestion} variant="outline">
                  <Plus className="h-4 w-4 mr-2" /> Tambah Soal
                </Button>
                <Button type="submit" size="lg">
                  💾 Simpan Semua Soal
                </Button>
              </div>
            </form>
          </FormikProvider>
        </CardContent>
      </Card>
    </div>
  );
}

/* =====================
   ✅ Small Reusable Components
===================== */
function SelectField({ label, value, options, onChange }: any) {
  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Pilih ${label.toLowerCase()}`} />
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


/* =====================
   ✅ Handle Tipe Soal
===================== */
function handleTipeSoalChange(formik: any, index: number, tipe: string) {
  const q = formik.values.questions[index];
  let newJawaban: any = "";
  if (tipe === "MCMA" || tipe === "MTF") newJawaban = [];

  type PilihanType = { id: string; label: string; teks: string };
  const base: { pertanyaan: string; pilihan: PilihanType[] } = {
    pertanyaan: q.soal.pertanyaan,
    pilihan: [],
  };

  if (tipe === "PG" || tipe === "MCMA") {
    base.pilihan = [
      { id: Math.random().toString(36).substring(2, 9), label: "A", teks: "" },
      { id: Math.random().toString(36).substring(2, 9), label: "B", teks: "" },
    ];
  } else if (tipe === "MTF") {
    base.pilihan = [
      { id: Math.random().toString(36).substring(2, 9), label: "1", teks: "" },
    ];
  }

  formik.setFieldValue(`questions.${index}`, {
    ...q,
    tipe,
    soal: base,
    jawaban: newJawaban,
  });
}

/* =====================
   ✅ Komponen Pilihan Ganda
===================== */
function PilihanGanda({ i, formik }: any) {
  const pilihan = formik.values.questions[i].soal.pilihan;
  return (
    <div className="space-y-2">
      <Label>Pilihan Jawaban</Label>
      {pilihan.map((p: any, idx: number) => (
        <div key={p.id} className="flex items-center gap-2">
          <Badge variant="secondary">{p.label}</Badge>
          <TextEditor
            value={p.teks}
            handleChange={(val: string) =>
              formik.setFieldValue(`questions.${i}.soal.pilihan.${idx}.teks`, val)
            }
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => removePilihan(formik, i, idx)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => addPilihan(formik, i)}>
        <Plus className="h-4 w-4 mr-2" /> Tambah Pilihan
      </Button>
      <Label>Jawaban Benar</Label>
      <Select
        value={formik.values.questions[i].jawaban}
        onValueChange={(v) => formik.setFieldValue(`questions.${i}.jawaban`, v)}
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

/* =====================
   ✅ Multi Pilihan
===================== */
function MultiPilihan({ i, formik }: any) {
  const pilihan = formik.values.questions[i].soal.pilihan;
  const jawaban = formik.values.questions[i].jawaban || [];

  const toggle = (label: string) => {
    const updated = jawaban.includes(label)
      ? jawaban.filter((l: string) => l !== label)
      : [...jawaban, label];
    formik.setFieldValue(`questions.${i}.jawaban`, updated);
  };

  return (
    <div className="space-y-2">
      <Label>Pilihan Jawaban (Bisa lebih dari satu)</Label>
      {pilihan.map((p: any, idx: number) => (
        <div key={p.id} className="flex items-center gap-2">
          <Badge
            onClick={() => toggle(p.label)}
            variant={jawaban.includes(p.label) ? "default" : "secondary"}
            className="cursor-pointer"
          >
            {p.label}
          </Badge>
          <TextEditor
            value={p.teks}
            handleChange={(val: string) =>
              formik.setFieldValue(`questions.${i}.soal.pilihan.${idx}.teks`, val)
            }
          />
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => addPilihan(formik, i)}>
        <Plus className="h-4 w-4 mr-2" /> Tambah Pilihan
      </Button>
    </div>
  );
}

/* =====================
   ✅ Multi True False
===================== */
function MultiTrueFalse({ i, formik }: any) {
  const pilihan = formik.values.questions[i].soal.pilihan;
  const jawaban = formik.values.questions[i].jawaban || [];

  const updateJawaban = (idx: number, val: boolean) => {
    const updated = [...jawaban];
    updated[idx] = val;
    formik.setFieldValue(`questions.${i}.jawaban`, updated);
  };

  return (
    <div className="space-y-2">
      <Label>Pernyataan True/False</Label>
      {pilihan.map((p: any, idx: number) => (
        <div key={p.id} className="flex items-center gap-2">
          <TextEditor
            value={p.teks}
            handleChange={(val: string) =>
              formik.setFieldValue(`questions.${i}.soal.pilihan.${idx}.teks`, val)
            }
          />
          <Select
            value={jawaban[idx]?.toString() ?? ""}
            onValueChange={(v) => updateJawaban(idx, v === "true")}
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
            type="button"
            variant="outline"
            size="sm"
            onClick={() => removePilihan(formik, i, idx)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => addPilihan(formik, i)}>
        <Plus className="h-4 w-4 mr-2" /> Tambah Pernyataan
      </Button>
    </div>
  );
}

/* =====================
   ✅ Helper Tambah/Hapus Pilihan
===================== */
function addPilihan(formik: any, i: number) {
  const q = formik.values.questions[i];
  const nextLabel = String.fromCharCode(65 + q.soal.pilihan.length); // A, B, C...
  const newP = { id: Math.random().toString(36).substring(2, 9), label: nextLabel, teks: "" };
  formik.setFieldValue(`questions.${i}.soal.pilihan`, [...q.soal.pilihan, newP]);
}

function removePilihan(formik: any, i: number, idx: number) {
  const q = formik.values.questions[i];
  const updated = q.soal.pilihan.filter((_: any, j: number) => j !== idx);
  formik.setFieldValue(`questions.${i}.soal.pilihan`, updated);
}
