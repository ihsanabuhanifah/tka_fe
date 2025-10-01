// src/components/builder/editors/FixedFiveChoiceEditor.tsx
import { Field, ErrorMessage, useFormikContext } from 'formik';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { FixedFiveChoiceQuestion, Option } from './quizTypes';

interface FixedFiveChoiceEditorProps {
  index: number;
  question: FixedFiveChoiceQuestion;
}

export default function FixedFiveChoiceEditor({ index, question }: FixedFiveChoiceEditorProps) {
  const namePrefix = `questions[${index}]`;
  const { setFieldValue } = useFormikContext();

  // Logic untuk memastikan hanya satu radio yang terpilih (Pilihan Ganda)
  const handleCorrectnessChange = (optIndex: number, isChecked: boolean) => {
    if (isChecked) {
      // Set semua isCorrect ke false, kecuali yang baru dipilih
      (question.options as Option[]).forEach((_, i) => {
        setFieldValue(`${namePrefix}.options[${i}].isCorrect`, i === optIndex);
      });
    }
    // Jika user men-uncheck, kita tidak lakukan apa-apa karena harus ada 1 jawaban benar.
  };

  return (
    <div className="space-y-6">
      {/* Teks Soal */}
      <div>
        <Label htmlFor={`${namePrefix}.questionText`}>Teks Soal</Label>
        <Field as={Input} name={`${namePrefix}.questionText`} placeholder="Masukkan teks soal..." />
        <ErrorMessage name={`${namePrefix}.questionText`} component="p" className="text-sm text-destructive mt-1" />
      </div>

      {/* Opsi Jawaban Tetap 5 */}
      <div className="space-y-3">
        <Label className="font-semibold text-base block mb-2">
          Opsi Jawaban (A-E) dan Poin
        </Label>
        
        <div className="flex font-semibold text-sm text-neutral-600 border-b pb-2">
            <span className="w-10">Kunci</span>
            <span className="flex-grow">Teks Opsi</span>
            <span className="w-[100px] text-center">Poin</span>
        </div>

        {question.options.map((option, optIndex) => {
            const optLetter = String.fromCharCode(65 + optIndex);
            const optPrefix = `${namePrefix}.options[${optIndex}]`;
            return (
                <div key={option.id} className="relative flex items-center space-x-3 border p-2 rounded-md bg-white">
                    
                    {/* Radio Button Kunci Jawaban */}
                    <div className="w-10 flex justify-center">
                        <RadioGroup 
                            value={option.isCorrect ? 'correct' : 'incorrect'} 
                            onValueChange={() => handleCorrectnessChange(optIndex, true)}
                        >
                            <RadioGroupItem value="correct" aria-label={`Setel Opsi ${optLetter} sebagai kunci`} />
                        </RadioGroup>
                    </div>
                    
                    {/* Input Teks Opsi */}
                    <Field 
                      as={Input} 
                      name={`${optPrefix}.text`} 
                      placeholder={`Opsi ${optLetter}`} 
                      className="flex-grow" 
                    />
                    
                    {/* Input Poin */}
                    <div className="w-[100px] relative">
                        <Field 
                            as={Input} 
                            type="number" 
                            name={`${optPrefix}.score`} 
                            placeholder="Nilai" 
                            className="w-full text-center" 
                        />
                         <ErrorMessage name={`${optPrefix}.score`}>
                            {msg => <p className="text-[10px] text-destructive absolute top-full left-0 w-full text-center">{msg}</p>}
                        </ErrorMessage>
                    </div>
                </div>
            );
        })}
        {/* Tidak ada tombol Tambah/Hapus Opsi di sini */}
        <ErrorMessage name={`${namePrefix}.options`} component="p" className="text-sm text-destructive mt-1" />
      </div>
    </div>
  );
}