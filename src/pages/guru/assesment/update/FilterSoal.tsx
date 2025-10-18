import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SelectField from "@/components/SelectField";
import { tingkatKesulitanOptions, tingkatSekolahOptions } from "../helper";
import { tipeSoalOptions } from "@/service/data";

export default function FilterSoal({
  filters,
  onChange,
  onFilter,
  onClear,
}: any) {
  return (
    <Card className="mb-6 border-gray-200 shadow-sm">
         <h1 className="font-bold px-6 text-gray-800 flex items-center gap-2">
          📘 Daftar Bank Soal
        </h1>
      <CardContent className="py-4 grid grid-cols-1  gap-4">
        <SelectField
          label="Tingkat Kesulitan"
          value={filters.tingkat_kesulitan}
          options={tingkatKesulitanOptions}
          onChange={(val: string) => onChange("tingkat_kesulitan", val)}
        />
        <SelectField
          label="Tingkat Sekolah"
          value={filters.tingkat_sekolah}
          options={tingkatSekolahOptions}
          onChange={(val: string) => onChange("tingkat_sekolah", val)}
        />

        <SelectField
          label="Tipe Soal"
          value={filters.tipe}
          options={tipeSoalOptions}
          onChange={(val: string) => onChange("tipe", val)}
        />

        <div className="grid grid-cols-2 gap-5">
          <Button
            onClick={onFilter}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full"
          >
            Terapkan Filter
          </Button>
          <Button
            className="border-red-600 border bg-transparent  text-red-500 hover:text-white hover:bg-red-500  w-full"
            onClick={onClear}
            
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
