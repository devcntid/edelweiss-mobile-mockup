import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  MapPin, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Clock, 
  Stethoscope, 
  User, 
  Star, 
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  X,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Wallet,
  QrCode,
  Building,
  CornerUpRight,
  Activity,
  Pill,
  Microscope,
  Download,
  Car,
  Receipt,
  Truck,
  Home,
  ClipboardList
} from 'lucide-react';

// --- MOCK DATA ---
const HOSPITALS = [
  "Semua Rumah Sakit",
  "RS Edelweiss Bandung",
  "RS Edelweis Cianjur",
  "RS Edelweis Bandung Sentral",
  "RS Edelweis Garut"
];

const SPECIALTIES = [
  { id: 'all', name: 'Semua Spesialis' },
  { id: 'umum', name: 'Dokter Umum' },
  { id: 'anak', name: 'Spesialis Anak' },
  { id: 'gigi', name: 'Dokter Gigi' },
  { id: 'kandungan', name: 'Kandungan (Obgyn)' },
  { id: 'jantung', name: 'Spesialis Jantung' },
];

const PAYMENT_METHODS = [
  { id: 'bca', name: 'BCA Virtual Account', type: 'va', icon: 'bank' },
  { id: 'mandiri', name: 'Mandiri Virtual Account', type: 'va', icon: 'bank' },
  { id: 'gopay', name: 'GoPay / QRIS', type: 'ewallet', icon: 'wallet' },
  { id: 'cc', name: 'Kartu Kredit / Debit', type: 'cc', icon: 'card' },
];

