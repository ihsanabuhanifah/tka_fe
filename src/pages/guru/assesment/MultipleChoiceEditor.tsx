// src/components/builder/editors/MultipleChoiceEditor.tsx
import { Field, FieldArray, ErrorMessage, useFormikContext } from 'formik';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Trash2, PlusCircle } from 'lucide-react';
// Asumsi 'quizTypes' sudah diupdate untuk menyertakan 'score' di 'Option'
import type { MultipleChoiceQuestion, MultiSelectQuestion, Option } from './quizTypes'; // Diperbaiki dari './quizTypes' ke '@/lib/quizTypes'
import { generateId } from '@/lib/utils';

type ChoiceQuestion = MultipleChoiceQuestion | MultiSelectQuestion;

interface ChoiceEditorProps {
  index: number;
  question: ChoiceQuestion;
}

export default function MultipleChoiceEditor({ index, question }: ChoiceEditorProps) {
  const namePrefix = `questions[${index}]`;
  const isMultiSelect = question.type === 'multi_select';
  const { setFieldValue } = useFormikContext(); // Menghapus 'values' yang tidak digunakan dari destructuring

  const handleCorrectnessChange = (optIndex: number, isChecked: boolean) => {
    const fieldName = `${namePrefix}.options[${optIndex}]`;
    if (!isMultiSelect && isChecked) {
      // Logic Pilihan Ganda (Hanya satu yang benar)
      (question.options as Option[]).forEach((_, i) => {
        setFieldValue(`${fieldName.replace(`[${optIndex}]`, `[${i}]`)}.isCorrect`, i === optIndex);
      });
    } else {
      // Logic Pilih Banyak atau jika uncheck di Pilihan Ganda
      setFieldValue(`${fieldName}.isCorrect`, isChecked);
    }
  };

  return (
    <div className="space-y-6">
      {/* Teks Soal */}
      <div>
        <Label htmlFor={`${namePrefix}.questionText`}>Teks Soal</Label>
        <Field as={Input} name={`${namePrefix}.questionText`} placeholder="Masukkan teks soal..." />
        <ErrorMessage name={`${namePrefix}.questionText`} component="p" className="text-sm text-destructive mt-1" />
      </div>

      {/* Opsi Jawaban */}
      <div className="space-y-3">
        <Label className="font-semibold text-base block mb-2">
          Opsi Jawaban ({isMultiSelect ? 'Pilih Banyak' : 'Pilihan Ganda'})
        </Label>
        
        {/* HEADER KOLOM UNTUK POIN */}
        <div className="flex font-semibold text-sm text-neutral-600 border-b pb-2">
            <span className="w-10">Kunci</span>
            <span className="flex-grow">Teks Opsi</span>
            <span className="w-[100px] text-center">Poin</span> {/* KOLOM POIN */}
            <span className="w-10"></span>
        </div>
        {/* END HEADER KOLOM */}

        <FieldArray name={`${namePrefix}.options`}>
          {({ remove, push }) => (
            <div className="space-y-2">
              {question.options.map((option, optIndex) => {
                const optPrefix = `${namePrefix}.options[${optIndex}]`;
                return (
                  <div key={option.id} className="relative flex items-center space-x-3 border p-2 rounded-md bg-white">
                    
                    {/* Checkbox/Radio untuk Jawaban Benar */}
                    <div className="w-10 flex justify-center">
                      {isMultiSelect ? (
                          <Checkbox 
                              checked={option.isCorrect}
                              onCheckedChange={(checked) => handleCorrectnessChange(optIndex, checked as boolean)}
                              aria-label="Set as correct answer"
                          />
                      ) : (
                           <RadioGroup 
                              value={option.isCorrect ? 'correct' : 'incorrect'} 
                              onValueChange={() => handleCorrectnessChange(optIndex, true)}
                           >
                              <RadioGroupItem value="correct" />
                           </RadioGroup>
                      )}
                    </div>
                    
                    {/* Input Teks Opsi */}
                    <Field 
                      as={Input} 
                      name={`${optPrefix}.text`} 
                      placeholder={`Opsi ${optIndex + 1}`} 
                      className="flex-grow" 
                    />

                    {/* INPUT POIN BARU */}
                  
                    {/* END INPUT POIN BARU */}
                    
                    {/* Tombol Hapus Opsi */}
                    {question.options.length > 2 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => remove(optIndex)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                );
              })}
              
              {/* PERBAIKAN UTAMA: Menangani Error Array/Objek dari Yup */}
              <ErrorMessage name={`${namePrefix}.options`}>
                  {msg => {
                      // Jika msg adalah string (error array/min length), tampilkan
                      if (typeof msg === 'string') {
                          return <p className="text-sm text-destructive mt-1">{msg}</p>;
                      }
                      // Jika msg adalah objek atau array objek (error per-item), JANGAN tampilkan di sini
                      return null;
                  }}
              </ErrorMessage>
              {/* END PERBAIKAN UTAMA */}

              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => push({ id: generateId(), text: '', isCorrect: false, score: 0 } as Option)} // Tambahkan score default
                className="mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Tambah Opsi
              </Button>
            </div>
          )}
        </FieldArray>
      </div>
    </div>
  );
}