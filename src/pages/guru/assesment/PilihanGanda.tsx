"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { generateId } from "./helper";

export default function PilihanGanda({
  values,
  setValues,
}: {
  values: any;
  setValues: React.Dispatch<React.SetStateAction<any>>;
}) {
  const pilihan = values.soal.pilihan;
  const jawaban = values.jawaban;

  const addPilihan = () => {
    const nextLabel = String.fromCharCode(65 + pilihan.length); // A,B,C,...
    setValues((prev: { soal: { pilihan: any } }) => ({
      ...prev,
      soal: {
        ...prev.soal,
        pilihan: [
          ...prev.soal.pilihan,
          { id: generateId(), label: nextLabel, teks: "" },
        ],
      },
    }));
  };

  const removePilihan = (idx: number) => {
    const updated = pilihan.filter((_: any, i: number) => i !== idx);
    const removedLabel = pilihan[idx].label;
    setValues((prev: { soal: any; jawaban: any }) => ({
      ...prev,
      soal: { ...prev.soal, pilihan: updated },
      jawaban: prev.jawaban === removedLabel ? "" : prev.jawaban,
    }));
  };

  const handleTeksChange = (idx: number, val: string) => {
    const updated = [...pilihan];
    updated[idx].teks = val;
    setValues((prev: any) => ({
      ...prev,
      soal: { ...prev.soal, pilihan: updated },
    }));
  };

  return (
    <div className="space-y-4 mt-4">
      <Label>Pilihan Jawaban</Label>
      {pilihan.map((p: any, idx: number) => (
        <div key={p.id} className="flex gap-2 items-start">
          <Badge
            onClick={() => {
              setValues((prev: any) => ({
                ...prev,
                jawaban: p.label,
              }));
            }}
            className={`cursor-pointer transition-all duration-200 ${
              jawaban.includes(p.label)
                ? "bg-green-500 hover:bg-green-600 text-white shadow-md"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            } text-base px-4 py-2 rounded-full`}
          >
            {p.label}
          </Badge>
          <div className="flex-1">
            <TextEditor
              value={p.teks}
              handleChange={(val) => handleTeksChange(idx, val)}
            />
          </div>
          <Button
            variant="destructive"
            size="icon"
            type="button"
            onClick={() => removePilihan(idx)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button
        className="w-full"
        variant="ghost"
        type="button"
        onClick={addPilihan}
      >
        <Plus className="h-4 w-4 mr-2" /> Tambah Pilihan
      </Button>
    </div>
  );
}
