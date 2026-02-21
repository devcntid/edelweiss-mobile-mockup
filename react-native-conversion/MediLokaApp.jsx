/**
 * MediLokaApp – Konversi React Native (Expo).
 * Copy ke src/MediLokaApp.jsx. Pastikan theme.js dan data.js sudah di-copy.
 * View Home sudah full; view lain pakai placeholder (ganti dengan isi dari ALL_VIEWS_JSX.jsx jika ada).
 */
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  Pressable,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './theme';
import {
  HOSPITALS,
  SPECIALTIES,
  PAYMENT_METHODS,
  FAMILY_MEMBERS,
  MEDICAL_RECORDS,
  MOCK_LAB_RESULTS,
  MOCK_DOCTORS,
  formatCurrency,
  formatDate,
} from './data';

const ICON = (name, size = 20, color = colors.gray700) => (
  <Ionicons name={name} size={size} color={color} />
);

// --- Picker Modal (gantikan <select> di web) ---
const PickerModal = ({ visible, options, value, onSelect, onClose }) => (
  <Modal visible={visible} transparent animationType="slide">
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      <View style={styles.pickerCard}>
        <ScrollView style={{ maxHeight: 320 }}>
          {options.map((opt) => (
            <Pressable
              key={typeof opt === 'string' ? opt : (opt.id ?? opt.value ?? opt)}
              style={[styles.pickerItem, value === (typeof opt === 'string' ? opt : (opt.name ?? opt.value ?? opt)) && styles.pickerItemActive]}
              onPress={() => { onSelect(typeof opt === 'string' ? opt : (opt.name ?? opt.value ?? opt)); onClose(); }}
            >
              <Text style={[styles.pickerItemText, value === (typeof opt === 'string' ? opt : (opt.name ?? opt.value ?? opt)) && { color: colors.edelBlue, fontWeight: '700' }]}>
                {typeof opt === 'string' ? opt : (opt.name ?? opt.value ?? opt)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Pressable>
  </Modal>
);

// --- BookingCountdown (RN) ---
const BookingCountdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  useEffect(() => {
    const calc = () => {
      const diff = targetDate - new Date();
      if (diff <= 0) return null;
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    setTimeLeft(calc());
    const t = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  if (!timeLeft)
    return (
      <View style={[styles.countdownBox, { backgroundColor: colors.green50, borderColor: colors.green100 }]}>
        {ICON('checkmark-circle', 14, colors.green600)}
        <Text style={[styles.countdownText, { color: colors.green700 }]}>Waktunya Check-in!</Text>
      </View>
    );
  return (
    <View style={[styles.countdownBox, { backgroundColor: colors.blue50, borderColor: colors.blue200 }]}>
      <View style={[styles.countdownDot, { backgroundColor: colors.edelBlue }]} />
      <Text style={[styles.countdownText, { color: colors.edelPurple }]}>
        {timeLeft.days > 0 && `${timeLeft.days} Hari `}
        {timeLeft.hours} Jam {timeLeft.minutes} Menit {timeLeft.seconds} Detik
        <Text style={{ color: colors.gray500, fontWeight: '400' }}> lagi</Text>
      </Text>
    </View>
  );
};

export default function MediLokaApp() {
  const [view, setView] = useState('home');
  const [searchParams, setSearchParams] = useState({
    hospital: 'Semua Rumah Sakit',
    specialty: 'Semua Spesialis',
    doctor: 'Semua Dokter',
    date: new Date(),
  });
  const [patientType, setPatientType] = useState(null);
  const [pendingDoctor, setPendingDoctor] = useState(null);
  const [pendingSchedule, setPendingSchedule] = useState(null);
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].id);
  const [isWaitingList, setIsWaitingList] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [bookingFor, setBookingFor] = useState(FAMILY_MEMBERS[0]);
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  const [familyMembers, setFamilyMembers] = useState(FAMILY_MEMBERS);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('Lainnya');
  const [newMemberNik, setNewMemberNik] = useState('');
  const [newMemberDob, setNewMemberDob] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [registrationFromProfile, setRegistrationFromProfile] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    fullName: '', phone: '', nik: '', dob: '', gender: 'Pria', address: '',
  });
  const [activeBooking, setActiveBooking] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState('pickup');
  const [selectedFamilyMember, setSelectedFamilyMember] = useState(FAMILY_MEMBERS[0]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedLabResult, setSelectedLabResult] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({ period: [], gender: 'all', sort: 'availability' });
  const [isLoading, setIsLoading] = useState(false);
  // Picker state (gantikan select)
  const [showHospitalPicker, setShowHospitalPicker] = useState(false);
  const [showSpecialtyPicker, setShowSpecialtyPicker] = useState(false);
  const [showDoctorPicker, setShowDoctorPicker] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setView('search'); }, 800);
  };

  const handleConfirmBooking = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      const targetDate = new Date(searchParams.date);
      const [h, m] = selectedSchedule.startTime.split(':');
      targetDate.setHours(parseInt(h, 10), parseInt(m, 10), 0);
      if (targetDate < new Date()) targetDate.setDate(targetDate.getDate() + 1);
      setActiveBooking({
        doctor: selectedDoctor,
        schedule: selectedSchedule,
        date: targetDate,
        hospital: searchParams.hospital === 'Semua Rumah Sakit' ? selectedDoctor.hospital : searchParams.hospital,
        bookingCode: 'EDL-' + Math.floor(100000 + Math.random() * 900000),
        queueNo: 'A-' + Math.floor(Math.random() * 20),
        status: 'confirmed',
        patient: bookingFor,
        patientType,
        billing: null,
      });
      setView('success');
    }, 1500);
  };

  const handleSimulateNextStage = () => {
    const next = { confirmed: 'nurse_station', nurse_station: 'doctor_exam', doctor_exam: 'lab_exam', lab_exam: 'doctor_exam_2', doctor_exam_2: 'post_exam' };
    const current = activeBooking?.status;
    if (current === 'doctor_exam_2') {
      const newBilling = {
        consultation: activeBooking.doctor.price,
        admin: 15000,
        treatment: 250000,
        medicine: 185000,
      };
      newBilling.total = newBilling.consultation + newBilling.admin + newBilling.treatment + newBilling.medicine;
      setActiveBooking((prev) => ({ ...prev, status: 'post_exam', billing: newBilling }));
      setView('billing');
    } else if (next[current]) {
      setActiveBooking((prev) => ({ ...prev, status: next[current] }));
    }
  };

  const handleFinalPayment = () => {
    setIsPaying(true);
    setTimeout(() => { setIsPaying(false); setDeliveryOption('pickup'); setView('payment_success'); }, 2000);
  };

  const handleFinishProcess = () => {
    const newRecord = {
      id: Date.now(),
      date: activeBooking.date.toISOString().substr(0, 10),
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
        { name: 'Simulasi Vitamin B', dosage: '1x Sehari', rules: 'Pagi Hari' },
      ],
    };
    MEDICAL_RECORDS['self'].unshift(newRecord);
    setActiveBooking(null);
    setView('home');
  };

  const handleOpenRecordDetail = (record) => {
    setSelectedRecord(record);
    setView('record_detail');
  };

  const toggleFilterPeriod = (p) => {
    setFilters((prev) => ({
      ...prev,
      period: prev.period.includes(p) ? prev.period.filter((x) => x !== p) : [...prev.period, p],
    }));
  };

  const doctorOptionsBySpecialty = useMemo(() => {
    if (searchParams.specialty === 'Semua Spesialis') return ['Semua Dokter'];
    const names = [...new Set(MOCK_DOCTORS.filter((d) => d.specialty === searchParams.specialty).map((d) => d.name))];
    return ['Semua Dokter', ...names.sort()];
  }, [searchParams.specialty]);

  const filteredDoctors = useMemo(() => {
    let docs = MOCK_DOCTORS.filter((doc) => {
      if (searchParams.hospital !== 'Semua Rumah Sakit' && doc.hospital !== searchParams.hospital) return false;
      if (searchParams.specialty !== 'Semua Spesialis' && doc.specialty !== searchParams.specialty) return false;
      if (searchParams.doctor !== 'Semua Dokter' && doc.name !== searchParams.doctor) return false;
      if (filters.gender !== 'all' && doc.gender !== filters.gender) return false;
      if (filters.period.length > 0 && !doc.schedules?.some((s) => filters.period.includes(s.period))) return false;
      return true;
    });
    if (filters.sort === 'availability') docs.sort((a, b) => (b.schedules?.length || 0) - (a.schedules?.length || 0));
    return docs;
  }, [searchParams, filters]);

  const dateStrip = useMemo(() => {
    const out = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(searchParams.date);
      d.setDate(d.getDate() + i);
      out.push(d);
    }
    return out;
  }, [searchParams.date]);

  const totalPaymentAmount = activeBooking?.billing ? activeBooking.billing.total : 0;

  return (
    <View style={styles.root}>
      {/* --- HOME VIEW --- */}
      {view === 'home' && (
        <View style={styles.screen}>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            {/* Header Hero */}
            <View style={[styles.hero, { backgroundColor: colors.edelBlue }]}>
              <View style={styles.heroDeco1} />
              <View style={styles.heroDeco2} />
              <View style={styles.headerRow}>
                <Image
                  source={{ uri: 'https://edelweiss.id/_nuxt/img/9ca7721.png' }}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Pressable style={styles.iconBtn} onPress={() => setShowProfileModal(true)}>
                  {ICON('person', 20, colors.white)}
                </Pressable>
              </View>
              <Text style={styles.heroTitle}>Sehat lebih mudah{'\n'}</Text>
              <Text style={styles.heroSub}>Lebih tenang bersama Edelweiss</Text>
            </View>

            {/* Active Ticket Section - ringkas: hanya tampilkan jika ada activeBooking */}
            {activeBooking && ['confirmed', 'nurse_station', 'doctor_exam', 'lab_exam', 'doctor_exam_2'].includes(activeBooking.status) && (
              <View style={styles.ticketSection}>
                <Pressable style={styles.ticketCard} onPress={() => setView('ticket_detail')}>
                  <View style={[styles.ticketCardHead, { backgroundColor: colors.edelBlue }]}>
                    <Text style={styles.ticketCardHeadText}>Booking Dikonfirmasi</Text>
                    {ICON('checkmark-circle', 18, colors.white)}
                  </View>
                  <View style={styles.ticketCardBody}>
                    <Image
                      source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(activeBooking.bookingCode)}` }}
                      style={styles.qrSmall}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.textXs, { color: colors.edelBlue, fontWeight: '700' }]}>{activeBooking.bookingCode}</Text>
                      <Text style={styles.textSmBold} numberOfLines={1}>{activeBooking.doctor.name}</Text>
                      <Text style={[styles.textXs, { color: colors.edelPink }]}>{activeBooking.doctor.specialty}</Text>
                      <Text style={styles.textXsGray}>
                        {formatDate(new Date(activeBooking.date))} • {activeBooking.schedule.startTime}
                      </Text>
                      <BookingCountdown targetDate={activeBooking.date} />
                    </View>
                  </View>
                  <View style={styles.ticketCardFoot}>
                    <Text style={styles.textXsGray}>{activeBooking.hospital}</Text>
                    <Text style={[styles.textXs, { color: colors.edelBlue, fontWeight: '700' }]}>Buka E-Ticket</Text>
                  </View>
                </Pressable>
                <Pressable style={styles.simulateBtn} onPress={handleSimulateNextStage}>
                  {ICON('medical', 16, colors.white)}
                  <Text style={styles.simulateBtnText}>Simulasi Selesai di Nurse Station</Text>
                </Pressable>
              </View>
            )}

            {activeBooking?.status === 'post_exam' && (
              <Pressable style={styles.unpaidBillCard} onPress={() => setView('billing')}>
                <View style={styles.unpaidBillBadge}>
                  <Text style={styles.unpaidBillBadgeText}>Kasir Rawat Jalan</Text>
                </View>
                <View style={styles.unpaidBillRow}>
                  {ICON('alert-circle', 12, colors.red600)}
                  <Text style={styles.unpaidBillStatus}>Menunggu Pembayaran</Text>
                </View>
                <Text style={styles.unpaidBillTitle}>Tagihan Pemeriksaan</Text>
                <Text style={styles.textXsGray}>{activeBooking.doctor.name}</Text>
                <View style={styles.unpaidBillTotalRow}>
                  <View>
                    <Text style={styles.textXsGray}>Total Tagihan</Text>
                    <Text style={styles.unpaidBillTotal}>{formatCurrency(activeBooking.billing?.total)}</Text>
                  </View>
                  <View style={styles.receiptIcon}>{ICON('receipt', 20, colors.white)}</View>
                </View>
              </Pressable>
            )}

            {/* Search Widget */}
            <View style={[styles.searchCard, activeBooking ? { marginTop: 24 } : { marginTop: -64 }]}>
              <View style={styles.searchRow}>
                <Text style={styles.label}>Lokasi / Rumah Sakit</Text>
                <Pressable style={styles.selectRow} onPress={() => setShowHospitalPicker(true)}>
                  {ICON('location', 20, colors.edelBlue)}
                  <Text style={styles.selectText}>{searchParams.hospital}</Text>
                  {ICON('chevron-down', 16, colors.gray400)}
                </Pressable>
              </View>
              <PickerModal
                visible={showHospitalPicker}
                options={HOSPITALS}
                value={searchParams.hospital}
                onSelect={(v) => setSearchParams((p) => ({ ...p, hospital: v }))}
                onClose={() => setShowHospitalPicker(false)}
              />
              <View style={styles.searchRow}>
                <Text style={styles.label}>Spesialisasi / Poli</Text>
                <Pressable style={[styles.selectRow, { borderBottomColor: colors.edelBlue }]} onPress={() => setShowSpecialtyPicker(true)}>
                  {ICON('medical', 20, colors.edelBlue)}
                  <Text style={styles.selectText}>{searchParams.specialty}</Text>
                  {ICON('chevron-down', 16, colors.gray400)}
                </Pressable>
              </View>
              <PickerModal
                visible={showSpecialtyPicker}
                options={SPECIALTIES}
                value={searchParams.specialty}
                onSelect={(v) => setSearchParams((p) => ({ ...p, specialty: v, doctor: 'Semua Dokter' }))}
                onClose={() => setShowSpecialtyPicker(false)}
              />
              <View style={styles.searchRow}>
                <Text style={styles.label}>Nama Dokter</Text>
                <Pressable style={styles.selectRow} onPress={() => setShowDoctorPicker(true)}>
                  {ICON('person', 20, colors.edelBlue)}
                  <Text style={styles.selectText}>{searchParams.doctor}</Text>
                  {ICON('chevron-down', 16, colors.gray400)}
                </Pressable>
              </View>
              <PickerModal
                visible={showDoctorPicker}
                options={doctorOptionsBySpecialty}
                value={searchParams.doctor}
                onSelect={(v) => setSearchParams((p) => ({ ...p, doctor: v }))}
                onClose={() => setShowDoctorPicker(false)}
              />
              <View style={styles.searchRow}>
                <Text style={styles.label}>Tanggal Periksa</Text>
                <View style={styles.selectRow}>
                  {ICON('calendar', 20, colors.edelBlue)}
                  <TextInput
                    style={styles.selectText}
                    defaultValue={searchParams.date.toISOString().substr(0, 10)}
                    placeholder="YYYY-MM-DD"
                  />
                </View>
              </View>
              <Pressable style={styles.primaryBtn} onPress={handleSearch}>
                {ICON('search', 20, colors.white)}
                <Text style={styles.primaryBtnText}>Cari Dokter</Text>
              </Pressable>
            </View>

            {/* Layanan Digital */}
            {isLoggedIn && (
              <View style={styles.serviceGrid}>
                <Text style={[styles.textBold, { color: colors.edelPurple, marginBottom: 12 }]}>Layanan Digital</Text>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <Pressable style={styles.serviceTile} onPress={() => setView('medical_records')}>
                    <View style={[styles.serviceIcon, { backgroundColor: colors.purple50, borderColor: colors.purple100 }]}>
                      {ICON('pulse', 24, colors.edelPurple)}
                    </View>
                    <Text style={styles.serviceLabel}>Riwayat{'\n'}Kunjungan</Text>
                  </Pressable>
                  <Pressable style={styles.serviceTile} onPress={() => setView('lab_results')}>
                    <View style={[styles.serviceIcon, { backgroundColor: colors.pink50, borderColor: colors.pink100 }]}>
                      {ICON('flask', 24, colors.edelPink)}
                    </View>
                    <Text style={styles.serviceLabel}>Hasil{'\n'}Lab</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Modal Profil */}
      <Modal visible={showProfileModal} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowProfileModal(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.edelPurple }]}>Akun Saya</Text>
              <Pressable onPress={() => setShowProfileModal(false)}>{ICON('close', 20)}</Pressable>
            </View>
            <Text style={styles.textXsGray}>Pilih tipe pengguna untuk simulasi.</Text>
            <Pressable
              style={[styles.profileOption, { borderColor: colors.edelBlue, backgroundColor: colors.blue50 }]}
              onPress={() => {
                setShowProfileModal(false);
                if (!userProfile) setUserProfile({ fullName: 'Budi Santoso (Saya)', phone: '08123456789', nik: '3201012345670001', dob: '1990-01-15', gender: 'Pria', address: 'Jl. Merdeka No. 45, Bandung' });
                setIsLoggedIn(true);
                setView('profile');
              }}
            >
              {ICON('person', 20, colors.edelBlue)}
              <View>
                <Text style={[styles.textSmBold, { color: colors.edelBlue }]}>Simulasi Existing User</Text>
                <Text style={styles.textXsGray}>Data pribadi & kelola anggota keluarga</Text>
              </View>
            </Pressable>
            <Pressable
              style={[styles.profileOption, { borderColor: colors.gray200 }]}
              onPress={() => {
                setShowProfileModal(false);
                setRegistrationFromProfile(true);
                setRegistrationStep(1);
                setOtpSent(false);
                setOtpVerified(false);
                setRegistrationForm({ fullName: '', phone: '', nik: '', dob: '', gender: 'Pria', address: '' });
                setView('registration');
              }}
            >
              {ICON('clipboard', 20)}
              <View>
                <Text style={styles.textSmBold}>Simulasi New User</Text>
                <Text style={styles.textXsGray}>Registrasi pasien baru</Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Placeholder: view lain – ganti blok ini dengan JSX lengkap dari src/App.jsx (div→View, button→Pressable, dll) */}
      {view !== 'home' && (
        <View style={styles.screen}>
          <View style={styles.headerBar}>
            <Pressable
              onPress={() => {
                if (view === 'search') setView('home');
                else if (view === 'booking') setView('search');
                else if (view === 'payment') setView(activeBooking?.billing ? 'billing' : 'booking');
                else setView('home');
              }}
              style={styles.backBtn}
            >
              {ICON('chevron-back', 24)}
            </Pressable>
            <Text style={[styles.headerTitle, { color: colors.edelPurple }]}>{view}</Text>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.textXsGray}>View "{view}" – untuk tampilan penuh, konversi JSX dari src/App.jsx (div→View, button→Pressable, span/p→Text, img→Image, input→TextInput, select→PickerModal).</Text>
            <Pressable style={[styles.primaryBtn, { marginTop: 16 }]} onPress={() => setView('home')}>
              <Text style={styles.primaryBtnText}>Kembali ke Home</Text>
            </Pressable>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  screen: { flex: 1, backgroundColor: colors.white },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40, alignItems: 'center' },
  hero: { padding: 24, paddingBottom: 96, borderBottomLeftRadius: 40, width: '100%', maxWidth: 400, overflow: 'hidden' },
  heroDeco1: { position: 'absolute', top: 0, right: 0, width: 128, height: 128, borderRadius: 64, backgroundColor: 'rgba(255,255,255,0.1)', marginRight: -40, marginTop: -40 },
  heroDeco2: { position: 'absolute', bottom: 0, left: 0, width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(255,255,255,0.1)', marginLeft: -20, marginBottom: -20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  logo: { height: 40, width: 120 },
  iconBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 999 },
  heroTitle: { color: colors.white, fontSize: 28, fontWeight: '700', marginBottom: 8 },
  heroSub: { color: colors.blue100 || '#bfdbfe', fontSize: 14 },
  ticketSection: { marginHorizontal: 20, marginTop: -64, marginBottom: 24, maxWidth: 400 },
  ticketCard: { backgroundColor: colors.white, borderRadius: 16, overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(0,160,220,0.2)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  ticketCardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  ticketCardHeadText: { color: colors.white, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  ticketCardBody: { flexDirection: 'row', padding: 16, gap: 16 },
  qrSmall: { width: 80, height: 80, borderRadius: 8, borderWidth: 1, borderColor: colors.gray200 },
  ticketCardFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.gray50, borderTopWidth: 1, borderTopColor: colors.gray100 },
  simulateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.edelPurple, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, marginTop: 12 },
  simulateBtnText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  unpaidBillCard: { marginHorizontal: 20, marginBottom: 24, padding: 20, backgroundColor: colors.red50, borderRadius: 16, borderWidth: 1, borderColor: colors.red200, maxWidth: 400 },
  unpaidBillBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: colors.red100, paddingHorizontal: 12, paddingVertical: 4, borderBottomLeftRadius: 12, borderWidth: 1, borderLeftColor: colors.red200, borderBottomColor: colors.red200 },
  unpaidBillBadgeText: { fontSize: 10, fontWeight: '700', color: colors.red600 },
  unpaidBillRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  unpaidBillStatus: { fontSize: 10, fontWeight: '700', color: colors.red600 },
  unpaidBillTitle: { fontSize: 18, fontWeight: '700', color: colors.gray800, marginTop: 8 },
  unpaidBillTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.red200 },
  unpaidBillTotal: { fontSize: 22, fontWeight: '700', color: colors.red600 },
  receiptIcon: { backgroundColor: colors.red600, padding: 12, borderRadius: 12 },
  searchCard: { backgroundColor: colors.white, marginHorizontal: 20, marginBottom: 24, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colors.gray100, maxWidth: 400, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  searchRow: { marginBottom: 16 },
  label: { fontSize: 10, color: colors.gray400, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  selectRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: colors.gray100, paddingVertical: 8 },
  selectText: { flex: 1, color: colors.gray700, fontWeight: '600', fontSize: 14 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.edelPink, paddingVertical: 14, marginTop: 24, borderRadius: 12, shadowColor: colors.pink200, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  primaryBtnText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  serviceGrid: { paddingHorizontal: 20, marginBottom: 24, maxWidth: 400, width: '100%' },
  serviceTile: { alignItems: 'center', flex: 1 },
  serviceIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  serviceLabel: { fontSize: 12, fontWeight: '500', color: colors.gray600, textAlign: 'center', marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', padding: 0 },
  modalSheet: { backgroundColor: colors.white, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20, maxWidth: 400, width: '100%', alignSelf: 'center' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  profileOption: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, borderWidth: 2, marginBottom: 12 },
  pickerCard: { backgroundColor: colors.white, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, maxHeight: 320 },
  pickerItem: { paddingVertical: 14, paddingHorizontal: 8 },
  pickerItemActive: { backgroundColor: colors.blue50 },
  pickerItemText: { fontSize: 14, color: colors.gray800 },
  headerBar: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.gray100, gap: 12 },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  countdownBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, padding: 10, borderRadius: 8, borderWidth: 1 },
  countdownText: { fontSize: 12, fontWeight: '700' },
  countdownDot: { width: 8, height: 8, borderRadius: 4 },
  textXs: { fontSize: 12 },
  textXsGray: { fontSize: 12, color: colors.gray500 },
  textSmBold: { fontSize: 14, fontWeight: '700', color: colors.gray800 },
  textBold: { fontSize: 14, fontWeight: '700' },
});
