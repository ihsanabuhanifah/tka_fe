import {
  Dialog,
  DialogContent,
  DialogHeader,
  
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import RenderMathHTML from "@/components/RenderMathHTML";


/* -----------------------------
   Tipe Data (sesuai data soal Anda)
----------------------------- */
interface SoalItem {
  id: string;
  materi: string;
  point: number;
  tipe: "PG" | "MCMA" | "MTF" | "ES";
  soal: string; // JSON string
  pembahasan: string;
  tingkat_kesulitan: string;
  tingkat_sekolah: string;
  jawaban: string; // JSON string
  nama_guru: string | null;
}

interface SoalContentPGMCMA {
  pertanyaan: string;
  pilihan: Array<{
    id: string;
    label: string;
    teks: string;
  }>;
}

interface SoalContentMTF {
  pertanyaan: string;
  pilihan: Array<{
    id: string;
    teks: string;
    label?: string;
  }>;
}

// interface SoalContentES {
//   pertanyaan: string;
// }

interface SoalPreviewModalProps {
  soal: SoalItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/* -----------------------------
   Helper Component untuk Render Jawaban PG/MCMA
----------------------------- */
const RenderPGMCMA = ({ soal, soalContent }: { soal: SoalItem, soalContent: SoalContentPGMCMA }) => {
  const correctAnswers = JSON.parse(soal.jawaban); // String 'A', Array ['A', 'C']

  const isCorrect = (label: string) => {
    if (soal.tipe === 'PG') {
      return label === correctAnswers;
    } else if (soal.tipe === 'MCMA') {
      return Array.isArray(correctAnswers) && correctAnswers.includes(label);
    }
    return false;
  }

  return (
    <div className="space-y-3">
      {soalContent.pilihan.map((pilihan) => {
        const correct = isCorrect(pilihan.label);
        return (
          <div
            key={pilihan.id}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
              correct
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:bg-gray-100"
            }`}
          >
            <div className={`font-bold text-sm min-w-[20px] pt-1 ${correct ? "text-green-700" : "text-gray-700"}`}>
              {pilihan.label}.
            </div>
            <div className="flex-1 text-sm text-gray-800">
              <RenderMathHTML html={pilihan.teks} />
            </div>
            {correct && (
              <span className="text-xs font-semibold text-green-700 bg-green-200 px-2 py-1 rounded-full whitespace-nowrap">
                {soal.tipe === 'PG' ? 'Kunci Jawaban' : 'Jawaban Benar'}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* -----------------------------
   Helper Component untuk Render Jawaban MTF
----------------------------- */
/* -----------------------------
   Helper Component untuk Render Jawaban MTF
----------------------------- */
const RenderMTF = ({ soal, soalContent }: { soal: SoalItem, soalContent: SoalContentMTF }) => {


    console.log("soalContent :", soalContent);

    console.log("soal.jawaban MTF:", soal.jawaban);
  // Jawaban MTF disimpan sebagai string JSON, dan karena kita asumsikan urutan,
  // kita ubah menjadi array boolean: [true, false, true, ...]
  // 💡 CATATAN: Karena struktur JSON asli Anda adalah Object { "id1": true, "id2": false },
  // kita perlu memetakan kembali ke array berdasarkan urutan pernyataan.
  const rawCorrectAnswers = JSON.parse(soal.jawaban); 
  
  const pernyataanList = soalContent.pilihan || []; 

  if (pernyataanList.length === 0) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-800">
        Data pernyataan untuk soal Multi True/False tidak ditemukan atau kosong.
      </div>
    );
  }

  // 1. Dapatkan kunci jawaban dalam urutan yang sama dengan pernyataanList
 


  console.log("correctAnswersArray MTF:", rawCorrectAnswers);
  
  // 2. Tentukan nama grup radio yang unik (penting jika ada banyak modal)
  const radioGroupName = `mft-answer-${soal.id}`;


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border rounded-lg shadow-sm">
        {/* Header Tabel */}
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-1/12">
              No.
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-7/12">
              Pernyataan
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider w-2/12">
              BENAR
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider w-2/12">
              SALAH
            </th>
          </tr>
        </thead>
        {/* Body Tabel */}
        <tbody className="bg-white divide-y divide-gray-200">
          {pernyataanList.map((pernyataan, index) => {
           

            return (
              <tr 
                key={pernyataan.id} 
                className={`transition-colors  bg-indigo-50 hover:bg-indigo-100''}`}
              >
                {/* Kolom Nomor */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 text-center">
                  {index + 1}.
                </td>
                {/* Kolom Pernyataan */}
                <td className="px-6 py-4 text-sm text-gray-800">
                  <RenderMathHTML html={pernyataan.teks} />
                </td>
                {/* Kolom BENAR */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  
                    <input
                      type="radio"
                      name={`${radioGroupName}-${index}`}
                      checked={rawCorrectAnswers[index] === true}
                      readOnly
                      className={`h-4 w-4 transition duration-150 ease-in-out ${rawCorrectAnswers[index] === true ? 'accent-green-600' : 'text-gray-300'}`}
                      
                    />
                  
                </td>
                {/* Kolom SALAH */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                
                    <input
                      type="radio"
                      name={`${radioGroupName}-${index}`}
                      checked={rawCorrectAnswers[index] === false}
                      readOnly
                      className={`h-4 w-4 transition duration-150 ease-in-out ${rawCorrectAnswers[index] === false ? 'accent-red-600' : 'text-gray-300'}`}
                      
                    />
                
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      
     
    </div>
  );
};
/* -----------------------------
   Helper Component untuk Render Jawaban ES
----------------------------- */
const RenderES = () => (
  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg text-yellow-800">
    <p className="font-semibold">Tidak ada kunci jawaban untuk soal Essay (ES).</p>
    <p className="text-sm">Jawaban akan dinilai secara manual oleh pengajar.</p>
  </div>
);


/* -----------------------------
   Komponen Modal Utama
----------------------------- */
export default function SoalPreviewModal({ soal, isOpen, onOpenChange }: SoalPreviewModalProps) {
  if (!soal) return null;

  let soalContent: any = {};
  try {
    soalContent = JSON.parse(soal.soal);
  } catch (e) {
    console.error("Failed to parse soal content:", e);
    return null;
  }

  const getTipeText = (tipe: string) => {
    switch (tipe) {
      case 'PG': return 'Pilihan Ganda';
      case 'MCMA': return 'Multi Pilihan (MCMA)';
      case 'MTF': return 'Multi True/False (MTF)';
      case 'ES': return 'Essay (ES)';
      default: return 'Tipe Tidak Dikenal';
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {/* <DialogTitle className="text-md font-bold text-blue-500 flex items-center gap-2">
            <Eye className="h-6 w-6"/>
           
          </DialogTitle> */}
          <div className="mt-2 text-sm text-gray-500">
            {soal.materi} | {soal.tingkat_sekolah.toUpperCase()} | Poin: {soal.point}
          </div>
        </DialogHeader>

        <Separator />
        
        {/* Konten Pertanyaan */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Pertanyaan ({getTipeText(soal.tipe)})</h3>
          <div className="p-4 rounded-lg border bg-gray-50">
            <RenderMathHTML html={soalContent.pertanyaan} />
          </div>
        </div>

        {/* Konten Jawaban */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Kunci Jawaban & Opsi</h3>
          {soal.tipe === 'PG' || soal.tipe === 'MCMA' ? (
            <RenderPGMCMA soal={soal} soalContent={soalContent as SoalContentPGMCMA} />
          ) : soal.tipe === 'MTF' ? (
            <RenderMTF soal={soal} soalContent={soalContent as SoalContentMTF} />
          ) : soal.tipe === 'ES' ? (
            <RenderES />
          ) : (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-800">
              Tipe soal tidak didukung untuk preview detail.
            </div>
          )}
        </div>
        
        {/* Pembahasan (Optional) */}
        {soal.pembahasan && (
            <div className="space-y-4 pt-4 border-t mt-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Pembahasan</h3>
                <div className="p-4 rounded-lg border text-sm bg-blue-50">
                    <RenderMathHTML html={soal.pembahasan} />
                </div>
            </div>
        )}

      </DialogContent>
    </Dialog>
  );
}