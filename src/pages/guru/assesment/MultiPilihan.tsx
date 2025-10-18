import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import TextEditor from "@/components/TextEditor";
import { removePilihan, addPilihan } from "./helper";

export default function MultiPilihan({ values, setValues }: any) {
  const pilihan = values.soal.pilihan || [];
  const jawaban = values.jawaban || [];

  const toggle = (label: string) => {
    const updated = jawaban.includes(label)
      ? jawaban.filter((l: string) => l !== label)
      : [...jawaban, label];

    setValues({
      ...values,
      jawaban: updated,
    });
  };

  const handleTeksChange = (val: string, idx: number) => {
    const updated = [...pilihan];
    updated[idx].teks = val;
    setValues({
      ...values,
      soal: {
        ...values.soal,
        pilihan: updated,
      },
    });
  };

  const handleAddPilihan = () => {
    const updated = addPilihan(values);
    setValues(updated);
  };

  const handleRemovePilihan = (idx: number) => {
    const updated = removePilihan(values, idx);
    setValues(updated);
  };

  return (
    <div className="space-y-4 mt-4">
      <Label>Pilihan Jawaban (Bisa lebih dari satu)</Label>
      {pilihan.map((p: any, idx: number) => (
        <div key={p.id} className="flex gap-2 items-start">
          <Badge
           
            className={`cursor-pointer transition-all duration-200 ${
              jawaban.includes(p.label)
                ? "bg-green-500 hover:bg-green-600 text-white shadow-md"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            } text-base px-4 py-2 rounded-lg`}
            onClick={() => toggle(p.label)}
          >
            {p.label}
          </Badge>
          <TextEditor
            value={p.teks}
            handleChange={(val: string) => handleTeksChange(val, idx)}
          />
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
      <Button className="w-full" variant="ghost"  type="button" onClick={handleAddPilihan}>
        <Plus className="h-4 w-4 mr-2" /> Tambah Pilihan
      </Button>
    </div>
  );
}
