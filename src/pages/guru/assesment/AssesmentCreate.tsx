"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import DateField from "@/pages/guru/components/DateField";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { mapelOptions } from "@/service/data";

import { useCreateUjian } from "./service";

export default function AssessmentBuilderModal({
    open, setOpen
} : {
    open : boolean,
    setOpen : React.Dispatch<React.SetStateAction<boolean>>;
}) {
  
  const createUjian = useCreateUjian();

  const formik = useFormik({
    initialValues: {
      nama_ujian: "",
      deskripsi: "",
      tanggal_mulai: null as Date | null,
      tanggal_selesai: null as Date | null,
      durasi_menit: 60,
      mapel_id: "",
    },
    validationSchema: Yup.object({
      nama_ujian: Yup.string().required("Nama ujian wajib diisi"),
      deskripsi: Yup.string().nullable(),
      tanggal_mulai: Yup.date().required("Tanggal mulai wajib diisi"),
      tanggal_selesai: Yup.date()
        .required("Tanggal selesai wajib diisi")
        .min(
          Yup.ref("tanggal_mulai"),
          "Tanggal selesai tidak boleh lebih awal"
        ),
      durasi_menit: Yup.number()
        .min(1, "Durasi minimal 1 menit")
        .required("Durasi wajib diisi"),
      mapel_id: Yup.string().required("Mapel wajib dipilih"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await createUjian.mutateAsync(values);
        resetForm();
        setOpen(false);
      } catch (error) {
        console.error("Gagal membuat ujian:", error);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>🧾 Form Pembuatan Ujian</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Nama Ujian */}
          <div className="space-y-2">
            <Label>Nama Ujian</Label>
            <Input
              name="nama_ujian"
              placeholder="Masukkan nama ujian"
              value={formik.values.nama_ujian}
              onChange={formik.handleChange}
            />
            {formik.touched.nama_ujian && formik.errors.nama_ujian && (
              <p className="text-red-500 text-sm">{formik.errors.nama_ujian}</p>
            )}
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Input
              name="deskripsi"
              placeholder="Masukkan deskripsi singkat"
              value={formik.values.deskripsi}
              onChange={formik.handleChange}
            />
          </div>

          {/* Mapel */}
          <div className="space-y-2">
            <Label>Mata Pelajaran</Label>
            <Select
              value={formik.values.mapel_id}
              onValueChange={(v) => {
                console.log("v", v);
                const nama_mapel = mapelOptions.find(
                  (m) => m?.value?.toString() === v
                );

                console.log("nama_mapel", nama_mapel);
                formik.setFieldValue("mapel_id", v);
                formik.setFieldValue(
                  "nama_mapel",
                  nama_mapel ? nama_mapel.label : ""
                );
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Mapel" />
              </SelectTrigger>
              <SelectContent>
                {mapelOptions.map((m) => (
                  <SelectItem key={m.value} value={m.value.toString()}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.mapel_id && formik.errors.mapel_id && (
              <p className="text-red-500 text-sm">{formik.errors.mapel_id}</p>
            )}
          </div>

          {/* Tanggal Mulai & Selesai */}
          <div className="grid grid-cols-2 gap-3 space-y-2">
            <DateField
              label="Tanggal Mulai"
              value={formik.values.tanggal_mulai}
              onChange={(date) => formik.setFieldValue("tanggal_mulai", date)}
            />
            <DateField
              label="Tanggal Selesai"
              value={formik.values.tanggal_selesai}
              onChange={(date) => formik.setFieldValue("tanggal_selesai", date)}
            />
          </div>
          {(formik.errors.tanggal_mulai || formik.errors.tanggal_selesai) && (
            <p className="text-red-500 text-sm">
              {formik.errors.tanggal_mulai || formik.errors.tanggal_selesai}
            </p>
          )}

          {/* Durasi */}
          <div className="space-y-2">
            <Label>Durasi (menit)</Label>
            <Input
              type="number"
              name="durasi_menit"
              value={formik.values.durasi_menit}
              onChange={formik.handleChange}
            />
            {formik.touched.durasi_menit && formik.errors.durasi_menit && (
              <p className="text-red-500 text-sm">
                {formik.errors.durasi_menit}
              </p>
            )}
          </div>

          {/* Published */}

          <Button
            type="submit"
            className="w-full mt-4"
            disabled={createUjian.isPending}
          >
            {createUjian.isPending ? "⏳ Menyimpan..." : "💾 Simpan Ujian"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
