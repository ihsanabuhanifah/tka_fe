export type Pilihan = {
  id: string;
  label: string;
  teks: string;
};

/* =====================
   Generate ID unik
===================== */
export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

/* =====================
   Ganti tipe soal
===================== */
export function handleTipeChange(values: any, tipe: string) {
  const base: { pertanyaan: string; pilihan: Pilihan[] } = {
    pertanyaan: "",
    pilihan: [],
  };

  if (tipe === "PG" || tipe === "MCMA") {
    base.pilihan = [
      { id: generateId(), label: "A", teks: "" },
      { id: generateId(), label: "B", teks: "" },
    ];
  } else if (tipe === "MTF") {
    base.pilihan = [{ id: generateId(), label: "1", teks: "" }];
  }

  return {
    ...values,
    tipe,
  
    jawaban: tipe === "ES" ? "" : tipe === "PG" ? "" : [],
  };
}

/* =====================
   Hapus pilihan
===================== */
export function removePilihan(values: any, idx: number) {
  const updatedPilihan = values.soal.pilihan.filter(
    (_: any, i: number) => i !== idx
  );

  return {
    ...values,
    soal: {
      ...values.soal,
      pilihan: updatedPilihan,
    },
  };
}

/* =====================
   Tambah pilihan
===================== */
export function addPilihan(values: any) {
  const q = values.soal.pilihan || [];
  const nextLabel =
    values.tipe === "MTF"
      ? String(q.length + 1)
      : String.fromCharCode(65 + q.length); // A, B, C...
  const newPilihan = { id: generateId(), label: nextLabel, teks: "" };

  return {
    ...values,
    soal: {
      ...values.soal,
      pilihan: [...q, newPilihan],
    },
  };
}



export const tingkatKesulitanOptions = [
  { label: "Mudah", value: "mudah" },
  { label: "Sedang", value: "sedang" },
  { label: "Susah", value: "susah" },
  { label: "HOTS", value: "hots" },
];

export const tingkatSekolahOptions = [
  { label: "SD", value: "sd" },
  { label: "SMP", value: "smp" },
  { label: "SMA", value: "sma" },
];

export const publikOptions = [
  { label: "Privat", value: 0 },
  { label: "Publik", value: 1 },
];