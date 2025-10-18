import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectField({ label, value, options, onChange, ...props }: any) {
  return (
    <div className="space-y-2 w-full">
      <Label>{label}</Label>
      <Select {...props} value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Pilih ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o: any) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label || o.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
