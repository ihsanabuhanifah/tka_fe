// Diimplementasikan dalam komponen HomeGuru.tsx

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Home = () => {
  return (
    <div className="p-8 space-y-8">
      
      {/* 1. Ringkasan Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Ujian</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">12</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Siswa Terdaftar</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">256</CardContent>
        </Card>
        <Card className="border-l-4 border-amber-500">
          <CardHeader>
            <CardTitle>Perlu Dinilai</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-amber-600">5</CardContent>
        </Card>
      </div>

      {/* 2. Tombol Aksi Cepat */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Dashboard Manajemen</h2>
        <Button size="lg">
          {/* Contoh: ikon dari Lucide React */}
          <span className="mr-2">📝</span> Buat Ujian Baru
        </Button>
      </div>
      
      {/* 3. Manajemen Ujian menggunakan Tabs */}
      <Tabs defaultValue="aktif" className="w-full">
        <TabsList>
          <TabsTrigger value="aktif">Ujian Aktif & Draft</TabsTrigger>
          <TabsTrigger value="nilai">Hasil Siswa</TabsTrigger>
        </TabsList>

        <TabsContent value="aktif" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Ujian</TableHead>
                    <TableHead>Mata Pelajaran</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Ujian Tengah Semester 1</TableCell>
                    <TableCell>Matematika</TableCell>
                    <TableCell><Badge variant="default">Aktif</Badge></TableCell>
                    <TableCell><Button variant="outline" size="sm">Edit / Lihat</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ujian Harian Bab 3</TableCell>
                    <TableCell>Fisika</TableCell>
                    <TableCell><Badge variant="secondary">Draft</Badge></TableCell>
                    <TableCell><Button variant="outline" size="sm">Edit / Lihat</Button></TableCell>
                  </TableRow>
                  {/* ... data lainnya ... */}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nilai" className="mt-4">
          {/* Tabel untuk menampilkan nilai siswa dapat diletakkan di sini */}
          <p>Tabel Ringkasan Nilai dan Ranking Siswa...</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};


export default Home