// src/lib/quizTypes.ts
import { generateId } from "@/lib/utils";

export type QuestionType = 'multiple_choice' | 'multi_select' | 'true_false' | 'multiple_tf_statements' | 'fixed_five_choice' | 'essay';

interface BaseQuestion {
  id: string; // ID unik
  questionText: string;
  
}

export interface EssayQuestion extends BaseQuestion {
  type: 'essay';
  maxScore: number; // Poin maksimum yang dapat diberikan guru
  answer:string
}




export interface Option {
  id: string;
  text: string;
  isCorrect: boolean; // True jika opsi ini adalah jawaban
  score?:number
}

// Tipe untuk Pernyataan Benar/Salah
export interface Statement {
    id: string; // ID unik untuk pernyataan
    text: string;
    isCorrect: boolean; // Jawaban yang benar untuk pernyataan
}

export interface FixedFiveChoiceQuestion extends BaseQuestion {
  type: 'fixed_five_choice';
  options: Option[]; // Akan selalu berisi 5 item
}


// 4. Beberapa Pernyataan B/S
export interface MultipleTFStatementsQuestion extends BaseQuestion {
    type: 'multiple_tf_statements';
    statements: Statement[];
}

// 1. Pilihan Ganda (Hanya 1 jawaban benar)
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  options: Option[];
}

// 2. Pilih Banyak (Bisa >1 jawaban benar)
export interface MultiSelectQuestion extends BaseQuestion {
  type: 'multi_select';
  options: Option[];
}

// 3. True/False
export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false';
  isCorrect: boolean; // Jawaban yang benar untuk pernyataan
}

// Menggabungkan semua tipe soal
export type Question = MultipleChoiceQuestion | FixedFiveChoiceQuestion | MultiSelectQuestion | TrueFalseQuestion | MultipleTFStatementsQuestion | EssayQuestion;

const createFiveDefaultOptions = (isCorrectIndex: number, defaultScore: number) => {
    const options: Option[] = [];
    for (let i = 0; i < 5; i++) {
        options.push({
            id: generateId(), 
            text: `Opsi ${String.fromCharCode(65 + i)}`, // A, B, C, D, E
            isCorrect: (i === isCorrectIndex),
            score: (i === isCorrectIndex) ? defaultScore : 0
        });
    }
    return options;
}


export interface QuizFormValues {
  title: string;
  questions: Question[]; // Larik utama soal
}

// Nilai Awal untuk Formik
export const initialQuizValues: QuizFormValues = {
  title: "Ujian Baru",
  questions: [],
};


// Fungsi untuk membuat soal baru
export const createNewQuestion = (type: QuestionType): Question => {
  const newId = generateId();
  switch (type) {
    case 'fixed_five_choice':
      return { 
        id: newId, 
        type: 'fixed_five_choice', 
        questionText: 'Soal Pilihan Ganda (5 Opsi Wajib, Poin Fleksibel)',
        options: createFiveDefaultOptions(0, 10) // Default A adalah jawaban benar dengan 10 poin
      } as FixedFiveChoiceQuestion;
          case 'essay': // KASUS BARU: Essay
      return { 
        id: newId, 
        type: 'essay', 
        questionText: 'Tuliskan esai mengenai fungsi React Hooks.',
        maxScore: 25,
        answer : ""
      } as EssayQuestion;

    case 'multiple_choice':
      return { 
        id: newId, 
        type: 'multiple_choice', 
        questionText: 'Soal Pilihan Ganda Baru',
        options: [
            { id: generateId(), text: 'Opsi A (Jawaban Benar)', isCorrect: true },
            { id: generateId(), text: 'Opsi B', isCorrect: false },
        ] 
      } as MultipleChoiceQuestion;

       case 'multiple_tf_statements': // KASUS BARU
      return { 
        id: newId, 
        type: 'multiple_tf_statements', 
        questionText: 'Soal Pernyataan Benar/Salah Baru',
        statements: [
            { id: generateId(), text: 'Pernyataan A: ini adalah benar', isCorrect: true },
            { id: generateId(), text: 'Pernyataan B: ini adalah salah', isCorrect: false },
        ]
      } as MultipleTFStatementsQuestion;
    case 'multi_select':
      return { 
        id: newId, 
        type: 'multi_select', 
        questionText: 'Soal Pilih Banyak Baru',
        options: [
            { id: generateId(), text: 'Opsi 1 (Jawaban Benar)', isCorrect: true },
            { id: generateId(), text: 'Opsi 2', isCorrect: false },
            { id: generateId(), text: 'Opsi 3 (Jawaban Benar)', isCorrect: true },
        ] 
      } as MultiSelectQuestion;
    case 'true_false':
      return { 
        id: newId, 
        type: 'true_false', 
        questionText: 'Pernyataan Benar/Salah Baru',
        isCorrect: true // Default: Benar
      } as TrueFalseQuestion;
    default:
      // Fallback
      return { 
        id: newId, 
        type: 'multiple_choice', 
        questionText: 'Soal Default Baru',
        options: [] 
      } as MultipleChoiceQuestion;
  }
};