export type Language = 'id' | 'en';

export const translations = {
  id: {
    nav: {
      home: 'Beranda',
      about: 'Tentang Kami',
      pathways: 'Jalur Belajar',
      careerFinder: 'Tes Karier IT',
      freeModel: '100% Gratis',
      verify: 'Verifikasi Sertifikat',
      searchPlaceholder: 'Cari jalur, topik, atau materi...',
      signIn: 'Masuk',
      dashboard: 'Dashboard',
      myCertificates: 'Sertifikat Saya',
      signOut: 'Keluar',
    },
    hero: {
      badge: 'DEVORA // PLATFORM BELAJAR IT GRATIS',
      title: 'LEARN. BUILD. PROVE.',
      subtitle: 'Platform edukasi teknologi gratis untuk menguasai keterampilan IT praktis melalui jalur kurikulum bertahap, ujian pemahaman, dan sertifikat yang dapat diverifikasi.',
      startLearning: 'Mulai Belajar Sekarang',
      takeCareerTest: 'Ikuti Tes Rekomendasi Karier (30 Soal)',
      statsPathways: '60 Jalur Kurikulum',
      statsFree: '100% Bebas Biaya',
      statsCerts: 'Sertifikat Terverifikasi',
    },
    freeManifesto: {
      tag: 'KOMITMEN DEVORA // 100% FREE EDUCATION',
      title: 'PENDIDIKAN IT BERKUALITAS, 100% GRATIS',
      desc: 'Kami meyakini akses ke pendidikan teknologi modern harus terbuka untuk siapa saja tanpa hambatan biaya, langganan tersembunyi, atau paywall sertifikat.',
      point1Title: 'Semua Materi Terbuka Penuh',
      point1Desc: 'Tidak ada bab yang dikunci di balik akun berbayar. Semua materi dari dasar hingga arsitektur produksi dapat diakses bebas.',
      point2Title: 'Ujian & Evaluasi Gratis',
      point2Desc: 'Ikuti evaluasi pemahaman bab dan evaluasi kumulatif tanpa biaya pendaftaran maupun biaya ujian ulang.',
      point3Title: 'Sertifikat Resmi Tanpa Biaya',
      point3Desc: 'Unduh sertifikat kelulusan dalam format PDF, PNG, dan JPG lengkap dengan ID verifikasi unik secara cuma-cuma.',
      point4Title: 'Tanpa Kartu Kredit & Tanpa Iklan Intrusif',
      point4Desc: 'Fokus 100% pada pengalaman belajar Anda tanpa meminta informasi pembayaran perbankan.',
    },
    common: {
      previous: 'Sebelumnya',
      next: 'Selanjutnya',
      submit: 'Kumpulkan',
      showHint: 'Tampilkan Petunjuk',
      hideHint: 'Sembunyikan Petunjuk',
      passed: 'LULUS',
      failed: 'BELUM LULUS',
      downloadPdf: 'Unduh PDF',
      downloadPng: 'Unduh PNG',
      downloadJpg: 'Unduh JPG',
      cooldownMsg: 'Jeda percobaan ulang aktif:',
      takeQuiz: 'Mulai Ujian Bab',
      backToPathways: 'Kembali ke Katalog',
      loading: 'Memuat...',
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About Us',
      pathways: 'Pathways',
      careerFinder: 'IT Career Finder',
      freeModel: '100% Free',
      verify: 'Verify Certificate',
      searchPlaceholder: 'Search pathways, topics, or skills...',
      signIn: 'Sign In',
      dashboard: 'Dashboard',
      myCertificates: 'My Certificates',
      signOut: 'Sign Out',
    },
    hero: {
      badge: 'DEVORA // 100% FREE IT LEARNING PLATFORM',
      title: 'LEARN. BUILD. PROVE.',
      subtitle: 'A completely free technology education platform helping learners develop practical IT skills through structured pathways, rigorous assessments, and verifiable credentials.',
      startLearning: 'Start Learning Now',
      takeCareerTest: 'Take Career Path Finder (30 Questions)',
      statsPathways: '60 Curriculum Tracks',
      statsFree: '100% Free Forever',
      statsCerts: 'Verified Credentials',
    },
    freeManifesto: {
      tag: 'DEVORA COMMITMENT // 100% FREE EDUCATION',
      title: 'HIGH-RIGOR IT EDUCATION, 100% FREE',
      desc: 'We believe access to modern computer science and engineering education should be open to all, free from financial barriers, subscriptions, or paywalled certificates.',
      point1Title: 'Fully Open Curriculum',
      point1Desc: 'Zero locked chapters or premium tiers. Every lesson from mental models to production architectures is accessible to everyone.',
      point2Title: 'Free Quizzes & Evaluations',
      point2Desc: 'Complete chapter assessments and milestone checkpoint reviews with zero test or retake fees.',
      point3Title: 'Authoritative Free Certificates',
      point3Desc: 'Download your completion credentials in PDF, PNG, and JPG formats with unique verifiable cryptographic IDs at zero charge.',
      point4Title: 'No Credit Cards, No Ad Tracking',
      point4Desc: 'Pure focus on learning outcomes without requesting financial payment cards.',
    },
    common: {
      previous: 'Previous',
      next: 'Next',
      submit: 'Submit',
      showHint: 'Show Hint',
      hideHint: 'Hide Hint',
      passed: 'PASSED',
      failed: 'NOT PASSED',
      downloadPdf: 'Download PDF',
      downloadPng: 'Download PNG',
      downloadJpg: 'Download JPG',
      cooldownMsg: 'Reattempt cooldown active:',
      takeQuiz: 'Start Chapter Quiz',
      backToPathways: 'Back to Catalog',
      loading: 'Loading...',
    }
  }
};

export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'id';
  return (localStorage.getItem('devora_lang') as Language) || 'id';
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('devora_lang', lang);
  window.dispatchEvent(new Event('devora_language_change'));
}