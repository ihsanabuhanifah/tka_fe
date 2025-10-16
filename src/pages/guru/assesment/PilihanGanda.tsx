
import { Label } from "@/components/ui/label";

import { Badge } from "@/components/ui/badge";
import TextEditor from "@/components/TextEditor"


/* =====================
   ✅ Komponen Pilihan Ganda
===================== */
export default function PilihanGanda({ i, formik }: any) {
  const pilihan = formik.values.questions[i].soal.pilihan;
  const err = (formik.errors.questions as any)?.[i]?.soal?.pilihan;

  return (
    <div className="mt-3">
      <Label>Pilihan Jawaban</Label>
      {pilihan.map((p: any, idx: number) => (
        <div key={p.id} className="flex items-start gap-2 mt-1">
          <Badge
            onClick={() => {
              formik.setFieldValue(`questions.jawaban`, p.label);
               formik.setFieldValue(
                  `questions.${i}.jawaban`,
                  p.label
                )
              
            }}

            variant={[`${formik.values.questions[i].jawaban}`].includes(p.label) ? "default" : "secondary"}
             className="cursor-pointer"
          >
            {p.label} {console.log("formik.values.questions[i].jawaban", formik.values.questions[i].jawaban)}
          </Badge>
          <div className="flex-1">
            <TextEditor
              value={p.teks}
              handleChange={(val: string) =>
                formik.setFieldValue(
                  `questions.${i}.soal.pilihan.${idx}.teks`,
                  val
                )
              }
            />
            <ErrorText error={err?.[idx]?.teks} />
          </div>
        </div>
      ))}
    </div>
  );
}


export function ErrorText({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="text-red-500 text-xs mt-1">{error}</p>;
}