// src/components/builder/editors/TrueFalseEditor.tsx
import { Field, ErrorMessage, useFormikContext } from 'formik';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { TrueFalseQuestion } from './quizTypes';

interface TrueFalseEditorProps {
  index: number;
  question: TrueFalseQuestion;
}

export default function TrueFalseEditor({ index, question }: TrueFalseEditorProps) {
  const namePrefix = `questions[${index}]`;
  const { setFieldValue } = useFormikContext();
  
  return (
    <div className="space-y-4">
      {/* Teks Soal */}
      <div>
        <Label htmlFor={`${namePrefix}.questionText`}>Teks Pernyataan</Label>
        <Field as={Input} name={`${namePrefix}.questionText`} placeholder="Masukkan pernyataan yang akan dijawab Benar/Salah..." />
        <ErrorMessage name={`${namePrefix}.questionText`} component="p" className="text-sm text-destructive mt-1" />
      </div>

      {/* Jawaban Benar */}
      <div>
        <Label className="block mb-2">Jawaban yang Benar</Label>
        <Field name={`${namePrefix}.isCorrect`}>
            {({ field }: any) => (
                <RadioGroup 
                    onValueChange={(value:any) => setFieldValue(field.name, value === 'true')}
                    value={field.value ? 'true' : 'false'}
                    className="flex space-x-6"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id={`${namePrefix}-true`} />
                        <Label htmlFor={`${namePrefix}-true`}>Benar (True)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id={`${namePrefix}-false`} />
                        <Label htmlFor={`${namePrefix}-false`}>Salah (False)</Label>
                    </div>
                </RadioGroup>
            )}
        </Field>
      </div>
    </div>
  );
}