// src/components/builder/QuestionListBuilder.tsx
import React from 'react';
import { FieldArray, useFormikContext } from 'formik';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';

import type { EssayQuestion, FixedFiveChoiceQuestion, MultipleChoiceQuestion, MultipleTFStatementsQuestion, MultiSelectQuestion, Question, QuestionType, QuizFormValues, TrueFalseQuestion} from './quizTypes';
import { createNewQuestion} from "./quizTypes"
import QuestionCard from './QuestionCard';
import MultipleChoiceEditor from './MultipleChoiceEditor';
import TrueFalseEditor from './TrueFalseEditor';
import MultipleTFStatementsEditor from './MultipleTFStatementsEditor'; // IMPOR BARU
import EssayEditor from './EssayEditor';
import FixedFiveChoiceEditor from './FixedFiveChoiceEditor';

// --- Router Editor Soal ---
const QuestionEditorRouter: React.FC<{ question: Question, index: number }> = ({ question, index }) => {
  switch (question.type) {
    case 'multiple_choice':
      return <MultipleChoiceEditor index={index} question={question as MultipleChoiceQuestion} />;
    case 'multi_select':
      return <MultipleChoiceEditor index={index} question={question as MultiSelectQuestion} />;
    case 'true_false':
      return <TrueFalseEditor index={index} question={question as TrueFalseQuestion} />;
    case 'multiple_tf_statements': // KASUS BARU
      return <MultipleTFStatementsEditor index={index} question={question as MultipleTFStatementsQuestion} />;
       case 'essay': // KASUS BARU
      return <EssayEditor index={index} question={question as EssayQuestion} />;
       case 'fixed_five_choice': // KASUS BARU
      return <FixedFiveChoiceEditor index={index} question={question as FixedFiveChoiceQuestion} />;
    default:
      return <p className="text-destructive">Error: Tipe soal tidak dikenali.</p>;
  }
};

// --- Komponen Utama List Soal ---
export default function QuestionListBuilder() {
  const { values, errors, touched } = useFormikContext<QuizFormValues>();
  const [selectedType, setSelectedType] = React.useState<QuestionType>('multiple_choice');

  const getQuestionTypeLabel = (type: QuestionType) => {
      switch(type) {
        
          case 'multiple_choice': return 'Pilihan Ganda';
          case 'multi_select': return 'Pilih Banyak';
          case 'true_false': return 'Benar/Salah';
          case 'essay': return 'Esai (Jawaban Panjang)'; // LABEL BARU
           case 'fixed_five_choice': return 'Pilihan Ganda Wajib 5 Opsi'; // LABEL BARU
          default: return 'Soal';
          
      }
  }

  return (
    <FieldArray name="questions">
      {({ remove, push }) => (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Soal ({values.questions.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pesan error untuk array soal */}
              {errors.questions && touched.questions && typeof errors.questions === 'string' && (
                  <p className="text-sm font-medium text-destructive">{errors.questions}</p>
              )}

              {/* Looping untuk menampilkan setiap soal */}
              {values.questions.map((question:any, index:number) => (
                <QuestionCard
                  key={question.id}
                  index={index}
                  typeLabel={getQuestionTypeLabel(question.type)}
                  onRemove={() => remove(index)}
                >
                  <QuestionEditorRouter question={question} index={index} />
                </QuestionCard>
              ))}

              {/* Kontrol Tambah Soal */}
              <div className="flex items-center space-x-4 pt-4 border-t pt-6">
                <Select value={selectedType} onValueChange={(value) => setSelectedType(value as QuestionType)}>
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Pilih Tipe Soal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice">Pilihan Ganda</SelectItem>
                    <SelectItem value="multi_select">Pilih Banyak</SelectItem>
                    <SelectItem value="true_false">Benar / Salah</SelectItem>
                    <SelectItem value="fixed_five_choice">🎯 Pilihan Ganda (5 Opsi, Bobot)</SelectItem> {/* OPSI BARU */}
                      <SelectItem value="multiple_tf_statements">Beberapa Pernyataan Benar Salah</SelectItem> 
                       <SelectItem value="essay">Esai</SelectItem> {/* OPSI BARU */}
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  onClick={() => push(createNewQuestion(selectedType))}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Tambah Soal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </FieldArray>
  );
}