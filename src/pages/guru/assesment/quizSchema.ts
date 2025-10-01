// src/lib/quizSchema.ts
import * as yup from 'yup';

// Skema untuk Opsi Jawaban
const optionSchema = yup.object({
  id: yup.string().required(),
  text: yup.string().min(1, 'Opsi tidak boleh kosong.').required(),
  isCorrect: yup.boolean().required(),
});

// Skema dasar untuk semua soal
const baseQuestionSchema = yup.object({
  id: yup.string().required(),
  questionText: yup.string().min(10, 'Teks soal minimal 10 karakter.').required('Teks soal wajib diisi.'),
});

// Skema untuk Statement (pernyataan)
const statementSchema = yup.object({
    id: yup.string().required(),
    text: yup.string().min(1, 'Pernyataan tidak boleh kosong.').required(),
    isCorrect: yup.boolean().required(),
});

const fixedChoiceSchema = baseQuestionSchema.shape({
    type: yup.string().oneOf(['fixed_five_choice']).required(),
    options: yup.array(optionSchema)
        .length(5, 'Soal ini harus memiliki TEPAT 5 opsi.') // VALIDASI PENTING
        .test('has-correct', 'Harus ada minimal 1 jawaban yang benar.', (options) => {
            return options ? options.some(opt => opt.isCorrect) : false;
        })
        .required(),
});


// ... (Skema choiceSchema dan trueFalseSchema tetap sama)

// Skema untuk Beberapa Pernyataan B/S
const multipleTFStatementsSchema = baseQuestionSchema.shape({
    type: yup.string().oneOf(['multiple_tf_statements']).required(),
    statements: yup.array(statementSchema)
        .min(1, 'Minimal 1 pernyataan diperlukan.')
        .required(),
});

// Perbarui Skema utama array soal (questionSchema)


// Skema untuk Pilihan Ganda & Pilih Banyak
const choiceSchema = baseQuestionSchema.shape({
    type: yup.string().oneOf(['multiple_choice', 'multi_select']).required(),
    options: yup.array(optionSchema)
        .min(2, 'Minimal 2 opsi jawaban.')
        .test('has-correct', 'Harus ada minimal 1 jawaban yang benar.', (options) => {
            return options ? options.some(opt => opt.isCorrect) : false;
        })
        .test('single-correct-for-mc', 'Pilihan Ganda harus memiliki TEPAT 1 jawaban benar.', function(options) {
            if (this.parent.type === 'multiple_choice') {
                const correctCount = options ? options.filter(opt => opt.isCorrect).length : 0;
                return correctCount === 1;
            }
            return true; // Lolos untuk multi_select
        })
        .required(),
});


// Skema untuk True/False
const trueFalseSchema = baseQuestionSchema.shape({
    type: yup.string().oneOf(['true_false']).required(),
    isCorrect: yup.boolean().required(),
});

const essaySchema = baseQuestionSchema.shape({
    type: yup.string().oneOf(['essay']).required(),
    maxScore: yup.number()
        .required('Poin maksimum wajib diisi.')
        .min(1, 'Poin maksimum minimal 1.')
        .typeError('Poin maksimum harus berupa angka.'),
});

// Skema utama array soal


const questionSchema = yup.lazy(value => {
    switch (value.type) {
         case 'fixed_five_choice': // KASUS BARU
            return fixedChoiceSchema;
        case 'essay':
            return essaySchema;
        case 'multiple_choice':
        case 'multi_select':
            return choiceSchema;
        case 'true_false':
            return trueFalseSchema;
        case 'multiple_tf_statements': // KASUS BARU
            return multipleTFStatementsSchema;
        default:
            return baseQuestionSchema;
    }
});
// Skema utama form ujian
export const quizSchema = yup.object({
  title: yup.string().min(5, 'Judul minimal 5 karakter.').required('Judul ujian wajib diisi.'),
  questions: yup.array(questionSchema).min(1, 'Ujian harus memiliki minimal 1 soal.').required(),
});


