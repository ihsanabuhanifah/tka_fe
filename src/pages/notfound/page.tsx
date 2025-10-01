import React from 'react';
import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      
      {/* 🖼️ Ilustrasi atau Ikon yang Menarik */}
      <svg className="w-24 h-24 mb-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
      
      <h1 className="text-7xl md:text-9xl font-extrabold text-gray-900 mb-4">404</h1>
      
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
        Halaman Tidak Ditemukan
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md">
        Ups! Kami tidak dapat menemukan halaman yang Anda cari. Mungkin telah dipindahkan atau URL-nya salah.
      </p>
      
      {/* 🚀 Tombol Aksi Utama */}
      <Link 
        to="/" 
        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
      >
        Kembali ke Beranda
      </Link>
      
      {/* 🔍 Opsi Bantuan Kedua */}
      <p className="mt-6 text-sm text-gray-500">
        Atau coba cari sesuatu di halaman beranda.
      </p>
      
    </div>
  );
}

export default NotFoundPage;