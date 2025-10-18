import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import TextEditor from "@/components/TextEditor";
import { removePilihan, addPilihan } from "./helper";

export default function MultiTrueFalse({ values, setValues }: any) {
  const pilihan = values.soal.pilihan || [];
  const jawaban = values.jawaban || [];

  // ✅ Update jawaban true/false berdasarkan indeks
  const updateJawaban = (idx: number, val: boolean) => {
    const updatedJawaban = [...jawaban];
    updatedJawaban[idx] = val;
    setValues({
      ...values,
      jawaban: updatedJawaban,
    });
  };

  // ✅ Ubah teks pernyataan
  const handleTeksChange = (val: string, idx: number) => {
    const updatedPilihan = [...pilihan];
    updatedPilihan[idx].teks = val;
    setValues({
      ...values,
      soal: {
        ...values.soal,
        pilihan: updatedPilihan,
      },
    });
  };

  // ✅ Tambah atau hapus pernyataan
  const handleAddPilihan = () => {
    const updated = addPilihan(values);
    setValues(updated);
  };

  const handleRemovePilihan = (idx: number) => {
    const updated = removePilihan(values, idx);
    setValues(updated);
  };

  return (
    <div className="space-y-2">
      <Label>Pernyataan True / False</Label>
      {pilihan.map((p: any, idx: number) => (
        <div key={p.id} className="flex gap-2 items-start">
          {/* 🧠 Editor Teks Pernyataan */}
          <TextEditor
            value={p.teks}
            handleChange={(val: string) => handleTeksChange(val, idx)}
          />

          {/* ✅ Pilihan True/False */}
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

          {/* 🗑️ Tombol hapus */}
          <Button
           variant="destructive"
            size="sm"
            type="button"
            onClick={() => handleRemovePilihan(idx)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {/* ➕ Tambah Pernyataan */}
      <Button variant="ghost" type="button" onClick={handleAddPilihan}>
        <Plus className="h-4 w-4 mr-2" /> Tambah Pernyataan
      </Button>
    </div>
  );
}