const FAMILY_MEMBERS = [
  { id: 'self', name: 'Budi Santoso (Saya)', relation: 'Self', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi' },
  { id: 'wife', name: 'Siti Aminah', relation: 'Istri', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti' },
  { id: 'child1', name: 'Raka Santoso', relation: 'Anak', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raka' },
];

// MOCK DATA: Diperkaya dengan diagnosa, saran, hasil, dan resep
const MEDICAL_RECORDS = {
  'self': [
    { 
      id: 101, date: '2023-10-15', type: 'MCU', title: 'Medical Check-Up Tahunan', doctor: 'Dr. Hartono', hospital: 'RS Edelweiss Bandung', status: 'Selesai',
      diagnosis: 'Kondisi kesehatan secara umum baik. Terdapat sedikit peningkatan kadar kolesterol (Dislipidemia ringan).',
      advice: 'Kurangi konsumsi makanan berlemak tinggi, santan, dan gorengan. Disarankan olahraga kardio minimal 30 menit sehari (3-4 kali seminggu).',
      results: 'Tekanan Darah: 120/80 mmHg\nDetak Jantung: 78 bpm\nGula Darah Puasa: 92 mg/dL\nKolesterol Total: 215 mg/dL (Sedikit Tinggi)',
      prescription: [
        { name: 'Simvastatin 10mg', dosage: '1x Sehari (1 Tablet)', rules: 'Diminum malam hari sebelum tidur' },
        { name: 'Vitamin B Complex', dosage: '1x Sehari (1 Tablet)', rules: 'Diminum pagi hari sesudah makan' }
      ]
    },
    { 
      id: 102, date: '2023-08-02', type: 'Rawat Jalan', title: 'Pemeriksaan Gigi Rutin', doctor: 'Dr. Jessica Lim', hospital: 'RS Edelweiss Bandung', status: 'Selesai',
      diagnosis: 'Karies dentis (Gigi berlubang) pada gigi geraham kiri bawah.',
      advice: 'Telah dilakukan penambalan sementara. Hindari mengunyah di sisi kiri selama 24 jam. Jaga kebersihan mulut dengan sikat gigi 2x sehari.',
      results: 'Kondisi gusi sehat. Terdapat 1 lubang gigi sedang (Karies).',
      prescription: [
        { name: 'Asam Mefenamat 500mg', dosage: '3x Sehari (1 Tablet)', rules: 'Diminum jika terasa nyeri saja, sesudah makan' }
      ]
    },
  ],
  'wife': [
    { 
      id: 201, date: '2023-11-20', type: 'Lab', title: 'Tes Darah Lengkap', doctor: 'Laboratorium', hospital: 'RS Edelweiss Bandung', status: 'Selesai',
      diagnosis: 'Nilai hemoglobin (Hb) sedikit di bawah batas normal (Anemia ringan).',
      advice: 'Perbanyak konsumsi sayuran hijau (bayam, brokoli) dan daging merah tanpa lemak. Istirahat yang cukup.',
      results: 'Hemoglobin: 11.2 g/dL (Rendah)\nLeukosit: 6.500 /uL (Normal)\nTrombosit: 250.000 /uL (Normal)',
      prescription: [
        { name: 'Sangobion / Penambah Darah', dosage: '1x Sehari (1 Kapsul)', rules: 'Diminum setelah makan siang' }
      ]
    },
  ],
  'child1': [
    { 
      id: 301, date: '2023-12-05', type: 'Rawat Jalan', title: 'Vaksinasi Influenza', doctor: 'Dr. Sarah Wijaya', hospital: 'RS Edelweiss Bandung', status: 'Selesai',
      diagnosis: 'Kondisi anak sehat, layak untuk diberikan vaksinasi.',
      advice: 'Mungkin akan ada demam ringan pasca vaksin. Kompres dengan air hangat jika anak demam. Berikan obat penurun panas jika suhu > 38 derajat celcius.',
      results: 'Suhu Tubuh: 36.5 C\nBerat Badan: 18 Kg',
      prescription: [
        { name: 'Paracetamol Syrup 120mg/5ml', dosage: '3x Sehari (1 Sendok Takar 5ml)', rules: 'Diminum HANYA jika anak demam atau rewel pasca vaksin' }
      ]
    },
    { 
      id: 302, date: '2023-09-10', type: 'Rawat Jalan', title: 'Demam & Flu', doctor: 'Dr. Sarah Wijaya', hospital: 'RS Edelweiss Bandung', status: 'Selesai',
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

// Helper untuk generate jadwal random
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
      startTime: `${startHour < 10 ? '0'+startHour : startHour}:00`,
      endTime: `${startHour+2 < 10 ? '0'+(startHour+2) : (startHour+2)}:00`,
      period: startHour < 12 ? 'Pagi' : startHour < 17 ? 'Siang' : 'Malam',
      capacity: capacity,
      booked: booked, 
    });
  }
  return schedules.sort((a, b) => parseInt(a.startTime) - parseInt(b.startTime));
};

const generateDoctors = () => {
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

const MOCK_DOCTORS = generateDoctors();

// --- HELPERS ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }).format(date);
};

// --- SUB-COMPONENT: COUNTDOWN TIMER ---
const BookingCountdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const diff = targetDate - now;
      
      if (diff <= 0) return null;

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculate());
    const timer = setInterval(() => {
      setTimeLeft(calculate());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return (
    <div className="mt-3 bg-green-50 border border-green-100 rounded-lg p-2.5 flex items-center justify-center gap-2">
       <CheckCircle2 size={14} className="text-green-600" />
       <span className="text-xs font-bold text-green-700">Waktunya Check-in!</span>
    </div>
  );

  return (
    <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-2.5 flex items-center justify-center gap-2 shadow-sm">
       <div className="w-2 h-2 bg-edel-blue rounded-full animate-pulse flex-shrink-0"></div>
       <span className="text-xs font-bold text-edel-purple tabular-nums text-center leading-tight">
          {timeLeft.days > 0 && `${timeLeft.days} Hari `}
          {timeLeft.hours} Jam {timeLeft.minutes} Menit {timeLeft.seconds} Detik
          <span className="font-normal text-gray-500 ml-1">lagi</span>
       </span>
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function MediLokaApp() {
  // views: home, search, booking, payment, success, medical_records, record_detail, ticket_detail, billing, payment_success
  const [view, setView] = useState('home'); 
  const [searchParams, setSearchParams] = useState({
    hospital: 'Semua Rumah Sakit',
    specialty: 'Semua Spesialis',
    doctor: 'Semua Dokter',
    date: new Date(),
  });

  // Pasien Baru vs Pasien Lama (radio: beda wayfinding - pasien baru harus ke admission dulu)
  const [patientType, setPatientType] = useState('returning'); // 'new' | 'returning'

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].id);
  const [isWaitingList, setIsWaitingList] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Booking untuk siapa (diri sendiri / istri / anak / anggota keluarga)
  const [bookingFor, setBookingFor] = useState(FAMILY_MEMBERS[0]);
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  const [familyMembers, setFamilyMembers] = useState(FAMILY_MEMBERS);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('Lainnya');

  // Active Booking State (The "My Ticket")
  const [activeBooking, setActiveBooking] = useState(null);

  // Pharmacy Option State
  const [deliveryOption, setDeliveryOption] = useState('pickup'); // 'pickup' | 'delivery'

  // Medical Records State
  const [selectedFamilyMember, setSelectedFamilyMember] = useState(FAMILY_MEMBERS[0]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Filter State
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    period: [], 
    gender: 'all', 
    sort: 'availability' 
  });

  const [isLoading, setIsLoading] = useState(false);

  // --- LOGIC ---

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setView('search');
    }, 800);
  };

  const handleConfirmBooking = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      
      const targetDate = new Date(searchParams.date);
      const [h, m] = selectedSchedule.startTime.split(':');
      targetDate.setHours(parseInt(h), parseInt(m), 0);

      if (targetDate < new Date()) {
        targetDate.setDate(targetDate.getDate() + 1);
      }

      setActiveBooking({
        doctor: selectedDoctor,
        schedule: selectedSchedule,
        date: targetDate,
        hospital: searchParams.hospital === "Semua Rumah Sakit" ? selectedDoctor.hospital : searchParams.hospital,
        bookingCode: 'EDL-' + Math.floor(100000 + Math.random() * 900000),
        queueNo: 'A-' + Math.floor(Math.random() * 20),
        status: 'confirmed',
        patient: bookingFor,
        patientType,
        billing: null
      });
      setView('success'); 
    }, 1500); 
  };

  const handleSimulatePostExam = (e) => {
    e.stopPropagation(); 
    
    const newBilling = {
      consultation: activeBooking.doctor.price,
      admin: 15000,
      treatment: 250000, 
      medicine: 185000,  
    };
    newBilling.total = newBilling.consultation + newBilling.admin + newBilling.treatment + newBilling.medicine;
    
    setActiveBooking(prev => ({
      ...prev,
      status: 'post_exam', 
      billing: newBilling
    }));
    setView('billing');
  };

  const handleFinalPayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setDeliveryOption('pickup'); // Reset to default when entering success screen
      setView('payment_success');
    }, 2000); 
  };

  const handleFinishProcess = () => {
    // Simulasi memasukkan ke riwayat
    const newRecord = {
      id: Date.now(),
      date: activeBooking.date.toISOString().substr(0,10),
      type: 'Rawat Jalan',
      title: 'Konsultasi ' + activeBooking.doctor.specialty,
      doctor: activeBooking.doctor.name,
      hospital: activeBooking.hospital,
      status: 'Selesai',
      diagnosis: 'Simulasi Diagnosa: Semua parameter terpantau baik. Pasien dalam masa pemulihan.',
      advice: 'Simulasi Saran: Istirahat yang cukup dan habiskan obat yang telah diresepkan oleh dokter.',
      results: 'Simulasi Hasil: Tekanan darah normal. Suhu tubuh stabil.',
      prescription: [
        { name: 'Simulasi Obat A 500mg', dosage: '3x Sehari', rules: 'Sesudah Makan' },
        { name: 'Simulasi Vitamin B', dosage: '1x Sehari', rules: 'Pagi Hari' }
      ]
    };
    
    // Add to top of self records (mutating MOCK state for visual simulation purpose)
    MEDICAL_RECORDS['self'].unshift(newRecord);

    setActiveBooking(null); 
    setView('home');
  };

  const handleOpenRecordDetail = (record) => {
    setSelectedRecord(record);
    setView('record_detail');
  };

  const toggleFilterPeriod = (p) => {
    setFilters(prev => {
      const periods = prev.period.includes(p) 
        ? prev.period.filter(item => item !== p)
        : [...prev.period, p];
      return { ...prev, period: periods };
    });
  };

  // Daftar nama dokter per spesialisasi (untuk dropdown di home)
  const doctorOptionsBySpecialty = useMemo(() => {
    if (searchParams.specialty === 'Semua Spesialis') return ['Semua Dokter'];
    const names = [...new Set(MOCK_DOCTORS.filter(d => d.specialty === searchParams.specialty).map(d => d.name))];
    return ['Semua Dokter', ...names.sort()];
  }, [searchParams.specialty]);

  const filteredDoctors = useMemo(() => {
    let docs = MOCK_DOCTORS.filter(doc => {
      if (searchParams.hospital !== "Semua Rumah Sakit" && doc.hospital !== searchParams.hospital) return false;
      if (searchParams.specialty !== "Semua Spesialis" && doc.specialty !== searchParams.specialty) return false;
      if (searchParams.doctor !== "Semua Dokter" && doc.name !== searchParams.doctor) return false;
      if (filters.gender !== 'all' && doc.gender !== filters.gender) return false;
      if (filters.period.length > 0) {
        const hasMatchingSchedule = doc.schedules.some(sch => filters.period.includes(sch.period));
        if (!hasMatchingSchedule) return false;
      }
      return true;
    });

    if (filters.sort === 'availability') {
      docs.sort((a, b) => (b.schedules?.length || 0) - (a.schedules?.length || 0));
    }

    return docs;
  }, [searchParams, filters]);

  const dateStrip = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(searchParams.date);
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, [searchParams.date]);

  const totalPaymentAmount = activeBooking?.billing ? activeBooking.billing.total : 0;


  // --- STYLES ---
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap');
        
        .bg-edel-blue { background-color: #00A0DC; }
        .text-edel-blue { color: #00A0DC; }
        .border-edel-blue { border-color: #00A0DC; }
        
        .bg-edel-pink { background-color: #ED2B85; }
        .hover-bg-edel-pink:hover { background-color: #C21865; }
        .text-edel-pink { color: #ED2B85; }
        
        .text-edel-purple { color: #5D368A; }
        .bg-edel-purple { background-color: #5D368A; }

        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- HOME VIEW --- */}
      {view === 'home' && (
        <div className="w-full min-h-screen bg-white flex justify-center">
          <div className="w-full max-w-md bg-white shadow-xl min-h-screen flex flex-col relative pb-10">
            
            {/* Header & Hero */}
            <div className="bg-edel-blue p-6 rounded-b-[2.5rem] pb-24 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-5 -mb-5"></div>
              
              <div className="flex justify-between items-center mb-6">
                <div className="p-0">
                   <img 
                    src="https://edelweiss.id/_nuxt/img/9ca7721.png" 
                    alt="Edelweiss Hospital" 
                    className="h-10 object-contain filter brightness-0 invert"
                   />
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full text-white">
                  <User size={20} />
                </div>
              </div>
              
              <h1 className="text-white text-3xl font-bold leading-tight mb-2">
                Sehat lebih mudah<br />
              </h1>
              <p className="text-blue-50 text-sm font-light">Lebih tenang bersama Edelweiss</p>
            </div>

            {/* Pilihan Pasien Baru / Pasien Lama (radio) */}
            <div className="px-5 -mt-16 mb-4 relative z-10">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3 ml-1">Saya adalah</p>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="patientType"
                    value="new"
                    checked={patientType === 'new'}
                    onChange={() => setPatientType('new')}
                    className="w-4 h-4 text-edel-blue border-gray-300 focus:ring-edel-blue"
                  />
                  <span className="text-sm font-semibold text-gray-700">Pasien Baru</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="patientType"
                    value="returning"
                    checked={patientType === 'returning'}
                    onChange={() => setPatientType('returning')}
                    className="w-4 h-4 text-edel-blue border-gray-300 focus:ring-edel-blue"
                  />
                  <span className="text-sm font-semibold text-gray-700">Pasien Lama</span>
                </label>
              </div>
            </div>

            {/* Search Widget */}
            <div className="px-5 mb-6 relative z-10">
              <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
                <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
                  <button className="flex-1 bg-white shadow-sm rounded-lg py-2 text-sm font-bold text-edel-blue text-center">
                    Kunjungan RS
                  </button>
                  <button className="flex-1 py-2 text-sm font-medium text-gray-500 text-center">
                    Telemedicine
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider ml-1">Lokasi / Rumah Sakit</label>
                    <div className="flex items-center mt-1 border-b-2 border-gray-100 group-focus-within:border-edel-blue py-2 transition-colors">
                      <MapPin className="text-edel-blue mr-3" size={20} />
                      <select 
                        className="w-full bg-transparent outline-none text-gray-700 font-semibold appearance-none"
                        value={searchParams.hospital}
                        onChange={(e) => setSearchParams({...searchParams, hospital: e.target.value})}
                      >
                        {HOSPITALS.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider ml-1">Spesialisasi / Poli</label>
                    <div className="flex items-center mt-1 border-b-2 border-edel-blue group-focus-within:border-edel-pink py-2 transition-colors">
                      <Stethoscope className="text-edel-blue mr-3" size={20} />
                      <select 
                        className="w-full bg-transparent outline-none text-gray-700 font-semibold appearance-none"
                        value={searchParams.specialty}
                        onChange={(e) => setSearchParams({...searchParams, specialty: e.target.value, doctor: 'Semua Dokter'})}
                      >
                        {SPECIALTIES.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                      </select>
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider ml-1">Nama Dokter</label>
                    <div className="flex items-center mt-1 border-b-2 border-gray-100 group-focus-within:border-edel-blue py-2 transition-colors">
                      <User className="text-edel-blue mr-3" size={20} />
                      <select 
                        className="w-full bg-transparent outline-none text-gray-700 font-semibold appearance-none"
                        value={searchParams.doctor}
                        onChange={(e) => setSearchParams({...searchParams, doctor: e.target.value})}
                      >
                        {doctorOptionsBySpecialty.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider ml-1">Tanggal Periksa</label>
                    <div className="flex items-center mt-1 border-b-2 border-gray-100 group-focus-within:border-edel-blue py-2 transition-colors">
                      <Calendar className="text-edel-blue mr-3" size={20} />
                      <input 
                        type="date" 
                        className="w-full bg-transparent outline-none text-gray-700 font-semibold"
                        defaultValue={searchParams.date.toISOString().substr(0, 10)}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleSearch}
                  className="w-full mt-6 bg-edel-pink hover-bg-edel-pink text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-200 active:scale-95 transition-transform flex justify-center items-center gap-2"
                >
                  <Search size={20} />
                  Cari Dokter
                </button>
              </div>
            </div>

            {/* ACTIVE TICKET SECTION */}
            {activeBooking && (
              <div className="px-5 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {activeBooking.status === 'confirmed' ? (
                  <>
                    <div className="flex justify-between items-center mb-3">
                       <h3 className="font-bold text-edel-purple">Jadwal Mendatang</h3>
                    </div>
                    
                    <button 
                      onClick={() => setView('ticket_detail')}
                      className="w-full bg-white rounded-t-2xl shadow-lg border border-gray-100 overflow-hidden text-left group transition-all"
                    >
                      {/* Top colored strip with Date & Status */}
                      <div className="bg-blue-50/80 px-4 py-2.5 flex justify-between items-center border-b border-blue-100">
                        <span className="text-xs font-bold text-edel-blue flex items-center gap-1.5">
                          <Calendar size={14} className="text-edel-blue" /> 
                          {formatDate(new Date(activeBooking.date))}
                        </span>
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={10} /> Confirmed
                        </span>
                      </div>

                      <div className="p-4 relative">
                        <div className="flex gap-4 items-center">
                          <div className="bg-white border-2 border-edel-blue/10 rounded-xl p-1 text-center min-w-[75px] flex flex-col justify-center shadow-sm">
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Antrian</span>
                            <span className="text-3xl font-bold text-edel-blue leading-none">{activeBooking.queueNo}</span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 text-lg leading-tight truncate">{activeBooking.doctor.name}</h4>
                            <p className="text-xs text-edel-pink font-bold mt-1 mb-2">{activeBooking.doctor.specialty}</p>
                            <div className="flex items-center gap-3">
                              <p className="text-xs text-gray-500 font-medium flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                                <Clock size={12} className="text-gray-400" /> {activeBooking.schedule.startTime} - {activeBooking.schedule.endTime}
                              </p>
                            </div>
                          </div>
                          <ChevronLeft size={20} className="text-gray-300 rotate-180 flex-shrink-0" />
                        </div>

                        <BookingCountdown targetDate={activeBooking.date} />
                      </div>

                      <div className="px-4 py-3 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                         <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                            <MapPin size={12} className="text-gray-400" />
                            <span className="truncate max-w-[180px]">{activeBooking.hospital}</span>
                         </div>
                         <span className="text-xs font-bold text-edel-blue group-hover:underline">Buka E-Ticket</span>
                      </div>
                    </button>
                    
                    {/* SIMULASI BUTTON (POST EXAM) */}
                    <div className="bg-white border-x border-b border-gray-100 rounded-b-2xl shadow-lg p-3 flex justify-end">
                       <button 
                          onClick={handleSimulatePostExam} 
                          className="text-xs bg-edel-purple hover:bg-[#4A2B6E] text-white px-4 py-2.5 rounded-xl shadow-md font-bold flex items-center gap-2 transition-colors active:scale-95 w-full justify-center"
                        >
                         <Stethoscope size={16} /> Klik Simulasi Selesai Diperiksa
                       </button>
                    </div>
                  </>
                ) : (
                  // CARD UNPAID BILL (Muncul Setelah Simulasi Diperiksa)
                  <button 
                    onClick={() => setView('billing')} 
                    className="w-full bg-red-50 rounded-2xl shadow-lg border border-red-200 overflow-hidden text-left group transition-all hover:shadow-xl hover:-translate-y-1 p-5 relative"
                  >
                    <div className="absolute top-0 right-0 bg-red-100 px-3 py-1 rounded-bl-xl border-b border-l border-red-200">
                       <span className="text-[10px] font-bold text-red-600 uppercase">Kasir Rawat Jalan</span>
                    </div>

                    <div className="flex justify-between items-center mb-3 pt-2">
                       <span className="bg-white border border-red-200 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                         <AlertCircle size={12} /> Menunggu Pembayaran
                       </span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-xl leading-tight">Tagihan Pemeriksaan</h4>
                    <p className="text-xs text-gray-600 mt-1 mb-4 flex items-center gap-1">
                      <User size={12}/> {activeBooking.doctor.name}
                    </p>
                    
                    <div className="flex justify-between items-center border-t border-red-200 pt-4">
                       <div>
                         <span className="text-xs text-gray-600 font-medium block mb-0.5">Total Tagihan</span>
                         <span className="text-2xl font-bold text-red-600">{formatCurrency(activeBooking.billing?.total)}</span>
                       </div>
                       <div className="bg-red-600 text-white p-3 rounded-xl shadow-md group-hover:bg-red-700 transition-colors">
                          <Receipt size={20} />
                       </div>
                    </div>
                  </button>
                )}
              </div>
            )}

            {/* MAIN MENU GRID */}
            <div className="px-5 mb-6">
               <h3 className="font-bold text-edel-purple mb-3">Layanan Digital</h3>
               <div className="grid grid-cols-4 gap-4">
                  <button 
                    onClick={() => setView('medical_records')}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-edel-purple border border-purple-100 group-hover:bg-edel-purple group-hover:text-white transition-colors">
                      <Activity size={24} />
                    </div>
                    <span className="text-xs text-center font-medium text-gray-600 group-hover:text-edel-purple">Rekam<br/>Medis</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-edel-blue border border-blue-100 group-hover:bg-edel-blue group-hover:text-white transition-colors">
                      <Pill size={24} />
                    </div>
                    <span className="text-xs text-center font-medium text-gray-600 group-hover:text-edel-blue">Tebus<br/>Obat</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-edel-pink border border-pink-100 group-hover:bg-edel-pink group-hover:text-white transition-colors">
                      <Microscope size={24} />
                    </div>
                    <span className="text-xs text-center font-medium text-gray-600 group-hover:text-edel-pink">Hasil<br/>Lab</span>
                  </button>
                   <button className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-100 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <Car size={24} />
                    </div>
                    <span className="text-xs text-center font-medium text-gray-600 group-hover:text-orange-500">Ambulans</span>
                  </button>
               </div>
            </div>

            {/* Recent Searches */}
            <div className="px-5">
              <h3 className="font-bold text-edel-purple mb-3">Pencarian Terakhir</h3>
              <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
                <div className="min-w-[140px] bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                  <span className="text-xs text-edel-pink font-bold">Kandungan</span>
                  <p className="text-xs text-gray-500 mt-1">RS Edelweiss Bdg</p>
                  <p className="text-xs text-gray-400">Kemarin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MEDICAL RECORDS VIEW --- */}
      {view === 'medical_records' && (
        <div className="w-full min-h-screen bg-white flex justify-center">
          <div className="w-full max-w-md bg-white min-h-screen flex flex-col relative">
             <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-20 border-b border-gray-100">
              <button onClick={() => setView('home')} className="text-gray-700 hover:bg-gray-100 p-2 rounded-full">
                <ChevronLeft size={24} />
              </button>
              <h2 className="font-bold text-lg text-edel-purple">Rekam Medis</h2>
            </div>

            {/* Family Selector */}
            <div className="p-4 bg-white border-b border-gray-100 overflow-x-auto hide-scrollbar">
              <div className="flex gap-4">
                {FAMILY_MEMBERS.map(member => (
                  <button 
                    key={member.id}
                    onClick={() => setSelectedFamilyMember(member)}
                    className={`flex flex-col items-center gap-2 min-w-[70px] transition-all ${selectedFamilyMember.id === member.id ? 'opacity-100 scale-105' : 'opacity-50 grayscale hover:opacity-80'}`}
                  >
                    <div className={`w-14 h-14 rounded-full p-0.5 ${selectedFamilyMember.id === member.id ? 'bg-gradient-to-tr from-edel-blue to-edel-pink' : 'bg-transparent'}`}>
                       <img src={member.avatar} className="w-full h-full rounded-full border-2 border-white bg-gray-100" />
                    </div>
                    <span className={`text-xs font-bold ${selectedFamilyMember.id === member.id ? 'text-edel-purple' : 'text-gray-500'}`}>{member.relation}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Records List */}
            <div className="p-5 space-y-4 pb-20">
               <div className="flex justify-between items-center">
                 <h3 className="font-bold text-gray-700">Riwayat Kunjungan</h3>
                 <span className="text-xs text-edel-blue font-bold cursor-pointer">Filter Tahun</span>
               </div>
               
               {MEDICAL_RECORDS[selectedFamilyMember.id]?.map((record) => (
                 <button 
                    key={record.id} 
                    onClick={() => handleOpenRecordDetail(record)}
                    className="w-full text-left bg-white rounded-xl p-4 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all hover:border-edel-blue"
                 >
                    <div className={`absolute top-0 left-0 w-1 h-full ${record.type === 'MCU' ? 'bg-green-400' : record.type === 'Lab' ? 'bg-purple-400' : 'bg-edel-blue'}`}></div>
                    
                    <div className="flex justify-between items-start mb-2 pl-2">
                       <div>
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white mb-1 inline-block ${record.type === 'MCU' ? 'bg-green-400' : record.type === 'Lab' ? 'bg-purple-400' : 'bg-edel-blue'}`}>
                           {record.type}
                         </span>
                         <h4 className="font-bold text-gray-800 text-sm group-hover:text-edel-blue transition-colors">{record.title}</h4>
                       </div>
                       <ChevronRight size={20} className="text-gray-400 group-hover:text-edel-blue transition-colors" />
                    </div>
                    
                    <div className="pl-2 space-y-1">
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <Calendar size={12} /> {formatDate(new Date(record.date))}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <User size={12} /> {record.doctor}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <MapPin size={12} /> {record.hospital}
                      </p>
                    </div>

                    <div className="mt-3 pl-2 pt-3 border-t border-gray-50 flex gap-2">
                      <span className="flex-1 bg-blue-50 text-center text-xs text-edel-blue py-2 rounded-lg font-bold transition-colors">
                        Lihat Detail Rekam Medis
                      </span>
                    </div>
                 </button>
               ))}

               {(!MEDICAL_RECORDS[selectedFamilyMember.id] || MEDICAL_RECORDS[selectedFamilyMember.id].length === 0) && (
                 <div className="text-center py-10">
                   <p className="text-gray-400 text-sm">Belum ada riwayat medis.</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* --- RECORD DETAIL VIEW (NEW) --- */}
      {view === 'record_detail' && selectedRecord && (
        <div className="w-full min-h-screen bg-white flex justify-center">
          <div className="w-full max-w-md bg-white min-h-screen flex flex-col relative">
            <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-20 border-b border-gray-100">
              <button onClick={() => setView('medical_records')} className="text-gray-700 hover:bg-gray-100 p-2 rounded-full">
                <ChevronLeft size={24} />
              </button>
              <h2 className="font-bold text-lg text-edel-purple">Detail Rekam Medis</h2>
            </div>
            
            <div className="p-5 overflow-y-auto pb-32">
               {/* Header Summary */}
               <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-100">
                  <div className="flex justify-between items-start mb-2">
                     <span className="bg-edel-blue text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {selectedRecord.type}
                     </span>
                     <span className="text-xs font-semibold text-gray-500">{formatDate(new Date(selectedRecord.date))}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{selectedRecord.title}</h3>
                  <p className="text-sm text-edel-purple font-semibold">{selectedRecord.doctor}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedRecord.hospital}</p>
               </div>

               {/* Detail Sections */}
               <div className="space-y-5">
                  
                  {/* Diagnosa */}
                  <div>
                     <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-2">
                       <Stethoscope size={16} className="text-edel-pink" /> Diagnosa Utama
                     </h4>
                     <div className="bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-700 leading-relaxed shadow-sm">
                       {selectedRecord.diagnosis}
                     </div>
                  </div>

                  {/* Hasil Pemeriksaan */}
                  <div>
                     <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-2">
                       <Activity size={16} className="text-edel-blue" /> Hasil Pemeriksaan Klinis
                     </h4>
                     <div className="bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-700 leading-relaxed shadow-sm whitespace-pre-line">
                       {selectedRecord.results}
                     </div>
                  </div>

                  {/* Saran Dokter */}
                  <div>
                     <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-2">
                       <ClipboardList size={16} className="text-orange-500" /> Saran Dokter (Edukasi)
                     </h4>
                     <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-sm text-gray-700 leading-relaxed">
                       {selectedRecord.advice}
                     </div>
                  </div>

                  {/* Resep Obat */}
                  {selectedRecord.prescription && selectedRecord.prescription.length > 0 && (
                    <div>
                       <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-2">
                         <Pill size={16} className="text-green-500" /> Resep Obat
                       </h4>
                       <div className="space-y-3">
                         {selectedRecord.prescription.map((med, idx) => (
                           <div key={idx} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex gap-3 items-start">
                             <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                               <Pill size={18} />
                             </div>
                             <div>
                               <p className="font-bold text-gray-800 text-sm">{med.name}</p>
                               <div className="flex flex-wrap gap-2 mt-1">
                                 <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                   Dosis: {med.dosage}
                                 </span>
                                 <span className="bg-blue-50 text-edel-blue text-[10px] font-bold px-2 py-0.5 rounded-md">
                                   Aturan: {med.rules}
                                 </span>
                               </div>
                             </div>
                           </div>
                         ))}
                       </div>
                    </div>
                  )}

               </div>
            </div>
            
            <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
               <button className="w-full bg-white border border-edel-blue text-edel-blue hover:bg-blue-50 font-bold py-3.5 rounded-xl transition-all flex justify-center items-center gap-2">
                 <Download size={18} /> Unduh Resume Medis (PDF)
               </button>
            </div>
          </div>
        </div>
      )}

      {/* --- RESULT VIEW (CARI DOKTER) --- */}
      {view === 'search' && (
        <div className="w-full min-h-screen bg-white flex justify-center">
          <div className="w-full max-w-md bg-gray-100 min-h-screen flex flex-col relative pb-20">
             <div className="bg-edel-blue sticky top-0 z-30 shadow-md">
              <div className="px-4 py-3 flex items-center gap-3">
                <button onClick={() => setView('home')} className="text-white p-1 hover:bg-white/10 rounded-full">
                  <ChevronLeft size={24} />
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-white font-bold text-base leading-tight">
                    {searchParams.hospital === "Semua Rumah Sakit" ? "Bandung" : "Pilihan RS"} 
                    <ArrowRight size={14} /> 
                    {searchParams.specialty === "Semua Spesialis" ? "Dokter" : searchParams.specialty}
                  </div>
                  <div className="text-blue-100 text-xs">
                    {formatDate(searchParams.date)}
                    {searchParams.doctor !== 'Semua Dokter' && ` • ${searchParams.doctor}`}
                  </div>
                </div>
                <button className="text-white p-2">
                  <Search size={20} />
                </button>
              </div>

              {/* Date Strip */}
              <div className="flex overflow-x-auto hide-scrollbar bg-[#0090C5] pt-2 pb-2 px-2 gap-2">
                {dateStrip.map((date, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSearchParams({...searchParams, date: date})}
                    className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-all ${
                      date.getDate() === searchParams.date.getDate() 
                      ? 'bg-white text-edel-blue ring-2 ring-edel-pink z-10 scale-105 shadow-md' 
                      : 'bg-white/10 text-blue-100 hover:bg-white/20'
                    }`}
                  >
                    <span className="text-[10px] font-medium uppercase">{new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(date)}</span>
                    <span className="text-lg font-bold leading-none">{date.getDate()}</span>
                    <span className={`text-[9px] mt-1 font-semibold ${idx % 3 === 0 ? 'text-[#a6e84d]' : 'text-orange-200'}`}>
                     {idx % 3 === 0 ? 'Ada Slot' : 'Terbatas'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Filters */}
            <div className="bg-white px-4 py-3 border-b flex gap-2 overflow-x-auto hide-scrollbar">
              <button 
                onClick={() => setShowFilterModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 border border-edel-blue text-edel-blue rounded-full text-xs font-semibold bg-blue-50 whitespace-nowrap"
              >
                <Filter size={12} /> Filter Lengkap
              </button>
              {/* Active Filter Chips */}
              {filters.period.map(p => (
                 <button key={p} className="px-3 py-1.5 border border-edel-purple text-edel-purple bg-purple-50 rounded-full text-xs font-semibold whitespace-nowrap">
                   {p}
                 </button>
              ))}
            </div>

            {/* Doctor List */}
            <div className="p-4 space-y-4">
              {isLoading ? (
                 <div className="text-center py-10 text-gray-400 animate-pulse">Memuat Jadwal...</div>
              ) : filteredDoctors.length === 0 ? (
                 <div className="text-center py-20">
                   <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-edel-purple">
                     <Stethoscope size={32} />
                   </div>
                   <h3 className="text-gray-600 font-bold">Tidak ada dokter ditemukan</h3>
                 </div>
              ) : (
                filteredDoctors.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative group">
                    <div className="p-4 flex gap-4 border-b border-gray-50">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-14 h-14 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.name}&backgroundColor=b6e3f4`} 
                            alt="Doctor" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm text-edel-blue">
                          <ShieldCheck size={12} />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                           <div>
                             <h3 className="font-bold text-edel-purple leading-tight">{doc.name}</h3>
                             <p className="text-xs text-edel-blue font-bold mt-0.5">{doc.specialty}</p>
                           </div>
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <MapPin size={10} /> {doc.hospital}
                        </p>
                        
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex items-center gap-1 text-xs text-orange-400 font-bold">
                            <Star size={12} fill="currentColor" /> {doc.rating}
                          </div>
                          <span className="text-xs text-gray-400">{doc.experience} Thn Pengalaman</span>
                        </div>
                      </div>
                    </div>

                    {/* SCHEDULE HEATMAP */}
                    <div className="bg-gray-50 p-3">
                      <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Pilih Jadwal Praktek</p>
                      <div className="flex flex-wrap gap-2">
                        {doc.schedules.map((sch) => {
                          let bgClass = "bg-green-100 border-green-200 text-green-700 hover:bg-green-200";
                          let statusText = "Tersedia";
                          
                          if (sch.booked >= 4) {
                            bgClass = "bg-red-50 border-red-100 text-red-600 hover:bg-red-100";
                            statusText = "Waiting List";
                          } else if (sch.booked >= 2) {
                            bgClass = "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100";
                            statusText = "Hampir Penuh";
                          }

                          return (
                            <button 
                              key={sch.id}
                              onClick={() => {
                                setIsWaitingList(sch.booked >= 4);
                                setSelectedDoctor(doc);
                                setSelectedSchedule(sch);
                                setView('booking');
                              }}
                              className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg border transition-all ${bgClass}`}
                            >
                              <span className="text-xs font-bold">{sch.startTime}</span>
                              <span className="text-[9px] opacity-80">{statusText}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
            
            {/* --- FILTER MODAL (RESTORED) --- */}
            {showFilterModal && (
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 animate-in slide-in-from-bottom duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-edel-purple">Filter Pencarian</h3>
                    <button onClick={() => setShowFilterModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Waktu Praktek */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-2">Waktu Praktek</h4>
                      <div className="flex gap-2">
                        {['Pagi', 'Siang', 'Malam'].map(p => (
                          <button
                            key={p}
                            onClick={() => toggleFilterPeriod(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold border ${filters.period.includes(p) ? 'bg-edel-blue text-white border-edel-blue' : 'bg-white text-gray-600 border-gray-200'}`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-2">Gender Dokter</h4>
                      <div className="flex gap-2">
                         <button onClick={() => setFilters({...filters, gender: 'all'})} className={`flex-1 py-2 rounded-lg text-sm font-semibold border ${filters.gender === 'all' ? 'bg-edel-pink text-white border-edel-pink' : 'border-gray-200 text-gray-600'}`}>Semua</button>
                         <button onClick={() => setFilters({...filters, gender: 'Pria'})} className={`flex-1 py-2 rounded-lg text-sm font-semibold border ${filters.gender === 'Pria' ? 'bg-edel-pink text-white border-edel-pink' : 'border-gray-200 text-gray-600'}`}>Pria</button>
                         <button onClick={() => setFilters({...filters, gender: 'Wanita'})} className={`flex-1 py-2 rounded-lg text-sm font-semibold border ${filters.gender === 'Wanita' ? 'bg-edel-pink text-white border-edel-pink' : 'border-gray-200 text-gray-600'}`}>Wanita</button>
                      </div>
                    </div>

                    {/* Urutkan */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-2">Urutkan</h4>
                      <select 
                        value={filters.sort}
                        onChange={(e) => setFilters({...filters, sort: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-edel-blue"
                      >
                        <option value="availability">Ketersediaan Terbanyak</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowFilterModal(false)}
                    className="w-full mt-6 bg-edel-blue text-white font-bold py-3 rounded-xl hover:bg-[#0090C5]"
                  >
                    Terapkan Filter
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- BOOKING CONFIRMATION --- */}
      {view === 'booking' && selectedDoctor && selectedSchedule && (
        <div className="w-full min-h-screen bg-white flex justify-center">
          <div className="w-full max-w-md bg-white min-h-screen flex flex-col relative">
            <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-20 border-b border-gray-100">
              <button onClick={() => setView('search')} className="text-gray-700 hover:bg-gray-100 p-2 rounded-full">
                <ChevronLeft size={24} />
              </button>
              <h2 className="font-bold text-lg text-edel-purple">Konfirmasi Pesanan</h2>
            </div>
            
            {/* Content Confirmation */}
             <div className="p-5 overflow-y-auto pb-32">
                {/* Doctor Summary & Patient Form */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
                  <div className="flex gap-4 border-b border-gray-100 pb-4 mb-4">
                      <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedDoctor.name}&backgroundColor=b6e3f4`} 
                          alt="Doctor" 
                          className="w-12 h-12 bg-gray-100 rounded-full"
                        />
                        <div>
                          <h4 className="font-bold text-edel-purple">{selectedDoctor.name}</h4>
                          <p className="text-xs text-edel-blue font-semibold">{selectedDoctor.specialty}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Tanggal</label>
                        <p className="text-sm font-bold text-gray-700">{formatDate(searchParams.date)}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Jam Praktek</label>
                        <p className="text-sm font-bold text-gray-700">{selectedSchedule.startTime} - {selectedSchedule.endTime}</p>
                      </div>
                    </div>
                </div>

                {/* Booking untuk siapa */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Booking untuk siapa?</h3>
                  <div className="space-y-2">
                    {familyMembers.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => setBookingFor(member)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${bookingFor?.id === member.id ? 'border-edel-blue bg-blue-50' : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'}`}
                      >
                        <img src={member.avatar} alt="" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-sm">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.relation}</p>
                        </div>
                        {bookingFor?.id === member.id && (
                          <div className="w-5 h-5 rounded-full bg-edel-blue flex items-center justify-center">
                            <CheckCircle2 size={12} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowAddFamilyModal(true)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-edel-blue hover:text-edel-blue transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <span className="font-medium text-sm">Tambah anggota keluarga / profil</span>
                    </button>
                  </div>
                </div>
             </div>

            <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <button 
                onClick={handleConfirmBooking}
                disabled={isPaying}
                className={`w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${isWaitingList ? 'bg-orange-500 shadow-orange-200 hover:bg-orange-600' : 'bg-edel-pink shadow-pink-200 hover-bg-edel-pink'}`}
              >
                {isPaying ? 'Memproses...' : (isWaitingList ? 'Masuk Waiting List' : 'Konfirmasi (Bayar Pasca Periksa)')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Anggota Keluarga */}
      {showAddFamilyModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-edel-purple">Tambah Profil Pasien</h3>
              <button onClick={() => { setShowAddFamilyModal(false); setNewMemberName(''); setNewMemberRelation('Lainnya'); }} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 font-semibold block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzi"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 outline-none focus:border-edel-blue"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-semibold block mb-1">Hubungan</label>
                <select
                  value={newMemberRelation}
                  onChange={(e) => setNewMemberRelation(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none focus:border-edel-blue bg-white"
                >
                  <option value="Diri Sendiri">Diri Sendiri</option>
                  <option value="Istri">Istri</option>
                  <option value="Suami">Suami</option>
                  <option value="Anak">Anak</option>
                  <option value="Orang Tua">Orang Tua</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => {
                if (!newMemberName.trim()) return;
                const id = 'custom-' + Date.now();
                const member = {
                  id,
                  name: newMemberName.trim(),
                  relation: newMemberRelation,
                  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newMemberName.trim())}`,
                };
                setFamilyMembers((prev) => [...prev, member]);
                setBookingFor(member);
                setShowAddFamilyModal(false);
                setNewMemberName('');
                setNewMemberRelation('Lainnya');
              }}
              disabled={!newMemberName.trim()}
              className="w-full mt-6 bg-edel-pink hover:bg-edel-pink text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Simpan Profil
            </button>
          </div>
        </div>
      )}

      {/* --- BILLING VIEW (POST-EXAM UNPAID BILL) --- */}
      {view === 'billing' && activeBooking && activeBooking.billing && (
        <div className="w-full min-h-screen bg-white flex justify-center">
          <div className="w-full max-w-md bg-white min-h-screen flex flex-col relative">
            <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-20 border-b border-gray-100">
              <button onClick={() => setView('home')} className="text-gray-700 hover:bg-gray-100 p-2 rounded-full">
                <ChevronLeft size={24} />
              </button>
              <h2 className="font-bold text-lg text-edel-purple">Kasir Rawat Jalan</h2>
            </div>
            
            <div className="p-5 overflow-y-auto pb-32">
               
               <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex gap-3 items-start">
                 <AlertCircle className="text-edel-blue flex-shrink-0 mt-0.5" size={20} />
                 <p className="text-xs text-blue-800 font-medium leading-relaxed">
                   Pemeriksaan telah selesai. Silakan selesaikan pembayaran tagihan di bawah ini sebelum mengambil opsi farmasi.
                 </p>
               </div>

               {/* Bill Details */}
               <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6 overflow-hidden">
                 <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">Rincian Tagihan</h3>
                    <span className="text-[10px] font-bold text-gray-400">#INV-889021</span>
                 </div>
                 <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Konsultasi Dokter</p>
                        <p className="text-xs text-gray-500">{activeBooking.doctor.name}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-700">{formatCurrency(activeBooking.billing.consultation)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Tindakan Medis</p>
                        <p className="text-xs text-gray-500">Pemeriksaan Lanjutan</p>
                      </div>
                      <span className="text-sm font-bold text-gray-700">{formatCurrency(activeBooking.billing.treatment)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Instalasi Farmasi</p>
                        <p className="text-xs text-gray-500">Sesuai Resep Dokter</p>
                      </div>
                      <span className="text-sm font-bold text-gray-700">{formatCurrency(activeBooking.billing.medicine)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold text-gray-800">Biaya Administrasi</p>
                      <span className="text-sm font-bold text-gray-700">{formatCurrency(activeBooking.billing.admin)}</span>
                    </div>
                 </div>

                 <div className="bg-red-50 px-4 py-4 border-t border-red-100 flex justify-between items-center">
                    <span className="font-bold text-red-800">Total Pembayaran</span>
                    <span className="text-xl font-bold text-red-600">{formatCurrency(activeBooking.billing.total)}</span>
                 </div>
               </div>
            </div>

            <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <button 
                onClick={() => setView('payment')}
                className="w-full bg-edel-blue hover:bg-[#0090C5] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
              >
                Pilih Metode Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PAYMENT VIEW --- */}
      {view === 'payment' && (
        <div className="w-full min-h-screen bg-white flex justify-center">
          <div className="w-full max-w-md bg-white min-h-screen flex flex-col relative">
            <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-20 border-b border-gray-100">
              <button onClick={() => setView(activeBooking?.billing ? 'billing' : 'booking')} className="text-gray-700 hover:bg-gray-100 p-2 rounded-full">
                <ChevronLeft size={24} />
              </button>
              <h2 className="font-bold text-lg text-edel-purple">Pembayaran</h2>
            </div>

            <div className="p-5 overflow-y-auto pb-32">
               {/* Timer */}
               <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex justify-between items-center mb-6">
                  <span className="text-xs text-orange-700 font-semibold">Selesaikan pembayaran dalam</span>
                  <div className="flex items-center gap-1 text-orange-600 font-bold font-mono">
                    <Clock size={16} /> 14:59
                  </div>
               </div>

               {/* Total */}
               <div className="mb-6">
                 <p className="text-gray-500 text-sm">Total Pembayaran</p>
                 <h2 className="text-3xl font-bold text-edel-blue">{formatCurrency(totalPaymentAmount)}</h2>
               </div>

               {/* Methods */}
               <h3 className="font-bold text-gray-800 mb-3">Pilih Metode Pembayaran</h3>
               <div className="space-y-3">
                 {PAYMENT_METHODS.map((method) => (
                   <div 
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${selectedPayment === method.id ? 'border-edel-blue bg-blue-50 ring-1 ring-edel-blue' : 'border-gray-200 hover:bg-gray-50'}`}
                   >
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedPayment === method.id ? 'bg-edel-blue text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {method.icon === 'card' ? <CreditCard size={20} /> : method.icon === 'wallet' ? <Wallet size={20} /> : <Building size={20} />}
                     </div>
                     <div className="flex-1">
                       <p className="font-bold text-gray-800 text-sm">{method.name}</p>
                       <p className="text-xs text-gray-500">Proses otomatis</p>
                     </div>
                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === method.id ? 'border-edel-blue' : 'border-gray-300'}`}>
                        {selectedPayment === method.id && <div className="w-2.5 h-2.5 bg-edel-blue rounded-full"></div>}
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Pay Button */}
            <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <button 
                onClick={handleFinalPayment}
                disabled={isPaying}
                className="w-full bg-edel-blue hover:bg-[#0090C5] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
              >
                {isPaying ? 'Memproses...' : 'Bayar Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PAYMENT SUCCESS VIEW & PHARMACY DELIVERY (POST-EXAM SUCCESS) --- */}
      {view === 'payment_success' && activeBooking && (
        <div className="w-full min-h-screen bg-white flex justify-center">
          <div className="w-full max-w-md bg-white min-h-screen flex flex-col relative pb-20">
            
            <div className="p-6 text-center border-b border-gray-100 bg-white shadow-sm z-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                 <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Pembayaran Lunas!</h2>
              <p className="text-gray-500 text-xs">Terima kasih telah menyelesaikan tagihan rawat jalan.</p>
            </div>

            <div className="p-5 flex-1 bg-gray-50">
              <h3 className="font-bold text-edel-purple flex items-center gap-2 mb-4">
                 <Pill size={18} /> Opsi Pengambilan Obat Farmasi
              </h3>

              {/* Delivery / Pickup Toggles */}
              <div className="flex bg-white rounded-xl p-1 mb-5 border border-gray-200 shadow-sm">
                <button 
                   onClick={() => setDeliveryOption('pickup')}
                   className={`flex-1 py-2.5 text-sm font-bold text-center rounded-lg transition-colors ${deliveryOption === 'pickup' ? 'bg-edel-blue text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Ambil di Farmasi RS
                </button>
                <button 
                   onClick={() => setDeliveryOption('delivery')}
                   className={`flex-1 py-2.5 text-sm font-bold text-center rounded-lg transition-colors ${deliveryOption === 'delivery' ? 'bg-edel-blue text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Kirim ke Rumah
                </button>
              </div>

              {/* Pickup Content */}
              {deliveryOption === 'pickup' && (
                <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm animate-in fade-in duration-300">
                   <p className="text-sm text-gray-700 leading-relaxed mb-4">
                     Silakan menuju <span className="font-bold text-edel-blue">Instalasi Farmasi Rawat Jalan</span> untuk mengambil obat sesuai resep dokter Anda. Tunjukkan layar ini atau nama Anda ke petugas.
                   </p>
                   <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-4">
                      <div className="bg-white text-edel-blue p-3 rounded-xl shadow-sm">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <p className="text-xs text-blue-800 font-medium">Lokasi Farmasi</p>
                        <p className="text-base font-bold text-edel-blue">Lantai 1 - Wing A</p>
                      </div>
                   </div>
                </div>
              )}

              {/* Delivery Content */}
              {deliveryOption === 'delivery' && (
                <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm animate-in fade-in duration-300">
                   <div className="flex gap-3 items-start mb-4">
                     <Truck className="text-edel-pink mt-1" size={20} />
                     <div>
                       <h4 className="font-bold text-gray-800 text-sm">Pengiriman ke Alamat Terdaftar</h4>
                       <p className="text-xs text-gray-500 mt-1">Obat akan diracik dan dikirimkan oleh kurir kami hari ini. Bebas biaya antar untuk jarak {'<'} 10 KM.</p>
                     </div>
                   </div>
                   
                   <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2 border-b border-gray-200 pb-2">
                        <Home size={14} className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-700">Rumah (Budi Santoso)</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Jl. Merdeka No. 45, RT 01/RW 02, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40111
                      </p>
                   </div>
                   <button className="text-xs text-edel-blue font-bold mt-3">Ubah Alamat Pengiriman</button>
                </div>
              )}
            </div>

            <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
               <button 
                onClick={handleFinishProcess}
                className="w-full bg-edel-pink hover:bg-[#C21865] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all"
              >
                Selesai & Lihat Riwayat Medis
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- INITIAL BOOKING SUCCESS & TICKET DETAIL VIEW --- */}
      {(view === 'success' || view === 'ticket_detail') && activeBooking && (
        <div className="w-full min-h-screen bg-white flex justify-center">
          <div className="w-full max-w-md bg-edel-blue min-h-screen flex flex-col relative pb-10">
            
            {/* Header Success / Ticket */}
            <div className="p-6 text-center text-white pt-10">
              {view === 'success' && (
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                   <CheckCircle2 size={32} className="text-white" />
                </div>
              )}
              {view === 'ticket_detail' && (
                <button onClick={() => setView('home')} className="absolute left-6 top-10 p-2 bg-white/20 rounded-full">
                  <ChevronLeft size={24} />
                </button>
              )}
              <h2 className="text-2xl font-bold">{view === 'success' ? 'Booking Berhasil!' : 'E-Ticket Antrian'}</h2>
              <p className="text-blue-100 text-sm mt-1">{view === 'success' ? 'Simpan tiket ini untuk check-in.' : 'Tunjukkan QR Code saat Check-in'}</p>
            </div>

            {/* THE TICKET CARD */}
            <div className="px-5 flex-1">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                
                {/* Top Section: QR & Number */}
                <div className="p-6 text-center border-b border-dashed border-gray-300 relative">
                  <div className="absolute -left-3 bottom-[-12px] w-6 h-6 bg-edel-blue rounded-full"></div>
                  <div className="absolute -right-3 bottom-[-12px] w-6 h-6 bg-edel-blue rounded-full"></div>
                  
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nomor Antrian</p>
                  <h1 className="text-5xl font-bold text-edel-pink mb-4">{activeBooking.queueNo}</h1>
                  <div className="bg-gray-100 p-3 rounded-xl inline-block border-2 border-dashed border-gray-300">
                    <QrCode size={120} className="text-gray-800" />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">Kode Booking: {activeBooking.bookingCode}</p>
                </div>

                {/* Middle Section: Details */}
                <div className="p-6 bg-gray-50">
                   {activeBooking.patient && (
                     <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                       <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Booking untuk</p>
                       <p className="font-bold text-gray-800">{activeBooking.patient.name}</p>
                       <p className="text-xs text-gray-500">{activeBooking.patient.relation}</p>
                     </div>
                   )}
                   <div className="flex gap-4 mb-4">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeBooking.doctor.name}&backgroundColor=b6e3f4`} 
                        alt="Doctor" 
                        className="w-14 h-14 bg-white rounded-full border border-gray-200"
                      />
                      <div>
                        <h3 className="font-bold text-gray-800">{activeBooking.doctor.name}</h3>
                        <p className="text-xs text-edel-blue font-bold">{activeBooking.doctor.specialty}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Calendar size={12}/> {formatDate(new Date(activeBooking.date))} • {activeBooking.schedule.startTime}
                        </p>
                      </div>
                   </div>
                </div>

                {/* Bottom Section: Wayfinding (pasien baru: wajib ke Admission dulu; pasien lama: tidak) */}
                <div className="bg-white p-6 border-t border-gray-100">
                   <h3 className="text-sm font-bold text-edel-purple mb-6 flex items-center gap-2">
                     <MapPin size={16} /> Alur Pasien (Wayfinding)
                   </h3>
                   
                   {/* Step 0: Parkir */}
                   <div className="flex gap-4 mb-6 relative">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold z-10 border border-gray-200">
                          <Car size={14} />
                        </div>
                        <div className="w-0.5 flex-1 bg-gray-200 my-1"></div>
                      </div>
                      <div className="flex-1 pb-2">
                        <h4 className="text-xs font-bold text-gray-700">Kedatangan & Parkir</h4>
                        <p className="text-xs text-gray-500 mt-1">Gunakan <span className="font-bold text-gray-700">Lobby Selatan</span> untuk akses parkir VIP atau Valet agar lebih dekat.</p>
                      </div>
                   </div>

                   {/* Step khusus Pasien Baru: Loket Pendaftaran (Admission) */}
                   {activeBooking.patientType === 'new' && (
                     <div className="flex gap-4 mb-6 relative">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold z-10 shadow-md ring-4 ring-amber-50">1</div>
                          <div className="w-0.5 flex-1 bg-gray-200 my-1"></div>
                        </div>
                        <div className="flex-1 pb-2">
                          <h4 className="text-xs font-bold text-amber-700">Loket Pendaftaran (Admission)</h4>
                          <p className="text-xs text-gray-500 mt-1">Pasien baru wajib datang ke <span className="font-bold text-amber-700">Loket Pendaftaran / Admission Counter</span> di Lobby Utama terlebih dahulu untuk registrasi data pasien sebelum check-in.</p>
                        </div>
                     </div>
                   )}

                   {/* Check In (Kiosk) - step 1 pasien lama, step 2 pasien baru */}
                   <div className="flex gap-4 mb-6 relative">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-edel-blue text-white flex items-center justify-center text-xs font-bold z-10 shadow-md ring-4 ring-blue-50">{activeBooking.patientType === 'new' ? '2' : '1'}</div>
                        <div className="w-0.5 flex-1 bg-gray-200 my-1"></div>
                      </div>
                      <div className="flex-1 pb-2">
                        <h4 className="text-xs font-bold text-edel-blue">Self Check-in (Kiosk)</h4>
                        <p className="text-xs text-gray-500 mt-1">Scan QR Code di atas pada mesin Anjungan Mandiri (APM) di Lobby Utama untuk cetak struk antrian.</p>
                      </div>
                   </div>

                   {/* Nurse Station */}
                   <div className="flex gap-4 mb-6 relative">
                      <div className="flex flex-col items-center">
                         <div className="w-8 h-8 rounded-full bg-edel-pink text-white flex items-center justify-center text-xs font-bold z-10 shadow-md ring-4 ring-pink-50">{activeBooking.patientType === 'new' ? '3' : '2'}</div>
                         <div className="w-0.5 flex-1 bg-gray-200 my-1"></div>
                      </div>
                      <div className="flex-1 pb-2">
                        <h4 className="text-xs font-bold text-edel-pink">Nurse Station (Tensi)</h4>
                        <p className="text-xs text-gray-500 mt-1">Menuju <span className="font-bold">Lantai 2, Wing B</span>. Serahkan struk ke perawat untuk pemeriksaan awal.</p>
                      </div>
                   </div>

                    {/* Ruang Dokter */}
                   <div className="flex gap-4 relative">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-edel-purple text-white flex items-center justify-center text-xs font-bold z-10 shadow-md ring-4 ring-purple-50">{activeBooking.patientType === 'new' ? '4' : '3'}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-edel-purple">Ruang Dokter</h4>
                        <div className="mt-2 bg-gray-50 rounded-xl p-3 border border-gray-200">
                          <div className="flex items-start gap-2 mb-2">
                             <CornerUpRight size={16} className="text-edel-purple mt-0.5" />
                             <p className="text-xs text-gray-600">
                               Dari Nurse Station, belok kanan. Ruangan ada di ujung koridor sebelah kiri.
                             </p>
                          </div>
                          <div className="relative h-28 rounded-lg overflow-hidden group cursor-pointer">
                             <img 
                               src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400" 
                               alt="Lokasi Poli"
                               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2">
                               <span className="text-white text-[10px] font-bold">Poli {activeBooking.doctor.specialty} - Ruang 204</span>
                             </div>
                          </div>
                        </div>
                      </div>
                   </div>

                </div>
              </div>

              {view === 'success' && (
                <button 
                  onClick={() => setView('home')}
                  className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-3 rounded-xl border border-white/30 mb-6"
                >
                  Kembali ke Beranda
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}