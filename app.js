// CONFIGURASI BACKEND
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyueCh9xgZrVKDVvynLYv5IkhkxhFvzUBg1MGn1vZO34sR0yeJddNoN6LHZppLpX8QU/exec';

// DATA ADMIN - SANGAT DISARANKAN PASSWORD DICHECK DI BACKEND!
const ADMIN_DATA = {
  email: 'admin@komplek.com',
  password: 'admin123'
};

// =========================== LOGIN HANDLING =============================
function showLoginModal() {
  document.getElementById('loginModal').style.display = 'flex';
  document.getElementById('loginError').textContent = '';
}
function hideLoginModal() {
  document.getElementById('loginModal').style.display = 'none';
}
function isAdmin() {
  return localStorage.getItem('isAdmin') === 'true';
}
function setAdmin(login) {
  localStorage.setItem('isAdmin', login ? 'true' : 'false');
  renderAdminView();
}
function logout() {
  setAdmin(false);
  hideLoginModal();
}
document.getElementById('loginForm').onsubmit = function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value.trim();
  // SANGAT DISARANKAN: cek login ke backend, bukan di frontend!
  if (email === ADMIN_DATA.email && pass === ADMIN_DATA.password) {
    setAdmin(true);
    hideLoginModal();
    this.reset();
  } else {
    document.getElementById('loginError').textContent = 'Email atau password salah!';
  }
};
function renderAdminView() {
  const isAdminLogin = isAdmin();
  document.getElementById('formSection').classList.toggle('hide', !isAdminLogin);
  document.getElementById('btnLogin').classList.toggle('hide', isAdminLogin);
  document.getElementById('btnLogout').classList.toggle('hide', !isAdminLogin);
  document.getElementById('thHapus').classList.toggle('hide', !isAdminLogin);
  renderTransaksiTable();
}

// =========================== FETCH & RENDER DATA =============================
let transaksi = [];
function formatRupiah(angka) {
  return "Rp " + (+angka).toLocaleString('id-ID');
}
function fetchTransaksi() {
  fetch(SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
      transaksi = data || [];
      renderRekap();
      renderTransaksiTable();
    }).catch(() => {
      alert("Gagal mengambil data transaksi!");
    });
}
function renderRekap() {
  let totalPemasukan = 0, totalPengeluaran = 0;
  transaksi.forEach(item => {
    if (item.jenis === 'Pemasukan') totalPemasukan += +item.jumlah;
    else totalPengeluaran += +item.jumlah;
  });
  document.getElementById('saldo').textContent = formatRupiah(totalPemasukan - totalPengeluaran);
  document.getElementById('totalPemasukan').textContent = formatRupiah(totalPemasukan);
  document.getElementById('totalPengeluaran').textContent = formatRupiah(totalPengeluaran);
}
function renderTransaksiTable() {
  const tbody = document.querySelector("#tabelTransaksi tbody");
  tbody.innerHTML = "";
  transaksi.forEach((item, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.tanggal}</td>
      <td>${item.keterangan}</td>
      <td>${item.jenis}</td>
      <td>${formatRupiah(item.jumlah)}</td>
      ${
        isAdmin()
        ? `<td><button class="btn btn-primary" onclick="hapusTransaksi(${item.id})">Hapus</button></td>`
        : `<td class="hide"></td>`
      }
    `;
    tbody.appendChild(tr);
  });
}

// =========================== TAMBAH & HAPUS TRANSAKSI =============================
document.getElementById('transaksiForm').onsubmit = function(e) {
  e.preventDefault();
  if (!isAdmin()) return;
  const tanggal = document.getElementById('tanggal').value;
  const keterangan = document.getElementById('keterangan').value.trim();
  const jenis = document.getElementById('jenis').value;
  const jumlah = parseInt(document.getElementById('jumlah').value) || 0;
  if (!tanggal || !keterangan || !jenis || jumlah <= 0) return alert('Lengkapi data!');
  fetch(SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({ tanggal, keterangan, jenis, jumlah }),
    headers: {'Content-Type': 'application/json'}
  })
  .then(res => res.json())
  .then(res => {
    if(res.status === "sukses") {
      fetchTransaksi();
      this.reset();
    } else {
      alert("Gagal tambah transaksi.");
    }
  });
};

window.hapusTransaksi = function(id) {
  if (!isAdmin() || !confirm("Yakin hapus transaksi ini?")) return;
  fetch(SCRIPT_URL + '?id=' + id, { method: 'DELETE' })
    .then(res => res.json())
    .then(res => {
      if(res.status === "sukses") {
        fetchTransaksi();
      } else {
        alert("Gagal hapus transaksi.");
      }
    });
};

// =========================== INIT =============================
window.onload = function() {
  fetchTransaksi();
  renderAdminView();
};
// klik luar modal untuk tutup
window.onclick = function(e) {
  if (e.target == document.getElementById('loginModal')) hideLoginModal();
};

let editMode = false;
let editId = null;

// Tampilkan data di form saat edit
window.editTransaksi = function(id) {
  const data = transaksi.find(t => t.id == id);
  if (!data) return;
  editMode = true;
  editId = id;
  document.getElementById('tanggal').value = data.tanggal;
  document.getElementById('keterangan').value = data.keterangan;
  document.getElementById('jenis').value = data.jenis;
  document.getElementById('jumlah').value = data.jumlah;
  document.querySelector('#transaksiForm button[type=submit]').textContent = "Simpan Edit";
}

// Reset form setelah tambah/edit
function resetForm() {
  document.getElementById('transaksiForm').reset();
  editMode = false;
  editId = null;
  document.querySelector('#transaksiForm button[type=submit]').textContent = "Tambah";
}

// Ubah submit form
document.getElementById('transaksiForm').onsubmit = function(e) {
  e.preventDefault();
  if (!isAdmin()) return;
  const tanggal = document.getElementById('tanggal').value;
  const keterangan = document.getElementById('keterangan').value.trim();
  const jenis = document.getElementById('jenis').value;
  const jumlah = parseInt(document.getElementById('jumlah').value) || 0;
  if (!tanggal || !keterangan || !jenis || jumlah <= 0) return alert('Lengkapi data!');

  if (editMode && editId !== null) {
    // EDIT TRANSAKSI
    fetch(`${SCRIPT_URL}?id=${editId}`, {
      method: 'PUT',
      body: JSON.stringify({ tanggal, keterangan, jenis, jumlah }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(res => {
      if (res.status === "sukses") {
        fetchTransaksi();
        resetForm();
      } else {
        alert("Gagal edit transaksi.");
      }
    });
  } else {
    // TAMBAH TRANSAKSI
    fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ tanggal, keterangan, jenis, jumlah }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(res => {
      if(res.status === "sukses") {
        fetchTransaksi();
        this.reset();
      } else {
        alert("Gagal tambah transaksi.");
      }
    });
  }
};

// Tambahkan tombol Edit pada render tabel
function renderTransaksiTable() {
  const tbody = document.querySelector("#tabelTransaksi tbody");
  tbody.innerHTML = "";
  transaksi.forEach((item, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.tanggal}</td>
      <td>${item.keterangan}</td>
      <td>${item.jenis}</td>
      <td>${formatRupiah(item.jumlah)}</td>
      ${
        isAdmin()
        ? `<td>
            <button class="btn" onclick="editTransaksi(${item.id})">Edit</button>
            <button class="btn btn-primary" onclick="hapusTransaksi(${item.id})">Hapus</button>
          </td>`
        : `<td class="hide"></td>`
      }
    `;
    tbody.appendChild(tr);
  });
}