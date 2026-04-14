/* ===================================
   SIPARES - Admin Module (Async/PHP)
   =================================== */

const AdminModule = {
  currentSection: 'verify',

  getSidebarItems() {
    return `
      <div class="sidebar-nav-label">Menu Utama</div>
      <div class="sidebar-nav-item ${this.currentSection === 'verify' ? 'active' : ''}" onclick="AdminModule.navigate('verify')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
        Verifikasi Pembayaran
      </div>
      <div class="sidebar-nav-item ${this.currentSection === 'jadwal' ? 'active' : ''}" onclick="AdminModule.navigate('jadwal')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
        Jadwal & Tugas
      </div>
      <div class="sidebar-nav-item ${this.currentSection === 'warga' ? 'active' : ''}" onclick="AdminModule.navigate('warga')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Manajemen Warga
      </div>
      <div class="sidebar-nav-item ${this.currentSection === 'petugas-manage' ? 'active' : ''}" onclick="AdminModule.navigate('petugas-manage')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 19a6 6 0 0 0-12 0"/><circle cx="8" cy="9" r="4"/><path d="M22 19a6 6 0 0 0-6-6"/><circle cx="19" cy="9" r="4" fill="none"/></svg>
        Manajemen Petugas
      </div>
      <div class="sidebar-nav-item ${this.currentSection === 'laporan' ? 'active' : ''}" onclick="AdminModule.navigate('laporan')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
        Laporan Transaksi
      </div>
      <div class="sidebar-nav-item ${this.currentSection === 'settings' ? 'active' : ''}" onclick="AdminModule.navigate('settings')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        Pengaturan
      </div>
    `;
  },

  navigate(section) {
    this.currentSection = section;
    App.renderDashboard();
  },

  async renderContent() {
    switch (this.currentSection) {
      case 'verify': return await this.renderVerify();
      case 'jadwal': return await this.renderJadwal();
      case 'warga': return await this.renderWarga();
      case 'petugas-manage': return await this.renderPetugasManage();
      case 'laporan': return await this.renderLaporan();
      case 'settings': return await this.renderSettings();
      default: return await this.renderVerify();
    }
  },

  // ── VERIFIKASI PEMBAYARAN ──
  async renderVerify() {
    const allTrx = await DataStore.getTransactions();
    const pending = allTrx.filter(t => t.status === 'pending');
    const verified = allTrx.filter(t => t.status === 'verified');
    const rejected = allTrx.filter(t => t.status === 'rejected');

    const rows = pending.length > 0 ? pending.map(t => `
      <tr>
        <td style="font-weight:600; color:var(--text-primary)">${t.id}</td>
        <td>${t.user_name}</td>
        <td>${t.bulan}</td>
        <td style="font-weight:700; color:var(--emerald-400)">${DataStore.formatCurrency(t.jumlah)}</td>
        <td>${DataStore.formatDate(t.tanggal)}</td>
        <td><span class="badge badge-warning">Menunggu</span></td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-sm btn-primary" onclick="AdminModule.viewProof(${t.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              Lihat Bukti
            </button>
          </div>
        </td>
      </tr>
    `).join('') : '';

    return `
      <div class="stats-grid fade-in">
        <div class="stat-card yellow">
          <div class="stat-card-header">
            <span class="stat-card-label">Menunggu Verifikasi</span>
            <div class="stat-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
          </div>
          <div class="stat-card-value">${pending.length}</div>
          <div class="stat-card-desc">pembayaran perlu diverifikasi</div>
        </div>
        <div class="stat-card green">
          <div class="stat-card-header">
            <span class="stat-card-label">Terverifikasi</span>
            <div class="stat-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
          </div>
          <div class="stat-card-value">${verified.length}</div>
          <div class="stat-card-desc">pembayaran sudah diverifikasi</div>
        </div>
        <div class="stat-card red">
          <div class="stat-card-header">
            <span class="stat-card-label">Ditolak</span>
            <div class="stat-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
            </div>
          </div>
          <div class="stat-card-value">${rejected.length}</div>
          <div class="stat-card-desc">pembayaran ditolak</div>
        </div>
      </div>

      <div class="card fade-in">
        <div class="card-header">
          <h3>Daftar Pembayaran Menunggu Verifikasi</h3>
        </div>
        <div class="card-body" style="padding:0;">
          ${pending.length > 0 ? `
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Warga</th>
                  <th>Periode</th>
                  <th>Jumlah</th>
                  <th>Tanggal Bayar</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>` : `
          <div class="empty-state">
            <div style="font-size:3rem; margin-bottom:16px;">✅</div>
            <h4>Semua Pembayaran Terverifikasi</h4>
            <p>Tidak ada pembayaran yang menunggu verifikasi saat ini</p>
          </div>`}
        </div>
      </div>
    `;
  },

  async viewProof(trxId) {
    const allTrx = await DataStore.getTransactions();
    const trx = allTrx.find(t => t.id == trxId);
    if (!trx) return;

    const proofImg = trx.bukti
      ? `<img src="${trx.bukti}" class="proof-image" alt="Bukti Pembayaran">`
      : `<div style="padding:48px; text-align:center; background:var(--bg-glass); border-radius:var(--radius-md); margin:16px 0;">
           <div style="font-size:3rem; margin-bottom:12px;">🧾</div>
           <p style="color:var(--text-muted); font-size:0.88rem;">Bukti pembayaran telah diupload oleh warga</p>
         </div>`;

    App.showModal('Verifikasi Pembayaran', `
      <div class="proof-viewer">
        ${proofImg}
        <div class="proof-details">
          <div class="detail-row">
            <span class="detail-label">ID Transaksi</span>
            <span class="detail-value">${trx.id}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Nama Warga</span>
            <span class="detail-value">${trx.user_name}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Periode</span>
            <span class="detail-value">${trx.bulan}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Jumlah</span>
            <span class="detail-value" style="color:var(--emerald-400)">${DataStore.formatCurrency(trx.jumlah)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Tanggal Bayar</span>
            <span class="detail-value">${DataStore.formatDate(trx.tanggal)}</span>
          </div>
        </div>
      </div>
    `, `
      <button class="btn btn-danger" onclick="AdminModule.rejectPayment(${trx.id})">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
        Tolak
      </button>
      <button class="btn btn-success" onclick="AdminModule.approvePayment(${trx.id})">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
        Setujui
      </button>
    `);
  },

  async approvePayment(trxId) {
    const result = await DataStore.updateTransaction(trxId, { status: 'verified' });
    App.closeModal();
    if (result.success) {
      App.showToast('Pembayaran berhasil disetujui!', 'success');
    } else {
      App.showToast(result.message || 'Gagal memverifikasi', 'error');
    }
    this.navigate('verify');
  },

  async rejectPayment(trxId) {
    const result = await DataStore.updateTransaction(trxId, { status: 'rejected' });
    App.closeModal();
    if (result.success) {
      App.showToast('Pembayaran ditolak.', 'error');
    } else {
      App.showToast(result.message || 'Gagal menolak', 'error');
    }
    this.navigate('verify');
  },

  // ── MANAJEMEN WARGA ──
  async renderWarga() {
    const users = await DataStore.getUsers();
    const rows = users.map(u => `
      <tr>
        <td style="font-weight:600; color:var(--text-primary)">${u.id}</td>
        <td style="font-weight:600; color:var(--text-primary)">${u.nama}</td>
        <td>${u.phone || '-'}</td>
        <td>RT ${u.rt || '-'} / RW ${u.rw || '-'}</td>
        <td>${u.alamat || '-'}</td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-sm btn-outline" onclick="AdminModule.editWarga(${u.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              Edit
            </button>
            <button class="btn btn-sm btn-danger" onclick="AdminModule.deleteWarga(${u.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              Hapus
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    return `
      <div class="card fade-in">
        <div class="card-header">
          <h3>Data Warga (${users.length})</h3>
          <button class="btn btn-primary btn-sm" onclick="AdminModule.addWargaModal()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Tambah Warga
          </button>
        </div>
        <div class="card-body" style="padding:0;">
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama</th>
                  <th>No. HP</th>
                  <th>RT/RW</th>
                  <th>Alamat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  addWargaModal() {
    App.showModal('Tambah Warga Baru', `
      <form id="form-warga" onsubmit="AdminModule.saveWarga(event)">
        <div class="form-group">
          <label class="form-label">Nama Lengkap</label>
          <input type="text" class="form-input" id="warga-nama" placeholder="Masukkan nama lengkap" required>
        </div>
        <div class="form-group">
          <label class="form-label">Username</label>
          <input type="text" class="form-input" id="warga-username" placeholder="Username untuk login" required>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" class="form-input" id="warga-password" placeholder="Password" required>
        </div>
        <div class="form-group">
          <label class="form-label">No. Handphone</label>
          <input type="tel" class="form-input" id="warga-phone" placeholder="08xxxxxxxxxx" required>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div class="form-group">
            <label class="form-label">RT</label>
            <input type="text" class="form-input" id="warga-rt" placeholder="01" required>
          </div>
          <div class="form-group">
            <label class="form-label">RW</label>
            <input type="text" class="form-input" id="warga-rw" placeholder="05" required>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Alamat</label>
          <input type="text" class="form-input" id="warga-alamat" placeholder="Jl. ..." required>
        </div>
      </form>
    `, `
      <button class="btn btn-outline" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="document.getElementById('form-warga').requestSubmit()">Simpan</button>
    `);
  },

  async saveWarga(e) {
    e.preventDefault();
    const result = await DataStore.addUser({
      nama: document.getElementById('warga-nama').value,
      username: document.getElementById('warga-username').value,
      password: document.getElementById('warga-password').value,
      phone: document.getElementById('warga-phone').value,
      rt: document.getElementById('warga-rt').value,
      rw: document.getElementById('warga-rw').value,
      alamat: document.getElementById('warga-alamat').value,
      role: 'user'
    });
    App.closeModal();
    if (result.success) {
      App.showToast('Warga berhasil ditambahkan!', 'success');
    } else {
      App.showToast(result.message || 'Gagal menambahkan warga', 'error');
    }
    this.navigate('warga');
  },

  async editWarga(id) {
    const user = await DataStore.getUserById(id);
    if (!user) return;

    App.showModal('Edit Data Warga', `
      <form id="form-edit-warga" onsubmit="AdminModule.updateWarga(event, ${id})">
        <div class="form-group">
          <label class="form-label">Nama Lengkap</label>
          <input type="text" class="form-input" id="edit-warga-nama" value="${user.nama}" required>
        </div>
        <div class="form-group">
          <label class="form-label">No. Handphone</label>
          <input type="tel" class="form-input" id="edit-warga-phone" value="${user.phone || ''}" required>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div class="form-group">
            <label class="form-label">RT</label>
            <input type="text" class="form-input" id="edit-warga-rt" value="${user.rt || ''}" required>
          </div>
          <div class="form-group">
            <label class="form-label">RW</label>
            <input type="text" class="form-input" id="edit-warga-rw" value="${user.rw || ''}" required>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Alamat</label>
          <input type="text" class="form-input" id="edit-warga-alamat" value="${user.alamat || ''}" required>
        </div>
      </form>
    `, `
      <button class="btn btn-outline" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="document.getElementById('form-edit-warga').requestSubmit()">Simpan Perubahan</button>
    `);
  },

  async updateWarga(e, id) {
    e.preventDefault();
    const result = await DataStore.updateUser(id, {
      nama: document.getElementById('edit-warga-nama').value,
      phone: document.getElementById('edit-warga-phone').value,
      rt: document.getElementById('edit-warga-rt').value,
      rw: document.getElementById('edit-warga-rw').value,
      alamat: document.getElementById('edit-warga-alamat').value,
    });
    App.closeModal();
    if (result.success) {
      App.showToast('Data warga berhasil diperbarui!', 'success');
    } else {
      App.showToast(result.message || 'Gagal memperbarui', 'error');
    }
    this.navigate('warga');
  },

  async deleteWarga(id) {
    const user = await DataStore.getUserById(id);
    if (!user) return;

    App.showModal('Konfirmasi Hapus', `
      <div style="text-align:center; padding:16px 0;">
        <div style="font-size:3rem; margin-bottom:12px;">⚠️</div>
        <p style="font-size:0.95rem; margin-bottom:8px;">Apakah Anda yakin ingin menghapus data warga:</p>
        <p style="font-weight:700; font-size:1.1rem; color:var(--text-primary)">${user.nama}</p>
        <p style="color:var(--text-muted); font-size:0.85rem; margin-top:8px;">Tindakan ini tidak dapat dibatalkan</p>
      </div>
    `, `
      <button class="btn btn-outline" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-danger" onclick="AdminModule.confirmDeleteWarga(${id})">Hapus</button>
    `);
  },

  async confirmDeleteWarga(id) {
    const result = await DataStore.deleteUser(id);
    App.closeModal();
    if (result.success) {
      App.showToast('Data warga berhasil dihapus.', 'success');
    } else {
      App.showToast(result.message || 'Gagal menghapus', 'error');
    }
    this.navigate('warga');
  },

  // ── MANAJEMEN PETUGAS ──
  async renderPetugasManage() {
    const petugasList = await DataStore.getPetugas();
    const rows = petugasList.map(p => `
      <tr>
        <td style="font-weight:600; color:var(--text-primary)">${p.id}</td>
        <td style="font-weight:600; color:var(--text-primary)">${p.nama}</td>
        <td>${p.phone || '-'}</td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-sm btn-outline" onclick="AdminModule.editPetugas(${p.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              Edit
            </button>
            <button class="btn btn-sm btn-danger" onclick="AdminModule.deletePetugas(${p.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              Hapus
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    return `
      <div class="card fade-in">
        <div class="card-header">
          <h3>Data Petugas Kebersihan (${petugasList.length})</h3>
          <button class="btn btn-primary btn-sm" onclick="AdminModule.addPetugasModal()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Tambah Petugas
          </button>
        </div>
        <div class="card-body" style="padding:0;">
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama</th>
                  <th>No. HP</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  addPetugasModal() {
    App.showModal('Tambah Petugas Baru', `
      <form id="form-petugas" onsubmit="AdminModule.savePetugas(event)">
        <div class="form-group">
          <label class="form-label">Nama Lengkap</label>
          <input type="text" class="form-input" id="petugas-nama" placeholder="Masukkan nama lengkap" required>
        </div>
        <div class="form-group">
          <label class="form-label">Username</label>
          <input type="text" class="form-input" id="petugas-username" placeholder="Username untuk login" required>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" class="form-input" id="petugas-password" placeholder="Password" required>
        </div>
        <div class="form-group">
          <label class="form-label">No. Handphone</label>
          <input type="tel" class="form-input" id="petugas-phone" placeholder="08xxxxxxxxxx" required>
        </div>
      </form>
    `, `
      <button class="btn btn-outline" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="document.getElementById('form-petugas').requestSubmit()">Simpan</button>
    `);
  },

  async savePetugas(e) {
    e.preventDefault();
    const result = await DataStore.addUser({
      nama: document.getElementById('petugas-nama').value,
      username: document.getElementById('petugas-username').value,
      password: document.getElementById('petugas-password').value,
      phone: document.getElementById('petugas-phone').value,
      role: 'petugas'
    });
    App.closeModal();
    if (result.success) {
      App.showToast('Petugas berhasil ditambahkan!', 'success');
    } else {
      App.showToast(result.message || 'Gagal menambahkan petugas', 'error');
    }
    this.navigate('petugas-manage');
  },

  async editPetugas(id) {
    const p = await DataStore.getUserById(id);
    if (!p) return;

    App.showModal('Edit Data Petugas', `
      <form id="form-edit-petugas" onsubmit="AdminModule.updatePetugas(event, ${id})">
        <div class="form-group">
          <label class="form-label">Nama Lengkap</label>
          <input type="text" class="form-input" id="edit-petugas-nama" value="${p.nama}" required>
        </div>
        <div class="form-group">
          <label class="form-label">No. Handphone</label>
          <input type="tel" class="form-input" id="edit-petugas-phone" value="${p.phone || ''}" required>
        </div>
      </form>
    `, `
      <button class="btn btn-outline" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="document.getElementById('form-edit-petugas').requestSubmit()">Simpan Perubahan</button>
    `);
  },

  async updatePetugas(e, id) {
    e.preventDefault();
    const result = await DataStore.updateUser(id, {
      nama: document.getElementById('edit-petugas-nama').value,
      phone: document.getElementById('edit-petugas-phone').value,
    });
    App.closeModal();
    if (result.success) {
      App.showToast('Data petugas berhasil diperbarui!', 'success');
    } else {
      App.showToast(result.message || 'Gagal memperbarui', 'error');
    }
    this.navigate('petugas-manage');
  },

  async deletePetugas(id) {
    const p = await DataStore.getUserById(id);
    if (!p) return;

    App.showModal('Konfirmasi Hapus', `
      <div style="text-align:center; padding:16px 0;">
        <div style="font-size:3rem; margin-bottom:12px;">⚠️</div>
        <p style="font-size:0.95rem; margin-bottom:8px;">Apakah Anda yakin ingin menghapus data petugas:</p>
        <p style="font-weight:700; font-size:1.1rem; color:var(--text-primary)">${p.nama}</p>
        <p style="color:var(--text-muted); font-size:0.85rem; margin-top:8px;">Tindakan ini tidak dapat dibatalkan</p>
      </div>
    `, `
      <button class="btn btn-outline" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-danger" onclick="AdminModule.confirmDeletePetugas(${id})">Hapus</button>
    `);
  },

  async confirmDeletePetugas(id) {
    const result = await DataStore.deleteUser(id);
    App.closeModal();
    if (result.success) {
      App.showToast('Data petugas berhasil dihapus.', 'success');
    } else {
      App.showToast(result.message || 'Gagal menghapus', 'error');
    }
    this.navigate('petugas-manage');
  },

  // ── LAPORAN TRANSAKSI ──
  async renderLaporan() {
    const statusFilter = this._filterStatus || 'all';
    const filters = {};
    if (statusFilter !== 'all') filters.status = statusFilter;

    const allTrx = await DataStore.getTransactions(filters);

    const statusBadge = (status) => {
      const map = {
        'verified': '<span class="badge badge-success">Terverifikasi</span>',
        'pending': '<span class="badge badge-warning">Menunggu</span>',
        'rejected': '<span class="badge badge-danger">Ditolak</span>',
      };
      return map[status] || status;
    };

    const rows = allTrx.map(t => `
      <tr>
        <td style="font-weight:600; color:var(--text-primary)">${t.id}</td>
        <td>${t.user_name}</td>
        <td>${t.bulan}</td>
        <td style="font-weight:600; color:var(--emerald-400)">${DataStore.formatCurrency(t.jumlah)}</td>
        <td>${DataStore.formatDate(t.tanggal)}</td>
        <td>${statusBadge(t.status)}</td>
      </tr>
    `).join('');

    return `
      <div class="card fade-in">
        <div class="card-header">
          <h3>Semua Transaksi (${allTrx.length})</h3>
          <div class="filter-bar">
            <select class="form-select" onchange="AdminModule._filterStatus=this.value; AdminModule.navigate('laporan')">
              <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>Semua Status</option>
              <option value="pending" ${statusFilter === 'pending' ? 'selected' : ''}>Menunggu</option>
              <option value="verified" ${statusFilter === 'verified' ? 'selected' : ''}>Terverifikasi</option>
              <option value="rejected" ${statusFilter === 'rejected' ? 'selected' : ''}>Ditolak</option>
            </select>
          </div>
        </div>
        <div class="card-body" style="padding:0;">
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Warga</th>
                  <th>Periode</th>
                  <th>Jumlah</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  // ── JADWAL & TUGAS ──
  async renderJadwal() {
    const jadwal = await DataStore.getJadwal();
    
    // submitted tasks waiting for verification
    const submitted = jadwal.filter(j => j.status === 'submitted');
    const allOthers = jadwal.filter(j => j.status !== 'submitted');

    const statusBadge = (s) => {
      if (s === 'verified') return '<span class="badge badge-success">Selesai (Distujui)</span>';
      if (s === 'submitted') return '<span class="badge badge-warning">Menunggu Validasi</span>';
      if (s === 'rejected') return '<span class="badge badge-danger">Ditolak</span>';
      return '<span class="badge badge-info">Belum Dikerjakan</span>';
    };

    const submittedRows = submitted.length > 0 ? submitted.map(j => `
      <tr>
        <td style="font-weight:600; color:var(--text-primary)">${DataStore.formatDate(j.tanggal)}</td>
        <td>${j.completed_by_name || '-'}</td>
        <td>${j.bukti ? j.bukti.length : 0} lampiran</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="AdminModule.viewTaskProof(${j.id})">
            Validasi
          </button>
        </td>
      </tr>
    `).join('') : `<tr><td colspan="4" style="text-align:center; color:var(--text-muted)">Tidak ada tugas yang menunggu verifikasi</td></tr>`;

    const otherRows = allOthers.map(j => `
      <tr>
        <td style="font-weight:600; color:var(--text-primary)">${DataStore.formatDate(j.tanggal)}</td>
        <td>${statusBadge(j.status)}</td>
        <td>${j.completed_by_name || '-'}</td>
      </tr>
    `).join('');

    return `
      <div class="card fade-in mb-3">
        <div class="card-header">
          <h3>Tugas Menunggu Verifikasi</h3>
        </div>
        <div class="card-body" style="padding:0;">
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Tanggal Tugas</th>
                  <th>Diselesaikan Oleh</th>
                  <th>Bukti</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>${submittedRows}</tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card fade-in">
        <div class="card-header">
          <h3>Semua Jadwal</h3>
          <button class="btn btn-primary btn-sm" onclick="AdminModule.addJadwalModal()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Tambah Jadwal
          </button>
        </div>
        <div class="card-body" style="padding:0;">
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Terakhir Dikerjakan Oleh</th>
                </tr>
              </thead>
              <tbody>${otherRows || `<tr><td colspan="3" style="text-align:center">Belum ada jadwal.</td></tr>`}</tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  addJadwalModal() {
    App.showModal('Tambah Jadwal (Semua Petugas)', `
      <form id="form-jadwal" onsubmit="AdminModule.saveJadwal(event)">
        <div class="form-group">
          <label class="form-label">Tanggal Pelaksanaan</label>
          <input type="date" class="form-input" id="jadwal-tanggal" required>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-top:12px;">Jadwal ini akan masuk ke daftar tugas global untuk semua petugas kebersihan.</p>
      </form>
    `, `
      <button class="btn btn-outline" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="document.getElementById('form-jadwal').requestSubmit()">Simpan</button>
    `);
  },

  async saveJadwal(e) {
    e.preventDefault();
    const result = await DataStore.api('jadwal.php', {
      method: 'POST',
      body: JSON.stringify({
        tanggal: document.getElementById('jadwal-tanggal').value
      })
    });
    
    App.closeModal();
    if (result.success) {
      App.showToast('Jadwal berhasil ditambahkan!', 'success');
    } else {
      App.showToast(result.message || 'Gagal merekam jadwal', 'error');
    }
    this.navigate('jadwal');
  },

  async viewTaskProof(jadwalId) {
    const jadwal = await DataStore.getJadwal();
    const j = jadwal.find(item => item.id == jadwalId);
    if (!j) return;

    let proofsHtml = '<p style="color:var(--text-muted); font-size:0.88rem;">Tidak ada bukti file</p>';
    if (j.bukti && j.bukti.length > 0) {
      proofsHtml = j.bukti.map(b => {
        if (b.toLowerCase().endsWith('.pdf')) {
          return `<div style="background:var(--bg-glass); padding:16px; border-radius:var(--radius-md); text-align:center; margin-bottom:12px;">
                    <div style="font-size:3rem; margin-bottom:8px;">📄</div>
                    <a href="${b}" target="_blank" style="color:var(--primary-400); text-decoration:none; font-size:0.9rem;">Lihat PDF</a>
                  </div>`;
        }
        return `<img src="${b}" class="proof-image" alt="Bukti Tugas" style="margin-bottom:12px;">`;
      }).join('');
    }

    App.showModal('Verifikasi Bukti Tugas', `
      <div class="proof-viewer" style="align-items:stretch">
        <div style="max-height: 400px; overflow-y: auto; text-align:center;">
          ${proofsHtml}
        </div>
        <div class="proof-details" style="margin-top:16px;">
          <div class="detail-row">
            <span class="detail-label">Tanggal Pelaksanaan</span>
            <span class="detail-value">${DataStore.formatDate(j.tanggal)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Dilaporkan Oleh</span>
            <span class="detail-value">${j.completed_by_name || '-'}</span>
          </div>
        </div>
      </div>
    `, `
      <button class="btn btn-danger" onclick="AdminModule.rejectTask(${j.id})">
        Tolak
      </button>
      <button class="btn btn-success" onclick="AdminModule.approveTask(${j.id})">
        Setujui
      </button>
    `);
  },

  async approveTask(jadwalId) {
    const result = await DataStore.updateJadwal(jadwalId, { status: 'verified' });
    App.closeModal();
    if (result.success) {
      App.showToast('Tugas disetujui!', 'success');
    } else {
      App.showToast(result.message || 'Gagal memverifikasi', 'error');
    }
    this.navigate('jadwal');
  },

  async rejectTask(jadwalId) {
    const result = await DataStore.updateJadwal(jadwalId, { status: 'rejected' });
    App.closeModal();
    if (result.success) {
      App.showToast('Tugas ditolak, petugas perlu melapor ulang.', 'error');
    } else {
      App.showToast(result.message || 'Gagal menolak', 'error');
    }
    this.navigate('jadwal');
  },

  // ── PENGATURAN APLIKASI ──
  async renderSettings() {
    const qris_image = await DataStore.getSetting('qris_image');
    const qrisPreview = qris_image ? `<img src="${qris_image}" alt="QRIS" style="max-height: 200px; border-radius: var(--radius-md); border: 2px dashed var(--border-color); padding: 8px; margin-top: 12px;">` : `<p style="color:var(--text-muted); margin-top: 12px;">Belum ada QRIS yang diatur.</p>`;

    return `
      <div class="card fade-in mb-3">
        <div class="card-header">
          <h3>Pengaturan Pembayaran Warga</h3>
        </div>
        <div class="card-body">
          <div style="background:var(--bg-glass); padding:24px; border-radius:var(--radius-md);">
            <h4>QRIS Retribusi (Tampil Ke Warga)</h4>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px;">Silakan unggah foto kode bar QRIS pencairan khusus retribusi sampah. Gambar ini akan dimuat secara dinamis saat warga melakukan pembayaran.</p>
            
            <div id="qris-preview-container">
               ${qrisPreview}
            </div>

            <div style="margin-top: 24px; display:flex; gap: 12px; align-items:center;">
              <input type="file" id="input-qris" accept="image/*" style="display:none" onchange="AdminModule.handleQrisUpload(event)">
              <button class="btn btn-primary" onclick="document.getElementById('input-qris').click()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                Upload / Ganti QRIS
              </button>
              <span id="qris-upload-status" style="font-size:0.85rem; color:var(--text-muted);"></span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async handleQrisUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const statusEl = document.getElementById('qris-upload-status');
    statusEl.innerHTML = '⏳ Sedang mengunggah...';

    const res = await DataStore.uploadBukti(file);
    if (res.success) {
      statusEl.innerHTML = '✅ Terunggah! Menyimpan...';
      const saveRes = await DataStore.updateSetting('qris_image', res.data.path);
      if (saveRes.success) {
        statusEl.innerHTML = '';
        App.showToast('Gambar QRIS berhasil diperbarui!', 'success');
        this.navigate('settings');
      } else {
        statusEl.innerHTML = '❌ Gagal menyimpan pengaturan';
      }
    } else {
      statusEl.innerHTML = '❌ Gagal upload file';
      App.showToast(res.message || 'Error', 'error');
    }
  }
};
