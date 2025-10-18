"use client";

import { Label } from "@/components/ui/label";

import SelectField from "@/components/SelectField";
import {
  tingkatKesulitanOptions,
  tingkatSekolahOptions,
  publikOptions,
} from "./helper";
import { mapelOptions, pointOptions, tipeSoalOptions } from "@/service/data";

export default function QuestionMetaFields({
  values,
  handleChange,
  errors,
  handleTipeChange,
  setValues,
}: any) {
  return (
    <div className="space-y-4 mt-4 border-t pt-4">
      <div className="space-y-2 mb-2">
        <Label>Materi</Label>
        <textarea
          className="w-full border rounded-md p-2 text-sm"
          value={values.materi}
          onChange={(e) => handleChange("materi", e.target.value)}
        />
        {errors.materi && (
          <p className="text-red-500 text-xs">{errors.materi}</p>
        )}
      </div>

      {/* SELECTS */}
      <div className="grid grid-cols-3 w-full gap-4 ">
        <SelectField
        disabled
          label="Mapel"
          value={values.mapel_id}
          options={mapelOptions}
          onChange={(v: string) => handleChange("mapel_id", v)}
        />

        <SelectField
          label="Point"
          value={values.point}
          options={pointOptions}
          onChange={(v: string) => handleChange("point", parseInt(v))}
        />

        <SelectField
          label="Tipe Soal"
          value={values.tipe}
          options={tipeSoalOptions}
          onChange={(v: string) => {
            const updated = handleTipeChange(values, v);
            setValues(updated);
          }}
        />
      </div>
      {/* Tingkat Kesulitan / Sekolah / Publik */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SelectField
          label="Tingkat Kesulitan"
          value={values.tingkat_kesulitan}
          options={tingkatKesulitanOptions}
          onChange={(v: string) => handleChange("tingkat_kesulitan", v)}
        />

        <SelectField
          label="Tingkat Sekolah"
          value={values.tingkat_sekolah}
          options={tingkatSekolahOptions}
          onChange={(v: string) => handleChange("tingkat_sekolah", v)}
        />

        <SelectField
          label="Akses Soal"
          value={values.is_public?.toString() ?? "0"}
          options={publikOptions.map((opt) => ({
            ...opt,
            value: opt.value.toString(),
          }))}
          onChange={(v: string) => handleChange("is_public", parseInt(v))}
        />
      </div>

      {/* Toggle Pembahasan */}
    </div>
  );
}
