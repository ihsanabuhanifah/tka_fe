// src/components/builder/editors/MultipleTFStatementsEditor.tsx
import { Field, FieldArray, ErrorMessage, useFormikContext } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Trash2, PlusCircle, AlignLeft } from "lucide-react";
import { type MultipleTFStatementsQuestion } from "./quizTypes";
import { generateId } from "@/lib/utils";

interface MultipleTFStatementsEditorProps {
  index: number;
  question: MultipleTFStatementsQuestion;
}

export default function MultipleTFStatementsEditor({
  index,
  question,
}: MultipleTFStatementsEditorProps) {
  const namePrefix = `questions[${index}]`;
  const { setFieldValue } = useFormikContext();

  return (
    <div className="space-y-6">
      {/* Teks Soal Induk (Instruksi) */}
      <div>
        <Label htmlFor={`${namePrefix}.questionText`}>
          Teks Soal / Instruksi
        </Label>
        <Field
          as={Input}
          name={`${namePrefix}.questionText`}
          placeholder="Contoh: Tentukan Benar atau Salah untuk setiap pernyataan berikut..."
        />
        <ErrorMessage
          name={`${namePrefix}.questionText`}
          component="p"
          className="text-sm text-destructive mt-1"
        />
      </div>

      {/* Daftar Pernyataan */}
      <div className="space-y-4">
        <Label className="font-semibold text-base block mb-2">
          Daftar Pernyataan dan Kunci Jawaban
        </Label>
        <FieldArray name={`${namePrefix}.statements`}>
          {({ remove, push }) => (
            <div className="space-y-3">
              <div className="flex font-semibold text-sm text-neutral-600 border-b pb-2">
                <span className="w-10">#</span>
                <span className="flex-grow">Pernyataan</span>
                <span className="w-[120px] text-center">Jawaban Benar</span>
                <span className="w-10"></span>
              </div>

              {question.statements.map((statement, stmtIndex) => {
                const stmtPrefix = `${namePrefix}.statements[${stmtIndex}]`;
                return (
                  <div
                    key={statement.id}
                    className="flex items-center space-x-3 border p-2 rounded-md bg-white"
                  >
                    <span className="w-10 text-center text-neutral-500">
                      {stmtIndex + 1}
                    </span>

                    {/* Input Teks Pernyataan */}
                    <Field
                      as={Input}
                      name={`${stmtPrefix}.text`}
                      placeholder={`Pernyataan ${stmtIndex + 1}`}
                      className="flex-grow"
                    />

                    {/* Radio Button Jawaban Benar */}
                    <div className="w-[120px] flex justify-center">
                      <Field name={`${stmtPrefix}.isCorrect`}>
                        {({ field }: any) => (
                          <RadioGroup
                            onValueChange={(value) =>
                              setFieldValue(field.name, value === "true")
                            }
                            value={field.value ? "true" : "false"}
                            className="flex space-x-3"
                          >
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem
                                value="true"
                                id={`${stmtPrefix}-true`}
                              />
                              <Label htmlFor={`${stmtPrefix}-true`}>B</Label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem
                                value="false"
                                id={`${stmtPrefix}-false`}
                              />
                              <Label htmlFor={`${stmtPrefix}-false`}>S</Label>
                            </div>
                          </RadioGroup>
                        )}
                      </Field>
                    </div>

                    {/* Tombol Hapus Pernyataan */}
                    {question.statements.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(stmtIndex)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                );
              })}

              <ErrorMessage
                name={`${namePrefix}.statements`}
                component="p"
                className="text-sm text-destructive mt-1"
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  push({
                    id: generateId(),
                    text: "Pernyataan baru...",
                    isCorrect: true,
                  })
                }
                className="mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Tambah Pernyataan
              </Button>
            </div>
          )}
        </FieldArray>
      </div>
    </div>
  );
}
