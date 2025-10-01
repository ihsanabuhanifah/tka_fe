// src/components/builder/editors/EssayEditor.tsx
import { Field, ErrorMessage } from 'formik';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type EssayQuestion } from './quizTypes';

interface EssayEditorProps {
  index: number;
  question: EssayQuestion;
}

export default function EssayEditor({ index }: EssayEditorProps) {
  const namePrefix = `questions[${index}]`;
  
  return (
    <div className="space-y-4">
      {/* Teks Soal / Pertanyaan */}
      <div>
        <Label htmlFor={`${namePrefix}.questionText`}>Pertanyaan Esai</Label>
        <Field 
            as={Textarea} 
            name={`${namePrefix}.questionText`} 
            id={`${namePrefix}.questionText`} 
            placeholder="Contoh: Jelaskan perbedaan antara server-side rendering dan client-side rendering." 
            rows={4}
        />
        <ErrorMessage name={`${namePrefix}.questionText`} component="p" className="text-sm text-destructive mt-1" />
      </div>

      {/* Poin Maksimum */}
      <div>
        <Label htmlFor={`${namePrefix}.maxScore`}>Poin Maksimum Soal</Label>
        <Field 
            as={Input} 
            type="number"
            name={`${namePrefix}.maxScore`} 
            id={`${namePrefix}.maxScore`} 
            placeholder="Contoh: 25" 
            className="w-full md:w-1/3"
        />
        <ErrorMessage name={`${namePrefix}.maxScore`} component="p" className="text-sm text-destructive mt-1" />
        <p className="text-sm text-neutral-500 mt-1">Poin ini akan diberikan secara manual oleh guru saat koreksi.</p>
      </div>
    </div>
  );
}