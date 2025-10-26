# Sistem Laporan Keuangan Warga Komplek PGRI

Aplikasi web untuk pencatatan dan pengelolaan keuangan warga komplek dengan sistem keamanan admin dan integrasi Google Apps Script.

## 🌟 Fitur

- **Keamanan Admin**: Sistem login yang membatasi akses tambah/hapus transaksi
- **Integrasi Cloud**: Data tersimpan di Google Spreadsheet melalui Google Apps Script
- **Laporan Real-time**: Ringkasan keuangan otomatis
- **Export Data**: Export data ke format CSV
- **Responsive Design**: Tampilan yang optimal di desktop dan mobile

## 🚀 Demo

Lihat demo aplikasi di: [Link GitHub Pages Anda]

## 📋 Prasyarat

- Akun Google
- Google Spreadsheet
- Akses internet

## 🔧 Instalasi

### 1. Buat Google Spreadsheet
1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru dengan nama "Laporan Keuangan PGRI"
3. Rename sheet menjadi "Transaksi"
4. Tambahkan header: ID, Tanggal, Keterangan, Jenis, Jumlah
5. Copy ID spreadsheet dari URL

### 2. Setup Google Apps Script
1. Buka [Google Apps Script](https://script.google.com)
2. Buat project baru
3. Paste kode Google Apps Script yang telah disediakan
4. Ganti `SPREADSHEET_ID` dengan ID spreadsheet Anda
5. Jalankan fungsi `setup` untuk membuat sheet dengan header
6. Deploy sebagai Web App dengan akses "Anyone"
7. Copy URL Web App yang dihasilkan

### 3. Konfigurasi Aplikasi
1. Buka aplikasi melalui browser
2. Login sebagai admin (default: username="admin", password="pgri2023")
3. Masukkan URL Web App yang sudah di-deploy
4. Klik "Simpan Konfigurasi"
5. Aplikasi siap digunakan!

## 🛠️ Teknologi

- Frontend: HTML5, CSS3, JavaScript, Bootstrap 5
- Backend: Google Apps Script
- Database: Google Spreadsheet

## 👤 Admin Credentials

Default:
- Username: `admin`
- Password: `pgri2023`

*Catatan: Segera ubah password default untuk keamanan*

## 📄 Lisensi

MIT License

## 🤝 Kontribusi

Kontribusi sangat diperlukan! Silakan fork repository ini dan buat pull request.