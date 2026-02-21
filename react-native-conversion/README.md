# Konversi React Native (Expo) – Edelweiss Mobile Mockup

Folder ini berisi kode yang **siap copy-paste** ke project React Native Expo terpisah. Tampilan dan data sama persis dengan `src/App.jsx` (web).

## Isi folder

| File | Deskripsi |
|------|-----------|
| `theme.js` | Warna brand (edel-blue, edel-pink, edel-purple) dan spacing. Copy ke `src/theme.js`. |
| `data.js` | Semua mock data & helper (HOSPITALS, SPECIALTIES, FAMILY_MEMBERS, MEDICAL_RECORDS, MOCK_LAB_RESULTS, MOCK_DOCTORS, formatCurrency, formatDate). Copy ke `src/data.js`. |
| `MediLokaApp.jsx` | Komponen utama (state, handler, view Home + Modal Profil penuh; view lain placeholder). Copy ke `src/MediLokaApp.jsx`. Import `./theme` dan `./data` dari path yang sama. |
| `App.js.example` | Contoh entry point. Copy isinya ke `App.js` di root project Expo. |

## Langkah copy-paste (di project Expo baru)

### 1. Buat project Expo (jika belum)

```bash
npx create-expo-app@latest edelweiss-mobile-rn --template blank
cd edelweiss-mobile-rn
```

### 2. Pasang dependency

```bash
npx expo install expo-status-bar react-native-safe-area-context
# Opsional: font
npx expo install expo-font @expo-google-fonts/source-sans-pro
```

### 3. Copy file

- **theme.js** → `src/theme.js`
- **data.js** → `src/data.js`
- **MediLokaApp.jsx** → `src/MediLokaApp.jsx` (pastikan import `./theme` dan `./data` mengarah ke file yang sama di folder `src/`)

### 4. Entry point (App.js)

Di `App.js` project Expo:

```javascript
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MediLokaApp from './src/MediLokaApp';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <MediLokaApp />
    </SafeAreaProvider>
  );
}
```

(Jika Anda pakai font Source Sans Pro, load dulu dengan `useFonts` sebelum render `<MediLokaApp />`.)

### 5. Ikon

Kode memakai **`@expo/vector-icons` (Ionicons)**. Sudah termasuk di Expo, tidak perlu install tambahan.

### 6. Jalankan

```bash
npx expo start
```

Lalu scan QR dengan Expo Go, atau tekan `a` untuk Android emulator.

### 7. Build APK (EAS)

```bash
npx expo install eas-cli
npx eas build:configure
npx eas build --platform android --profile preview
```

Di `eas.json` untuk profile `preview`, set `"buildType": "apk"` agar output APK.

---

## Catatan

- **Select / dropdown**: Di RN tidak ada `<select>`. Di kode ini dipakai **Modal + daftar opsi** (Pressable per item). Perilaku sama: pilih satu nilai, state ter-update.
- **Input tanggal**: Dipakai `TextInput` dengan placeholder `YYYY-MM-DD`. Untuk date picker asli bisa tambah `@react-native-community/datetimepicker` nanti.
- **Data & logic**: Semua mock data (HOSPITALS, SPECIALTIES, FAMILY_MEMBERS, MEDICAL_RECORDS, MOCK_LAB_RESULTS, MOCK_DOCTORS) dan handler **tidak diubah**, hanya JSX yang diganti ke View/Text/Pressable/ScrollView/Image/TextInput/Modal.
- **Font**: Untuk tampilan persis web, load **Source Sans Pro** dengan `expo-font` + `@expo-google-fonts/source-sans-pro` dan set di style teks (mis. `fontFamily: 'SourceSansPro_400Regular'`).

---

## View yang sudah lengkap vs placeholder

- **Lengkap**: Home (header, search form, active ticket, layanan digital), Modal Profil (Existing / New User).
- **Placeholder**: Search, Booking, Registration, Profile, Medical Records, Lab Results, Record Detail, Billing, Payment, Payment Success, Success/Ticket Detail. Di placeholder hanya ada header + tombol "Kembali ke Home". Untuk tampilan penuh, konversi JSX dari `src/App.jsx` dengan pola: `div`→`View`, `button`→`Pressable`, `span`/`p`/`h1`→`Text`, `img`→`Image`, `input`→`TextInput`, `select`→`PickerModal` (pakai komponen yang sama seperti di Home).
