'use client';

import React from 'react';

export interface CertificatePreviewProps {
  recipientName: string;
  chapterTitle: string;
  pathwayName: string;
  issueDate: string;
  completionDate?: string;
  certificateNumber: string;
  verificationUrl?: string;
  className?: string;
}

/**
 * Komponen Pratinjau Sertifikat DEVORA
 * Menggunakan rasio asli 1024 x 838 dari template resmi.
 * Menghitung posisi absolut secara proporsional (%) untuk memastikan:
 * 1. Nama penerima TIDAK bertumpuk dengan label PROUDLY PRESENTED TO atau garis emas.
 * 2. Judul program & bab TIDAK bertumpuk dengan deskripsi pengakuan.
 * 3. Tanggal penerbitan tampil rapi di atas label DATE tanpa menimpa elemen lain.
 * 4. Teks panjang secara dinamis mengecilkan ukuran font (*responsive typography*) agar tidak terpotong.
 */
export default function CertificatePreview({
  recipientName,
  chapterTitle,
  pathwayName,
  issueDate,
  completionDate,
  certificateNumber,
  verificationUrl,
  className = ''
}: CertificatePreviewProps) {
  const cleanRecipient = (recipientName || 'DEVORA LEARNER').trim().toUpperCase();
  const cleanChapter = chapterTitle || 'Curriculum Chapter';
  const cleanPathway = pathwayName || 'Learning Pathway';
  const cleanDate = issueDate || new Date().toISOString().split('T')[0];

  // Penyesuaian ukuran font dinamis untuk nama panjang
  const getRecipientFontSize = (len: number) => {
    if (len > 35) return 'text-[9px] sm:text-[11px] md:text-sm lg:text-base';
    if (len > 25) return 'text-[11px] sm:text-xs md:text-base lg:text-lg';
    if (len > 18) return 'text-xs sm:text-sm md:text-lg lg:text-xl';
    return 'text-sm sm:text-base md:text-xl lg:text-2xl';
  };

  return (
    <div className={`relative rounded-xl overflow-hidden border border-yellow-500/30 bg-[#050c1e] aspect-[1024/838] select-none shadow-2xl ${className}`}>
      {/* Background Image Template Asli */}
      <img
        src="/certificates/devora-certificate-template.jpg"
        alt="Devora Certificate Official Template"
        className="w-full h-full object-cover pointer-events-none"
      />

      {/* Layer Overlay Teks Dinamis dengan Posisi Terukur */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 1. Recipient Name Area (Terletak tepat di antara label PROUDLY PRESENTED TO dan Garis Emas) */}
        {/* Pada template 1024x838, label PROUDLY PRESENTED TO berada di y ~36%, garis emas di y ~49% */}
        <div
          className="absolute left-[36%] right-[6%] flex items-center justify-center text-center px-4"
          style={{ top: '38.5%', height: '9.5%' }}
        >
          <span
            className={`font-serif font-bold text-white uppercase tracking-wider drop-shadow-md truncate ${getRecipientFontSize(
              cleanRecipient.length
            )}`}
            title={cleanRecipient}
          >
            {cleanRecipient}
          </span>
        </div>

        {/* 2. Program / Chapter Specifier (Di bawah paragraf apresiasi, di atas garis footer) */}
        {/* Berada di y ~63% - 68% */}
        <div
          className="absolute left-[35%] right-[7%] flex items-center justify-center text-center px-2"
          style={{ top: '63.5%', height: '5.5%' }}
        >
          <p className="text-[7px] sm:text-[9px] md:text-xs font-semibold text-cyan-300 drop-shadow line-clamp-1">
            [ {cleanPathway} — {cleanChapter} ]
          </p>
        </div>

        {/* 3. Issue Date (Tepat di atas garis horizontal dan label DATE di sisi kiri bawah) */}
        {/* Kolom DATE berpusat di x ~47%, y ~76% - 80% */}
        <div
          className="absolute flex items-center justify-center text-center"
          style={{ left: '37%', width: '20%', top: '76%', height: '4%' }}
        >
          <span className="text-[7px] sm:text-[9px] md:text-xs font-mono font-bold text-gray-200 drop-shadow">
            {cleanDate}
          </span>
        </div>

        {/* 4. Certificate ID & Verification Stamp (Di dasar sertifikat) */}
        <div
          className="absolute left-[35%] right-[6%] flex items-center justify-center text-center"
          style={{ bottom: '2%', height: '3.5%' }}
        >
          <span className="text-[6px] sm:text-[7.5px] md:text-[9px] font-mono text-gray-400/90 tracking-wider">
            ID: {certificateNumber} {completionDate && completionDate !== cleanDate ? `| LULUS: ${completionDate}` : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
