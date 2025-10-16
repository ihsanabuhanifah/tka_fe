

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ErrorText } from "./PilihanGanda";

export default function SelectField({ label, value, options, onChange, error }: any) {
  return (
    <div>
      <Label>{label}</Label>
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
      <ErrorText error={error} />
    </div>
  );
}