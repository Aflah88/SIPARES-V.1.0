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
      case 'profil': return this.renderProfil();
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
                <div class="qris-amount">Rp 25.000</div>
                <div class="qris-label">Retribusi Sampah Bulanan</div>
              </div>
            </div>
            <div>
              <div class="qris-instructions">
                <h4>Cara Pembayaran</h4>
                <div class="qris-step"><div class="qris-step-num">1</div><p>Buka aplikasi e-wallet atau m-banking yang mendukung QRIS</p></div>
                <div class="qris-step"><div class="qris-step-num">2</div><p>Scan QR code yang ditampilkan di sebelah kiri</p></div>
                <div class="qris-step"><div class="qris-step-num">3</div><p>Pastikan nominal pembayaran <strong>Rp 25.000</strong></p></div>
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
      jumlah: 25000,
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

  // ── PROFIL ──
  renderProfil() {
    const session = DataStore.getSession();
    const initials = session.nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return `
      <div class="card profile-card fade-in">
        <div class="profile-header">
          <div class="profile-avatar">${initials}</div>
          <div>
            <div class="profile-name">${session.nama}</div>
            <div class="profile-role">Warga</div>
          </div>
        </div>
        <div class="profile-details">
          <div class="profile-row"><label>Nama Lengkap</label><span>${session.nama}</span></div>
          <div class="profile-row"><label>No. Handphone</label><span>${session.phone || '-'}</span></div>
          <div class="profile-row"><label>RT</label><span>${session.rt || '-'}</span></div>
          <div class="profile-row"><label>RW</label><span>${session.rw || '-'}</span></div>
          <div class="profile-row"><label>Alamat</label><span>${session.alamat || '-'}</span></div>
          <div class="profile-row"><label>Username</label><span>${session.username}</span></div>
        </div>
      </div>
    `;
  },
};
