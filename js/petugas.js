/* ===================================
   SIPARES - Petugas Kebersihan Module (Async/PHP)
   =================================== */

const PetugasModule = {
  currentSection: 'jadwal',
  uploadedFiles: [],

  getSidebarItems() {
    return `
      <div class="sidebar-nav-label">Menu Utama</div>
      <div class="sidebar-nav-item ${this.currentSection === 'jadwal' ? 'active' : ''}" onclick="PetugasModule.navigate('jadwal')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
        Jadwal Pengambilan
      </div>
      <div class="sidebar-nav-item ${this.currentSection === 'riwayat' ? 'active' : ''}" onclick="PetugasModule.navigate('riwayat')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Riwayat Tugas
      </div>
      <div class="sidebar-nav-item ${this.currentSection === 'komplain' ? 'active' : ''}" onclick="PetugasModule.navigate('komplain')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        Komplain
      </div>
      <div class="sidebar-nav-item ${this.currentSection === 'profil' ? 'active' : ''}" onclick="PetugasModule.navigate('profil')">
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
      case 'jadwal': return await this.renderJadwal();
      case 'riwayat': return await this.renderRiwayat();
      case 'komplain': return await this.renderKomplain();
      case 'profil': return await this.renderProfil();
      default: return await this.renderJadwal();
    }
  },

  // ── JADWAL PENGAMBILAN ──
  async renderJadwal() {
    const jadwal = await DataStore.getPetugasJadwal();
    const pending = jadwal.filter(j => j.status === 'pending').sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
    const completedOrSubmitted = jadwal.filter(j => ['submitted', 'verified'].includes(j.status));

    const today = new Date().toISOString().split('T')[0];
    const todayTasks = pending.filter(j => j.tanggal === today);

    return `
      <div class="stats-grid fade-in">
        <div class="stat-card blue">
          <div class="stat-card-header">
            <span class="stat-card-label">Tugas Hari Ini</span>
            <div class="stat-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            </div>
          </div>
          <div class="stat-card-value">${todayTasks.length}</div>
          <div class="stat-card-desc">tugas harus dikunjungi</div>
        </div>
        <div class="stat-card yellow">
          <div class="stat-card-header">
            <span class="stat-card-label">Menunggu</span>
            <div class="stat-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
          </div>
          <div class="stat-card-value">${pending.length}</div>
          <div class="stat-card-desc">tugas belum selesai</div>
        </div>
        <div class="stat-card green">
          <div class="stat-card-header">
            <span class="stat-card-label">Selesai</span>
            <div class="stat-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
          </div>
          <div class="stat-card-value">${completedOrSubmitted.length}</div>
          <div class="stat-card-desc">tugas diselesaikan</div>
        </div>
      </div>

      ${todayTasks.length > 0 ? `
      <div class="card fade-in mb-3" style="border-color: rgba(59, 130, 246, 0.3);">
        <div class="card-header">
          <h3>🗓️ Tugas Hari Ini — ${DataStore.formatDate(today)}</h3>
        </div>
        <div class="card-body">
          <div class="schedule-list">
            ${todayTasks.map(j => this.renderScheduleItem(j, true)).join('')}
          </div>
        </div>
      </div>` : ''}

      <div class="card fade-in">
        <div class="card-header">
          <h3>Jadwal Mendatang</h3>
        </div>
        <div class="card-body">
          ${pending.filter(j => j.tanggal !== today).length > 0 ? `
          <div class="schedule-list">
            ${pending.filter(j => j.tanggal !== today).map(j => this.renderScheduleItem(j, false)).join('')}
          </div>` : `
          <div class="empty-state">
            <div style="font-size:3rem; margin-bottom:16px;">📅</div>
            <h4>Tidak Ada Jadwal Mendatang</h4>
            <p>Semua tugas sudah ditampilkan</p>
          </div>`}
        </div>
      </div>
    `;
  },

  renderScheduleItem(j, isToday) {
    const dateInfo = DataStore.formatDateShort(j.tanggal);
    return `
      <div class="schedule-item" style="${isToday ? 'border-color: rgba(59, 130, 246, 0.3); background: rgba(59, 130, 246, 0.05);' : ''}">
        <div class="schedule-item-left">
          <div class="schedule-date-badge" style="${isToday ? 'background: linear-gradient(135deg, #3b82f6, #2563eb);' : ''}">
            <span class="day">${dateInfo.day}</span>
            <span class="month">${dateInfo.month}</span>
          </div>
          <div class="schedule-info">
            <h4>${DataStore.formatDate(j.tanggal)}</h4>
            <p>Pengambilan Sampah Global</p>
            <p style="margin-top:2px;">${isToday ? '⚡ Hari ini' : ''}</p>
          </div>
        </div>
        <div class="schedule-item-right">
          <button class="btn btn-success btn-sm" onclick="PetugasModule.confirmTask(${j.id})">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
            Selesai
          </button>
        </div>
      </div>
    `;
  },

  handleFileUpload(event) {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    
    // Append to existing files
    this.uploadedFiles = [...this.uploadedFiles, ...files];
    
    const ui = document.getElementById('upload-proof-list');
    ui.innerHTML = this.uploadedFiles.map((file, idx) => `
      <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); padding:8px; border-radius:4px; margin-top:4px;">
        <span style="font-size:0.85rem; color:var(--text-primary); text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:200px;">${file.name}</span>
        <button class="btn btn-sm btn-outline" style="padding:2px 6px; border:none; color:var(--red-400);" onclick="PetugasModule.removeFile(${idx})">x</button>
      </div>
    `).join('');
    
    document.getElementById('btn-submit-task').disabled = false;
  },

  removeFile(idx) {
    this.uploadedFiles.splice(idx, 1);
    const ui = document.getElementById('upload-proof-list');
    if (this.uploadedFiles.length === 0) {
      ui.innerHTML = '';
      document.getElementById('btn-submit-task').disabled = true;
    } else {
      ui.innerHTML = this.uploadedFiles.map((f, i) => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); padding:8px; border-radius:4px; margin-top:4px;">
          <span style="font-size:0.85rem; color:var(--text-primary); text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:200px;">${f.name}</span>
          <button class="btn btn-sm btn-outline" style="padding:2px 6px; border:none; color:var(--red-400);" onclick="PetugasModule.removeFile(${i})">x</button>
        </div>
      `).join('');
    }
  },

  async confirmTask(jadwalId) {
    const jadwal = await DataStore.getPetugasJadwal();
    const j = jadwal.find(item => item.id == jadwalId);
    if (!j) return;

    this.uploadedFiles = [];

    App.showModal('Konfirmasi Penyelesaian Tugas', `
      <div style="text-align:center; padding:0;">
        <p style="font-size:0.95rem; margin-bottom:12px;">Upload bukti foto atau PDF penyelesaian tugas untuk <b>${DataStore.formatDate(j.tanggal)}</b>:</p>
        <div class="upload-area" id="proof-upload-area" style="padding:16px;">
          <input type="file" accept="image/*,application/pdf" multiple onchange="PetugasModule.handleFileUpload(event)">
          <div id="upload-content">
            <div style="font-size:2rem; margin-bottom:8px;">📤</div>
            <p style="font-size:0.85rem">Klik atau seret banyak file kesini</p>
          </div>
        </div>
        <div id="upload-proof-list" style="margin-top:12px; text-align:left;"></div>
        <div class="form-group" style="text-align:left; margin-top:16px;">
          <label class="form-label" style="font-size:0.85rem">Keterangan Tambahan (Opsional)</label>
          <textarea id="task-keterangan" class="form-input" rows="2" placeholder="Cth: Sampah dari RT 02 sudah diangkut semua..." style="resize:vertical"></textarea>
        </div>
      </div>
    `, `
      <button class="btn btn-outline" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-success" id="btn-submit-task" onclick="PetugasModule.completeTask(${jadwalId})" disabled>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
        Kirim & Selesai
      </button>
    `);
  },

  async completeTask(jadwalId) {
    if (this.uploadedFiles.length === 0) {
      App.showToast('Minimal upload 1 bukti file!', 'error');
      return;
    }

    const btn = document.getElementById('btn-submit-task');
    btn.disabled = true;
    btn.innerHTML = '⏳ Menyiapkan...';

    const uploadedPaths = [];

    // Upload all files concurrently
    const promises = this.uploadedFiles.map(async (f) => {
      const res = await DataStore.uploadBukti(f);
      if (res.success) {
        uploadedPaths.push(res.data.path);
      }
    });

    await Promise.all(promises);

    if (uploadedPaths.length === 0) {
      App.showToast('Gagal mengupload semua file', 'error');
      btn.disabled = false;
      btn.innerHTML = 'Kirim & Selesai';
      return;
    }

    const keterangan = document.getElementById('task-keterangan').value;
    const result = await DataStore.updateJadwal(jadwalId, { status: 'submitted', bukti: uploadedPaths, keterangan });
    App.closeModal();
    if (result.success) {
      App.showToast('Tugas berhasil diserahkan! Menunggu verifikasi admin. 🎉', 'success');
    } else {
      App.showToast(result.message || 'Gagal mengupdate status', 'error');
    }
    this.navigate('jadwal');
  },

  // ── RIWAYAT TUGAS ──
  async renderRiwayat() {
    const session = DataStore.getSession();
    const jadwal = await DataStore.getPetugasJadwal();
    
    // You can see tasks that are submitted by you, or verified tasks submitted by you
    const myHistory = jadwal.filter(j => 
      ['submitted', 'verified', 'rejected'].includes(j.status) && j.completed_by == session.id
    ).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    const statusBadge = (s) => {
      if (s === 'verified') return '<span class="badge badge-success">Selesai (Diakui)</span>';
      if (s === 'submitted') return '<span class="badge badge-warning">Menunggu Validasi</span>';
      if (s === 'rejected') return '<span class="badge badge-danger">Ditolak</span>';
      return s;
    };

    return `
      <div class="card fade-in">
        <div class="card-header">
          <h3>Riwayat Tugas Saya (${myHistory.length})</h3>
        </div>
        <div class="card-body" style="padding:0;">
          ${myHistory.length > 0 ? `
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Jumlah File Bukti</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${myHistory.map(j => `
                <tr>
                  <td style="font-weight:600; color:var(--text-primary)">${DataStore.formatDate(j.tanggal)}</td>
                  <td>${j.bukti ? j.bukti.length : 0} file</td>
                  <td>${statusBadge(j.status)}</td>
                </tr>
                `).join('')}
              </tbody>
            </table>
          </div>` : `
          <div class="empty-state">
            <div style="font-size:3rem; margin-bottom:16px;">📋</div>
            <h4>Belum Ada Riwayat</h4>
            <p>Anda belum menyerahkan tugas apapun</p>
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
          <form id="form-komplain" onsubmit="PetugasModule.submitKomplain(event)">
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
                    <button class="btn btn-sm btn-outline" onclick="PetugasModule.viewKomplain(${c.id})">Detail</button>
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
            <div class="profile-role">Petugas Kebersihan</div>
          </div>
        </div>
        <div class="card-body">
          <form id="form-profile" onsubmit="PetugasModule.saveProfile(event)">
            <div class="form-group">
              <label class="form-label">Nama Lengkap</label>
              <input type="text" class="form-input" id="profile-nama" value="${profile.nama}" required>
            </div>
            <div class="form-group">
              <label class="form-label">No. Handphone</label>
              <input type="tel" class="form-input" id="profile-phone" value="${profile.phone || ''}">
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

