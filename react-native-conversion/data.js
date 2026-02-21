/**
 * Semua mock data & helper – sama persis dengan src/App.jsx.
 * Copy file ini ke project Expo (mis. src/data.js).
 */

export const HOSPITALS = [
  "Semua Rumah Sakit",
  "RS Edelweiss Bandung",
  "RS Edelweis Cianjur",
  "RS Edelweis Bandung Sentral",
  "RS Edelweis Garut"
];

export const SPECIALTIES = [
  { id: 'all', name: 'Semua Spesialis' },
  { id: 'umum', name: 'Dokter Umum' },
  { id: 'anak', name: 'Spesialis Anak' },
  { id: 'gigi', name: 'Dokter Gigi' },
  { id: 'kandungan', name: 'Kandungan (Obgyn)' },
  { id: 'jantung', name: 'Spesialis Jantung' },
];

export const PAYMENT_METHODS = [
  { id: 'bca', name: 'BCA Virtual Account', type: 'va', icon: 'bank' },
  { id: 'mandiri', name: 'Mandiri Virtual Account', type: 'va', icon: 'bank' },
  { id: 'gopay', name: 'GoPay / QRIS', type: 'ewallet', icon: 'wallet' },
  { id: 'cc', name: 'Kartu Kredit / Debit', type: 'cc', icon: 'card' },
];

