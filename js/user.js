/* ===================================
   SIPARES - User (Warga) Module (Async/PHP)
   =================================== */

const UserModule = {
  currentSection: 'dashboard',

  getSidebarItems() {
    return `
      <div class="sidebar-nav-label">Menu Utama</div>
      <div class="sidebar-nav-item ${this.currentSection === 'dashboard' ? 'active' : ''}" onclick="UserModule.navigate('dashboard')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
        Dashboard
      </div>
      <div class="sidebar-nav-item ${this.currentSection === 'bayar' ? 'active' : ''}" onclick="UserModule.navigate('bayar')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
        Bayar QRIS
      </div>
      <div class="sidebar-nav-item ${this.currentSection === 'riwayat' ? 'active' : ''}" onclick="UserModule.navigate('riwayat')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Riwayat Transaksi
      </div>
      <div class="sidebar-nav-item ${this.currentSection === 'komplain' ? 'active' : ''}" onclick="UserModule.navigate('komplain')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        Komplain
      </div>
      <div class="sidebar-nav-item ${this.currentSection === 'profil' ? 'active' : ''}" onclick="UserModule.navigate('profil')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
        Profil Saya
      </div>
    `;
  },

  navigate(section) {
    this.currentSection = section;
    App.renderDashboard();
  },

  async renderContent() {
    switch (this.currentSection) {
      case 'dashboard': return await this.renderDashboard();
      case 'bayar': return this.renderBayar();
      case 'riwayat': return await this.renderRiwayat();
      case 'komplain': return await this.renderKomplain();
      case 'profil': return await this.renderProfil();
      default: return await this.renderDashboard();
    }
  },

  // ── DASHBOARD ──
  async renderDashboard() {
    const session = DataStore.getSession();
    const trx = await DataStore.getUserTransactions(session.id);
    const verified = trx.filter(t => t.status === 'verified');
    const pending = trx.filter(t => t.status === 'pending');
    const totalPaid = verified.reduce((sum, t) => sum + parseInt(t.jumlah), 0);

    const now = new Date();
    const bulanIni = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const paidThisMonth = trx.find(t => t.bulan === bulanIni && (t.status === 'verified' || t.status === 'pending'));

    return `
      <div class="stats-grid fade-in">
        <div class="stat-card green">
          <div class="stat-card-header">
            <span class="stat-card-label">Total Pembayaran</span>
            <div class="stat-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>
          <div class="stat-card-value">${DataStore.formatCurrency(totalPaid)}</div>
          <div class="stat-card-desc">${verified.length} pembayaran terverifikasi</div>
        </div>
        <div class="stat-card yellow">
          <div class="stat-card-header">
            <span class="stat-card-label">Menunggu Verifikasi</span>
            <div class="stat-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
          </div>
          <div class="stat-card-value">${pending.length}</div>
          <div class="stat-card-desc">pembayaran menunggu</div>
        </div>
        <div class="stat-card ${paidThisMonth ? 'green' : 'red'}">
          <div class="stat-card-header">
            <span class="stat-card-label">Bulan Ini</span>
            <div class="stat-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            </div>
          </div>
          <div class="stat-card-value">${paidThisMonth ? '✓' : '✗'}</div>
          <div class="stat-card-desc">${paidThisMonth ? 'Sudah dibayar' : 'Belum dibayar - Segera bayar!'}</div>
        </div>
      </div>

      ${!paidThisMonth ? `
      <div class="card fade-in mb-3" style="border-color: rgba(245, 158, 11, 0.3);">
        <div class="card-body" style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
          <div style="width:48px; height:48px; border-radius:var(--radius-md); background:rgba(245,158,11,0.15); display:flex; align-items:center; justify-content:center; font-size:1.5rem; flex-shrink:0;">⚠️</div>
          <div style="flex:1; min-width:200px;">
            <h4 style="font-size:0.95rem; font-weight:600; margin-bottom:4px;">Tagihan Bulan ${bulanIni}</h4>
            <p style="font-size:0.85rem; color:var(--text-muted);">Anda belum membayar retribusi sampah untuk bulan ini. Segera lakukan pembayaran.</p>
          </div>
          <button class="btn btn-primary" onclick="UserModule.navigate('bayar')">Bayar Sekarang</button>
        </div>
      </div>` : ''}

      <div class="card fade-in">
        <div class="card-header">
          <h3>Transaksi Terakhir</h3>
          <button class="btn btn-outline btn-sm" onclick="UserModule.navigate('riwayat')">Lihat Semua</button>
        </div>
        <div class="card-body" style="padding:0;">
          ${trx.length > 0 ? `
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Periode</th>
                  <th>Jumlah</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${trx.slice(0, 5).map(t => `
                <tr>
                  <td style="font-weight:600; color:var(--text-primary)">${t.bulan}</td>
                  <td style="font-weight:600; color:var(--emerald-400)">${DataStore.formatCurrency(t.jumlah)}</td>
                  <td>${DataStore.formatDate(t.tanggal)}</td>
                  <td>${t.status === 'verified' ? '<span class="badge badge-success">Terverifikasi</span>' : t.status === 'pending' ? '<span class="badge badge-warning">Menunggu</span>' : '<span class="badge badge-danger">Ditolak</span>'}</td>
                </tr>
                `).join('')}
              </tbody>
            </table>
          </div>` : `
          <div class="empty-state">
            <div style="font-size:3rem; margin-bottom:16px;">📋</div>
            <h4>Belum Ada Transaksi</h4>
            <p>Lakukan pembayaran pertama Anda</p>
          </div>`}
        </div>
      </div>
    `;
  },

  // ── BAYAR QRIS ──
  async renderBayar() {
    const now = new Date();
    const bulanIni = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    const qris_image = await DataStore.getSetting('qris_image');
    let qrisContent = '';

    if (qris_image) {
      qrisContent = `<div class="qris-qr-wrapper"><img src="${qris_image}" alt="QRIS" style="max-height: 200px; width:100%; object-fit:contain; border-radius:8px"></div>`;
    } else {
      qrisContent = `<div class="qris-qr-wrapper" style="display:flex; flex-direction:column; justify-content:center; align-items:center; opacity:0.6; padding: 20px;">
                       <span style="font-size:2rem; margin-bottom:8px">⚠️</span>
                       <span style="font-size:0.8rem">Belum Dikonfigurasi Admin</span>
                     </div>`;
    }

    return `
      <div class="card fade-in">
        <div class="card-header">
          <h3>Pembayaran Retribusi Sampah</h3>
          <span class="badge badge-info">${bulanIni}</span>
        </div>
        <div class="card-body">
          <div class="responsive-grid-2">
            <div class="qris-container">
              <div class="qris-card">
                <h4>QRIS - Retribusi Sampah</h4>
                <p class="qris-merchant">Desa/Kelurahan Sejahtera</p>
                ${qrisContent}
                <div class="qris-amount">Rp 20.000</div>
                <div class="qris-label">Retribusi Sampah Bulanan</div>
              </div>
            </div>
            <div>
              <div class="qris-instructions">
                <h4>Cara Pembayaran</h4>
                <div class="qris-step"><div class="qris-step-num">1</div><p>Buka aplikasi e-wallet atau m-banking yang mendukung QRIS</p></div>
                <div class="qris-step"><div class="qris-step-num">2</div><p>Scan QR code yang ditampilkan di sebelah kiri</p></div>
                <div class="qris-step"><div class="qris-step-num">3</div><p>Pastikan nominal pembayaran <strong>Rp 20.000</strong></p></div>
                <div class="qris-step"><div class="qris-step-num">4</div><p>Selesaikan pembayaran dan screenshot buktinya</p></div>
                <div class="qris-step"><div class="qris-step-num">5</div><p>Upload bukti pembayaran di bawah ini</p></div>
              </div>
              <div style="margin-top:24px;">
                <label class="form-label">Upload Bukti Pembayaran</label>
                <div class="upload-area" id="upload-area">
                  <input type="file" accept="image/*" id="bukti-file" onchange="UserModule.handleFileUpload(event)">
                  <div id="upload-content">
                    <div style="font-size:2.5rem; margin-bottom:8px;">📤</div>
                    <p>Klik atau seret file kesini</p>
                    <p style="font-size:0.75rem; margin-top:4px;">Format: JPG, PNG (Maks 5MB)</p>
                  </div>
                </div>
                <button class="btn btn-primary btn-block btn-lg mt-2" id="btn-submit-payment" onclick="UserModule.submitPayment()" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
                  Kirim Pembayaran
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  initQRCode() {
    const qrContainer = document.getElementById('qris-qr-code');
    if (!qrContainer) return;

    if (typeof QRCode !== 'undefined') {
      qrContainer.innerHTML = '';
      new QRCode(qrContainer, {
        text: '00020101021226670016COM.NOBUBANK.WWW01189360050300000898240207SIPARES0303UMI51440014ID.CO.QRIS.WWW0215ID20232889012030303UMI5204481253033605405250005802ID5913RETRIBUSI6007JAKARTA61051017162070703A016304',
        width: 200,
        height: 200,
        colorDark: '#1a1a1a',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });
    } else {
      qrContainer.innerHTML = `
        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="white"/>
          <rect x="10" y="10" width="50" height="50" fill="#1a1a1a" rx="4"/><rect x="16" y="16" width="38" height="38" fill="white" rx="2"/><rect x="22" y="22" width="26" height="26" fill="#1a1a1a" rx="2"/>
          <rect x="140" y="10" width="50" height="50" fill="#1a1a1a" rx="4"/><rect x="146" y="16" width="38" height="38" fill="white" rx="2"/><rect x="152" y="22" width="26" height="26" fill="#1a1a1a" rx="2"/>
          <rect x="10" y="140" width="50" height="50" fill="#1a1a1a" rx="4"/><rect x="16" y="146" width="38" height="38" fill="white" rx="2"/><rect x="22" y="152" width="26" height="26" fill="#1a1a1a" rx="2"/>
          <rect x="70" y="70" width="60" height="60" fill="#1a1a1a" rx="4"/><rect x="78" y="78" width="44" height="44" fill="white" rx="2"/>
          <text x="100" y="104" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#1a1a1a">QRIS</text>
        </svg>
      `;
    }
  },

  uploadedFile: null,

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
      const uploadContent = document.getElementById('upload-content');
      uploadContent.innerHTML = `
        <div style="font-size:2.5rem; margin-bottom:8px;">✅</div>
        <p style="color:var(--primary-400); font-weight:600;">${file.name}</p>
        <p style="font-size:0.75rem; margin-top:4px; color:var(--text-muted);">${(file.size / 1024).toFixed(1)} KB</p>
      `;
      document.getElementById('upload-area').classList.add('has-file');
      document.getElementById('btn-submit-payment').disabled = false;
    }
  },

  async submitPayment() {
    if (!this.uploadedFile) {
      App.showToast('Harap upload bukti pembayaran terlebih dahulu!', 'error');
      return;
    }

    const btn = document.getElementById('btn-submit-payment');
    btn.disabled = true;
    btn.innerHTML = '⏳ Mengirim...';

    const now = new Date();
    const bulanIni = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    // Upload file first
    const uploadResult = await DataStore.uploadBukti(this.uploadedFile);
    let buktiPath = null;
    if (uploadResult.success) {
      buktiPath = uploadResult.data.path;
    }

    // Create transaction
    const result = await DataStore.addTransaction({
      bulan: bulanIni,
      jumlah: 20000,
      tanggal: now.toISOString().split('T')[0],
      bukti: buktiPath,
    });

    this.uploadedFile = null;

    if (result.success) {
      App.showToast('Pembayaran berhasil dikirim! Menunggu verifikasi admin.', 'success');
      this.navigate('dashboard');
    } else {
      App.showToast(result.message || 'Gagal mengirim pembayaran', 'error');
      btn.disabled = false;
      btn.innerHTML = 'Kirim Pembayaran';
    }
  },

  // ── RIWAYAT TRANSAKSI ──
  async renderRiwayat() {
    const session = DataStore.getSession();
    const trx = await DataStore.getUserTransactions(session.id);

    const statusBadge = (status) => {
      const map = {
        'verified': '<span class="badge badge-success">Terverifikasi</span>',
        'pending': '<span class="badge badge-warning">Menunggu</span>',
        'rejected': '<span class="badge badge-danger">Ditolak</span>',
      };
      return map[status] || status;
    };

    return `
      <div class="card fade-in">
        <div class="card-header">
          <h3>Riwayat Transaksi Saya</h3>
        </div>
        <div class="card-body" style="padding:0;">
          ${trx.length > 0 ? `
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Periode</th>
                  <th>Jumlah</th>
                  <th>Tanggal Bayar</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${trx.map(t => `
                <tr>
                  <td style="font-weight:600; color:var(--text-primary)">${t.id}</td>
                  <td>${t.bulan}</td>
                  <td style="font-weight:600; color:var(--emerald-400)">${DataStore.formatCurrency(t.jumlah)}</td>
                  <td>${DataStore.formatDate(t.tanggal)}</td>
                  <td>${statusBadge(t.status)}</td>
                </tr>
                `).join('')}
              </tbody>
            </table>
          </div>` : `
          <div class="empty-state">
            <div style="font-size:3rem; margin-bottom:16px;">📋</div>
            <h4>Belum Ada Transaksi</h4>
            <p>Anda belum pernah melakukan pembayaran</p>
          </div>`}
        </div>
      </div>
    `;
  },

  // ── KOMPLAIN ──
  async renderKomplain() {
    const complaints = await DataStore.getComplaints();

    const statusBadge = (status) => {
      const map = {
        'pending': '<span class="badge badge-warning">Menunggu</span>',
        'ditanggapi': '<span class="badge badge-info">Ditanggapi</span>',
        'selesai': '<span class="badge badge-success">Selesai</span>',
      };
      return map[status] || status;
    };

    return `
      <div class="card fade-in mb-3">
        <div class="card-header">
          <h3>Kirim Komplain Baru</h3>
        </div>
        <div class="card-body">
          <form id="form-komplain" onsubmit="UserModule.submitKomplain(event)">
            <div class="form-group">
              <label class="form-label">Subjek</label>
              <input type="text" class="form-input" id="komplain-subjek" placeholder="Masukkan subjek komplain" required>
            </div>
            <div class="form-group">
              <label class="form-label">Pesan</label>
              <textarea class="form-input" id="komplain-pesan" rows="4" placeholder="Jelaskan keluhan Anda secara detail..." required style="resize:vertical; min-height:100px;"></textarea>
            </div>
            <button type="submit" class="btn btn-primary" id="btn-komplain">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
              Kirim Komplain
            </button>
          </form>
        </div>
      </div>

      <div class="card fade-in">
        <div class="card-header">
          <h3>Riwayat Komplain Saya (${complaints.length})</h3>
        </div>
        <div class="card-body" style="padding:0;">
          ${complaints.length > 0 ? `
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Subjek</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                ${complaints.map(c => `
                <tr>
                  <td>${DataStore.formatDate(c.created_at)}</td>
                  <td style="font-weight:600; color:var(--text-primary)">${c.subjek}</td>
                  <td>${statusBadge(c.status)}</td>
                  <td>
                    <button class="btn btn-sm btn-outline" onclick="UserModule.viewKomplain(${c.id})">Detail</button>
                  </td>
                </tr>
                `).join('')}
              </tbody>
            </table>
          </div>` : `
          <div class="empty-state">
            <div style="font-size:3rem; margin-bottom:16px;">💬</div>
            <h4>Belum Ada Komplain</h4>
            <p>Kirim komplain pertama Anda menggunakan form di atas</p>
          </div>`}
        </div>
      </div>
    `;
  },

  async submitKomplain(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-komplain');
    btn.disabled = true;
    btn.innerHTML = '⏳ Mengirim...';

    const result = await DataStore.addComplaint({
      subjek: document.getElementById('komplain-subjek').value,
      pesan: document.getElementById('komplain-pesan').value,
    });

    if (result.success) {
      App.showToast('Komplain berhasil dikirim!', 'success');
      this.navigate('komplain');
    } else {
      App.showToast(result.message || 'Gagal mengirim komplain', 'error');
      btn.disabled = false;
      btn.innerHTML = 'Kirim Komplain';
    }
  },

  viewKomplain(id) {
    DataStore.getComplaints().then(complaints => {
      const c = complaints.find(item => item.id == id);
      if (!c) return;

      const balasanHtml = c.balasan
        ? `<div style="background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.2); border-radius:var(--radius-sm); padding:16px; margin-top:16px;">
             <div style="font-weight:600; font-size:0.85rem; color:var(--emerald-400); margin-bottom:8px;">Balasan Admin:</div>
             <p style="font-size:0.9rem; color:var(--text-primary);">${c.balasan}</p>
           </div>`
        : `<p style="color:var(--text-muted); font-size:0.85rem; margin-top:16px; font-style:italic;">Belum ada balasan dari admin.</p>`;

      App.showModal('Detail Komplain', `
        <div>
          <div style="margin-bottom:16px;">
            <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:4px;">Subjek</div>
            <div style="font-weight:600; font-size:1rem;">${c.subjek}</div>
          </div>
          <div style="margin-bottom:16px;">
            <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:4px;">Pesan</div>
            <div style="font-size:0.9rem; color:var(--text-secondary); background:var(--bg-glass); padding:12px; border-radius:var(--radius-sm);">${c.pesan}</div>
          </div>
          <div style="display:flex; gap:16px; flex-wrap:wrap;">
            <div><span style="font-size:0.8rem; color:var(--text-muted);">Tanggal:</span> <span style="font-size:0.85rem;">${DataStore.formatDate(c.created_at)}</span></div>
            <div><span style="font-size:0.8rem; color:var(--text-muted);">Status:</span> ${c.status === 'pending' ? '<span class="badge badge-warning">Menunggu</span>' : c.status === 'ditanggapi' ? '<span class="badge badge-info">Ditanggapi</span>' : '<span class="badge badge-success">Selesai</span>'}</div>
          </div>
          ${balasanHtml}
        </div>
      `, `
        <button class="btn btn-outline" onclick="App.closeModal()">Tutup</button>
      `);
    });
  },

  // ── PROFIL (Editable) ──
  async renderProfil() {
    const profile = await DataStore.getProfile();
    if (!profile) return '<div class="empty-state"><h4>Gagal memuat profil</h4></div>';

    const initials = profile.nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return `
      <div class="card profile-card fade-in">
        <div class="profile-header">
          <div class="profile-avatar">${initials}</div>
          <div>
            <div class="profile-name">${profile.nama}</div>
            <div class="profile-role">Warga</div>
          </div>
        </div>
        <div class="card-body">
          <form id="form-profile" onsubmit="UserModule.saveProfile(event)">
            <div class="form-group">
              <label class="form-label">Nama Lengkap</label>
              <input type="text" class="form-input" id="profile-nama" value="${profile.nama}" required>
            </div>
            <div class="form-group">
              <label class="form-label">No. Handphone</label>
              <input type="tel" class="form-input" id="profile-phone" value="${profile.phone || ''}">
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div class="form-group">
                <label class="form-label">RT</label>
                <input type="text" class="form-input" id="profile-rt" value="${profile.rt || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">RW</label>
                <input type="text" class="form-input" id="profile-rw" value="${profile.rw || ''}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Alamat</label>
              <input type="text" class="form-input" id="profile-alamat" value="${profile.alamat || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Username</label>
              <input type="text" class="form-input" value="${profile.username}" disabled style="opacity:0.6;">
              <small style="color:var(--text-muted); font-size:0.75rem;">Username tidak dapat diubah</small>
            </div>
            <div class="form-group">
              <label class="form-label">Password Baru <span style="color:var(--text-muted); font-weight:400;">(kosongkan jika tidak ingin mengubah)</span></label>
              <input type="password" class="form-input" id="profile-password" placeholder="Minimal 6 karakter" minlength="6">
            </div>
            <button type="submit" class="btn btn-primary" id="btn-save-profile" style="margin-top:8px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Simpan Perubahan
            </button>
          </form>
        </div>
      </div>
    `;
  },

  async saveProfile(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-save-profile');
    btn.disabled = true;
    btn.innerHTML = '⏳ Menyimpan...';

    const updates = {
      nama: document.getElementById('profile-nama').value,
      phone: document.getElementById('profile-phone').value,
      rt: document.getElementById('profile-rt').value,
      rw: document.getElementById('profile-rw').value,
      alamat: document.getElementById('profile-alamat').value,
    };

    const password = document.getElementById('profile-password').value;
    if (password) {
      updates.password = password;
    }

    const result = await DataStore.updateProfile(updates);
    if (result.success) {
      App.showToast('Profil berhasil diperbarui!', 'success');
      this.navigate('profil');
    } else {
      App.showToast(result.message || 'Gagal memperbarui profil', 'error');
      btn.disabled = false;
      btn.innerHTML = 'Simpan Perubahan';
    }
  },
};
