/* ===================================
   SIPARES - App Router & Core
   =================================== */

const App = {
  async init() {
    await DataStore.init();
    await this.checkAuth();
  },

  async checkAuth() {
    const session = await DataStore.checkSession();
    if (session) {
      await this.renderDashboard();
    } else {
      this.renderLogin();
    }
  },

  // ══════════════════════════════════════
  //  LOGIN
  // ══════════════════════════════════════
  renderLogin() {
    const root = document.getElementById('app');
    root.innerHTML = `
      <div class="bg-animated"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>

      <div class="login-container">
        <div class="login-card">
          <div class="login-logo">
            <div class="login-logo-icon">♻️</div>
            <h1>SIPARES</h1>
          </div>
          <p class="login-subtitle">Sistem Pembayaran Retribusi Sampah</p>

          <form id="login-form" onsubmit="App.handleLogin(event)">
            <div class="form-group">
              <label class="form-label">Masuk Sebagai</label>
              <select class="form-select" id="login-role" required>
                <option value="" disabled selected>Pilih role Anda</option>
                <option value="user">🏘️ Warga</option>
                <option value="admin">🔒 Admin</option>
                <option value="petugas">🧹 Petugas Kebersihan</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Username</label>
              <input type="text" class="form-input" id="login-username" placeholder="Masukkan username" required>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="form-input" id="login-password" placeholder="Masukkan password" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block btn-lg" id="btn-login" style="margin-top:8px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
              Masuk
            </button>
          </form>

          <div style="margin-top:24px; padding-top:20px; border-top:1px solid var(--border-color);">
            <p style="font-size:0.75rem; color:var(--text-muted); text-align:center; margin-bottom:8px;">Demo Credentials:</p>
            <div style="display:grid; gap:6px; font-size:0.73rem; color:var(--text-muted);">
              <div style="display:flex; justify-content:space-between; padding:6px 10px; background:var(--bg-glass); border-radius:6px;">
                <span>👤 Warga</span><span>ahmad / user123</span>
              </div>
              <div style="display:flex; justify-content:space-between; padding:6px 10px; background:var(--bg-glass); border-radius:6px;">
                <span>🔒 Admin</span><span>admin / admin123</span>
              </div>
              <div style="display:flex; justify-content:space-between; padding:6px 10px; background:var(--bg-glass); border-radius:6px;">
                <span>🧹 Petugas</span><span>joko / petugas123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async handleLogin(e) {
    e.preventDefault();
    const role = document.getElementById('login-role').value;
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (!role) {
      this.showToast('Pilih role terlebih dahulu!', 'error');
      return;
    }

    // Disable button while loading
    const btn = document.getElementById('btn-login');
    btn.disabled = true;
    btn.innerHTML = '⏳ Memproses...';

    const session = await DataStore.login(username, password, role);
    if (session) {
      this.showToast(`Selamat datang, ${session.nama}!`, 'success');
      await this.renderDashboard();
    } else {
      this.showToast('Username atau password salah!', 'error');
      btn.disabled = false;
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg> Masuk`;
    }
  },

  // ══════════════════════════════════════
  //  DASHBOARD LAYOUT
  // ══════════════════════════════════════
  async renderDashboard() {
    const session = DataStore.getSession();
    if (!session) return this.renderLogin();

    const role = session.role;
    let module;
    let roleLabel;

    if (role === 'admin') {
      module = AdminModule;
      roleLabel = 'Administrator';
    } else if (role === 'petugas') {
      module = PetugasModule;
      roleLabel = 'Petugas Kebersihan';
    } else {
      module = UserModule;
      roleLabel = 'Warga';
    }

    // Get header info
    const headerInfo = this.getHeaderInfo(role, module);
    const initials = session.nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    // Get content asynchronously
    const content = await module.renderContent();

    const root = document.getElementById('app');
    root.innerHTML = `
      <div class="bg-animated"></div>
      <div class="sidebar-overlay" id="sidebar-overlay" onclick="App.toggleSidebar()"></div>

      <div class="app-layout">
        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
          <div class="sidebar-header">
            <div class="sidebar-brand">
              <div class="sidebar-brand-icon">♻️</div>
              <div class="sidebar-brand-text">
                <h2>SIPARES</h2>
                <span>${roleLabel}</span>
              </div>
            </div>
          </div>
          <nav class="sidebar-nav">
            ${module.getSidebarItems()}
          </nav>
          <div class="sidebar-footer">
            <div class="sidebar-user">
              <div class="sidebar-avatar">${initials}</div>
              <div class="sidebar-user-info">
                <div class="sidebar-user-name">${session.nama}</div>
                <div class="sidebar-user-role">${roleLabel}</div>
              </div>
            </div>
            <button class="btn btn-outline btn-sm btn-block mt-1" onclick="App.logout()" style="justify-content:center;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              Keluar
            </button>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
          <header class="main-header">
            <div style="display:flex; align-items:center; gap:12px;">
              <button class="menu-toggle" onclick="App.toggleSidebar()">☰</button>
              <div class="main-header-title">
                <h1>${headerInfo.title}</h1>
                <p>${headerInfo.desc}</p>
              </div>
            </div>
            <div class="main-header-actions">
              <span style="font-size:0.8rem; color:var(--text-muted);">${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </header>
          <div class="main-body" id="main-body">
            ${content}
          </div>
        </main>
      </div>

      <!-- Modal -->
      <div class="modal-overlay" id="modal-overlay" onclick="App.handleModalOverlayClick(event)">
        <div class="modal" id="modal">
          <div class="modal-header">
            <h3 id="modal-title"></h3>
            <button class="modal-close" onclick="App.closeModal()">✕</button>
          </div>
          <div class="modal-body" id="modal-body"></div>
          <div class="modal-footer" id="modal-footer"></div>
        </div>
      </div>

      <!-- Toast Container -->
      <div class="toast-container" id="toast-container"></div>
    `;

    // Init QR if on payment page
    if (role === 'user' && UserModule.currentSection === 'bayar') {
      setTimeout(() => UserModule.initQRCode(), 100);
    }
  },

  getHeaderInfo(role, module) {
    if (role === 'admin') {
      const map = {
        'verify': { title: 'Verifikasi Pembayaran', desc: 'Kelola dan verifikasi bukti pembayaran warga' },
        'warga': { title: 'Manajemen Warga', desc: 'Tambah, edit, dan hapus data warga' },
        'petugas-manage': { title: 'Manajemen Petugas', desc: 'Tambah, edit, dan hapus data petugas' },
        'laporan': { title: 'Laporan Transaksi', desc: 'Semua riwayat transaksi pembayaran' },
      };
      return map[module.currentSection] || map['verify'];
    } else if (role === 'petugas') {
      const map = {
        'jadwal': { title: 'Jadwal Pengambilan', desc: 'Jadwal dan konfirmasi pengambilan sampah' },
        'riwayat': { title: 'Riwayat Tugas', desc: 'Daftar tugas yang sudah diselesaikan' },
      };
      return map[module.currentSection] || map['jadwal'];
    } else {
      const map = {
        'dashboard': { title: 'Dashboard', desc: 'Ringkasan pembayaran retribusi sampah Anda' },
        'bayar': { title: 'Bayar QRIS', desc: 'Lakukan pembayaran retribusi via QRIS' },
        'riwayat': { title: 'Riwayat Transaksi', desc: 'Semua riwayat pembayaran Anda' },
        'profil': { title: 'Profil Saya', desc: 'Informasi akun Anda' },
      };
      return map[module.currentSection] || map['dashboard'];
    }
  },

  // ══════════════════════════════════════
  //  SIDEBAR TOGGLE (Mobile)
  // ══════════════════════════════════════
  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  },

  // ══════════════════════════════════════
  //  MODAL
  // ══════════════════════════════════════
  showModal(title, bodyHTML, footerHTML) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHTML;
    document.getElementById('modal-footer').innerHTML = footerHTML || '';
    document.getElementById('modal-overlay').classList.add('active');
  },

  closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
  },

  handleModalOverlayClick(e) {
    if (e.target === document.getElementById('modal-overlay')) {
      this.closeModal();
    }
  },

  // ══════════════════════════════════════
  //  TOAST NOTIFICATIONS
  // ══════════════════════════════════════
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container') || this.createToastContainer();
    const icons = {
      success: '✓',
      error: '✗',
      info: 'ℹ',
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span style="font-weight:700; font-size:1.1rem;">${icons[type] || 'ℹ'}</span> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s ease-out forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  },

  // ══════════════════════════════════════
  //  LOGOUT
  // ══════════════════════════════════════
  async logout() {
    await DataStore.logout();
    // Reset module states
    AdminModule.currentSection = 'verify';
    UserModule.currentSection = 'dashboard';
    PetugasModule.currentSection = 'jadwal';
    this.showToast('Berhasil keluar.', 'info');
    this.renderLogin();
  },
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
