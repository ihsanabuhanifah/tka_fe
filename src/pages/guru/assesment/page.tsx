// src/AssessmentBuilder.tsx
"use client";

import { Separator } from "@/components/ui/separator";

import QuestionListBuilder from "./QuestionListBuilder";

// Ini adalah komponen yang Anda ekspor
export default function AssessmentBuilder() {
  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <h1 className="text-4xl font-extrabold mb-2 text-center">
        🧠 Pembuat Ujian Dinamis
      </h1>
      <p className="text-center text-neutral-600 mb-6">
        Gunakan formulir ini untuk membuat dan mengatur berbagai tipe soal.
      </p>
      <Separator className="mb-8" />

      {/* Daftar Soal Dinamis (Inti dari fitur ini) */}
      <QuestionListBuilder />

      {/* Tombol Submit */}
    </div>
  );
}
