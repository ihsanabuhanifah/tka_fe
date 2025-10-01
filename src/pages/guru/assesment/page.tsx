// src/AssessmentBuilder.tsx
"use client"

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { initialQuizValues, type QuizFormValues } from './quizTypes';
import QuestionListBuilder from './QuestionListBuilder';
import { quizSchema } from './quizSchema';

// Ini adalah komponen yang Anda ekspor
export default function AssessmentBuilder() {
  
  const onSubmit = (values: QuizFormValues, { setSubmitting }: any) => {
    // Kirim data ke server (Data yang divalidasi dan siap disimpan)
    setTimeout(() => {
      console.log("Data Ujian yang Dibuat:", values);
      alert(`✅ Ujian "${values.title}" berhasil dibuat dengan ${values.questions.length} soal! Cek console.`);
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <h1 className="text-4xl font-extrabold mb-2 text-center">🧠 Pembuat Ujian Dinamis</h1>
      <p className="text-center text-neutral-600 mb-6">Gunakan formulir ini untuk membuat dan mengatur berbagai tipe soal.</p>
      <Separator className="mb-8" />

      <Formik
        initialValues={initialQuizValues}
        validationSchema={quizSchema}
        onSubmit={onSubmit}
        enableReinitialize={true} // Penting untuk debugging
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-8">
            
            {/* Judul Ujian */}
            <Card className={errors.title && touched.title ? 'border-destructive shadow-lg' : ''}>
              <CardHeader>
                <CardTitle>1. Informasi Dasar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Ujian</Label>
                  <Field 
                    as={Input} 
                    name="title" 
                    id="title" 
                    placeholder="Contoh: Ujian Tengah Semester Web Dev" 
                    className={errors.title && touched.title ? 'border-destructive' : ''}
                  />
                  <ErrorMessage name="title" component="p" className="text-sm font-medium text-destructive mt-1" />
                </div>
              </CardContent>
            </Card>

            {/* Daftar Soal Dinamis (Inti dari fitur ini) */}
            <QuestionListBuilder />
            
            {/* Tombol Submit */}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting} className="w-[200px]">
                {isSubmitting ? "Menyimpan..." : "💾 Simpan Ujian"}
              </Button>
            </div>

          </Form>
        )}
      </Formik>
    </div>
  )
}