export const FAMILY_MEMBERS = [
  { id: 'self', name: 'Budi Santoso (Saya)', relation: 'Self', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi' },
  { id: 'wife', name: 'Siti Aminah', relation: 'Istri', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti' },
  { id: 'child1', name: 'Raka Santoso', relation: 'Anak', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raka' },
];

export const MEDICAL_RECORDS = {
  'self': [
    { id: 101, date: '2023-10-15', type: 'MCU', title: 'Medical Check-Up Tahunan', doctor: 'Dr. Hartono', hospital: 'RS Edelweiss Bandung', status: 'Selesai',
      diagnosis: 'Kondisi kesehatan secara umum baik. Terdapat sedikit peningkatan kadar kolesterol (Dislipidemia ringan).',
      advice: 'Kurangi konsumsi makanan berlemak tinggi, santan, dan gorengan. Disarankan olahraga kardio minimal 30 menit sehari (3-4 kali seminggu).',
      results: 'Tekanan Darah: 120/80 mmHg\nDetak Jantung: 78 bpm\nGula Darah Puasa: 92 mg/dL\nKolesterol Total: 215 mg/dL (Sedikit Tinggi)',
      prescription: [
        { name: 'Simvastatin 10mg', dosage: '1x Sehari (1 Tablet)', rules: 'Diminum malam hari sebelum tidur' },
        { name: 'Vitamin B Complex', dosage: '1x Sehari (1 Tablet)', rules: 'Diminum pagi hari sesudah makan' }
      ]
    },
    { id: 102, date: '2023-08-02', type: 'Rawat Jalan', title: 'Pemeriksaan Gigi Rutin', doctor: 'Dr. Jessica Lim', hospital: 'RS Edelweiss Bandung', status: 'Selesai',
      diagnosis: 'Karies dentis (Gigi berlubang) pada gigi geraham kiri bawah.',
      advice: 'Telah dilakukan penambalan sementara. Hindari mengunyah di sisi kiri selama 24 jam. Jaga kebersihan mulut dengan sikat gigi 2x sehari.',
      results: 'Kondisi gusi sehat. Terdapat 1 lubang gigi sedang (Karies).',
      prescription: [
        { name: 'Asam Mefenamat 500mg', dosage: '3x Sehari (1 Tablet)', rules: 'Diminum jika terasa nyeri saja, sesudah makan' }
      ]
    },
  ],
  'wife': [
    { id: 201, date: '2023-11-20', type: 'Lab', title: 'Tes Darah Lengkap', doctor: 'Laboratorium', hospital: 'RS Edelweiss Bandung', status: 'Selesai',
      diagnosis: 'Nilai hemoglobin (Hb) sedikit di bawah batas normal (Anemia ringan).',
      advice: 'Perbanyak konsumsi sayuran hijau (bayam, brokoli) dan daging merah tanpa lemak. Istirahat yang cukup.',
      results: 'Hemoglobin: 11.2 g/dL (Rendah)\nLeukosit: 6.500 /uL (Normal)\nTrombosit: 250.000 /uL (Normal)',
      prescription: [
        { name: 'Sangobion / Penambah Darah', dosage: '1x Sehari (1 Kapsul)', rules: 'Diminum setelah makan siang' }
      ]
    },
  ],
  'child1': [
    { id: 301, date: '2023-12-05', type: 'Rawat Jalan', title: 'Vaksinasi Influenza', doctor: 'Dr. Sarah Wijaya', hospital: 'RS Edelweiss Bandung', status: 'Selesai',
      diagnosis: 'Kondisi anak sehat, layak untuk diberikan vaksinasi.',
      advice: 'Mungkin akan ada demam ringan pasca vaksin. Kompres dengan air hangat jika anak demam. Berikan obat penurun panas jika suhu > 38 derajat celcius.',
      results: 'Suhu Tubuh: 36.5 C\nBerat Badan: 18 Kg',
      prescription: [
        { name: 'Paracetamol Syrup 120mg/5ml', dosage: '3x Sehari (1 Sendok Takar 5ml)', rules: 'Diminum HANYA jika anak demam atau rewel pasca vaksin' }
      ]
    },
    { id: 302, date: '2023-09-10', type: 'Rawat Jalan', title: 'Demam & Flu', doctor: 'Dr. Sarah Wijaya', hospital: 'RS Edelweiss Bandung', status: 'Selesai',
      diagnosis: 'Common Cold (Infeksi saluran pernapasan atas ringan).',
      advice: 'Banyak minum air putih/susu, istirahat cukup. Jauhkan dari udara dingin langsung.',
      results: 'Suhu Tubuh: 38.2 C\nTenggorokan sedikit kemerahan.',
      prescription: [
        { name: 'Ibuprofen Syrup', dosage: '3x Sehari (5ml)', rules: 'Sesudah makan, hentikan jika demam turun' },
        { name: 'Tremenza Syrup', dosage: '3x Sehari (2.5ml)', rules: 'Sesudah makan, untuk meredakan flu dan hidung tersumbat' }
      ]
    },
  ]
};

export const MOCK_LAB_RESULTS = {
  'self': [
    { id: 'L101', date: '2024-01-15', title: 'Tes Darah Lengkap', type: 'Darah', status: 'Selesai', hospital: 'RS Edelweiss Bandung', doctor: 'Laboratorium', parameters: [{ name: 'Hemoglobin', value: '14.2 g/dL', status: 'Normal' }, { name: 'Leukosit', value: '7.200 /µL', status: 'Normal' }, { name: 'Trombosit', value: '245.000 /µL', status: 'Normal' }, { name: 'Gula Darah Puasa', value: '92 mg/dL', status: 'Normal' }] },
    { id: 'L102', date: '2023-11-20', title: 'Urinalisis', type: 'Urine', status: 'Selesai', hospital: 'RS Edelweiss Bandung', doctor: 'Laboratorium', parameters: [{ name: 'Warna', value: 'Kuning jernih', status: 'Normal' }, { name: 'Protein', value: 'Negatif', status: 'Normal' }, { name: 'Glukosa', value: 'Negatif', status: 'Normal' }] },
  ],
  'wife': [
    { id: 'L201', date: '2023-11-20', title: 'Tes Darah Lengkap', type: 'Darah', status: 'Selesai', hospital: 'RS Edelweiss Bandung', doctor: 'Laboratorium', parameters: [{ name: 'Hemoglobin', value: '11.2 g/dL', status: 'Rendah' }, { name: 'Leukosit', value: '6.500 /µL', status: 'Normal' }] },
  ],
  'child1': [
    { id: 'L301', date: '2023-12-05', title: 'Tes Darah (Pra-Vaksin)', type: 'Darah', status: 'Selesai', hospital: 'RS Edelweiss Bandung', doctor: 'Laboratorium', parameters: [{ name: 'Hb', value: '12.0 g/dL', status: 'Normal' }, { name: 'Trombosit', value: '280.000 /µL', status: 'Normal' }] },
  ],
};

const generateSchedules = (baseId) => {
  const schedules = [];
  const sessionCount = Math.floor(Math.random() * 3) + 1;
  const startHours = [8, 13, 17, 20];
  for (let i = 0; i < sessionCount; i++) {
    const startHour = startHours[Math.floor(Math.random() * startHours.length)];
    if (schedules.some(s => parseInt(s.startTime) === startHour)) continue;
    const capacity = 4;
    const booked = Math.floor(Math.random() * 6);
    schedules.push({
      id: `${baseId}-${i}`,
      startTime: `${startHour < 10 ? '0' + startHour : startHour}:00`,
      endTime: `${startHour + 2 < 10 ? '0' + (startHour + 2) : (startHour + 2)}:00`,
      period: startHour < 12 ? 'Pagi' : startHour < 17 ? 'Siang' : 'Malam',
      capacity,
      booked,
    });
  }
  return schedules.sort((a, b) => parseInt(a.startTime) - parseInt(b.startTime));
};

export const generateDoctors = () => {
  const doctors = [];
  const names = ["Dr. Budi Santoso", "Dr. Sarah Wijaya", "Dr. Andi Pratama", "Dr. Jessica Lim", "Dr. Hartono", "Dr. Rina Kusuma", "Dr. Kevin Susanto", "Dr. Linda Sari"];
  const hospitals = HOSPITALS.slice(1);
  for (let i = 0; i < 20; i++) {
    doctors.push({
      id: i,
      name: names[i % names.length],
      specialty: SPECIALTIES[(i % 5) + 1].name,
      hospital: hospitals[i % hospitals.length],
      price: 150000 + (Math.floor(Math.random() * 5) * 50000),
      rating: (4.0 + Math.random()).toFixed(1),
      experience: Math.floor(Math.random() * 15) + 3,
      gender: i % 3 === 0 ? 'Wanita' : 'Pria',
      schedules: generateSchedules(i),
    });
  }
  return doctors;
};

export const MOCK_DOCTORS = generateDoctors();

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }).format(date);
};
