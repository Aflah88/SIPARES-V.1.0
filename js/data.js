/* ===================================
   SIPARES - Data Store (PHP API)
   =================================== */

const API_BASE = 'api';

const DataStore = {
  // Initialize - check session
  async init() {
    // Nothing to seed - data is in MySQL now
  },

  // ── API Helper ──
  async api(endpoint, options = {}) {
    const url = `${API_BASE}/${endpoint}`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin', // Important for session cookies
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, message: 'Koneksi ke server gagal' };
    }
  },

  // ── AUTH ──
  async login(username, password, role) {
    const result = await this.api('auth.php?action=login', {
      method: 'POST',
      body: JSON.stringify({ username, password, role }),
    });

    if (result.success) {
      // Cache session locally for quick UI access
      this._session = result.data;
      return result.data;
    }
    return null;
  },

  getSession() {
    return this._session || null;
  },

  async checkSession() {
    const result = await this.api('auth.php?action=session');
    if (result.success) {
      this._session = result.data;
      return result.data;
    }
    this._session = null;
    return null;
  },

  async logout() {
    await this.api('auth.php?action=logout', { method: 'POST' });
    this._session = null;
  },

  _session: null,

  // ── USERS (Admin) ──
  async getUsers() {
    const result = await this.api('users.php?role=user');
    return result.success ? result.data : [];
  },

  async getPetugas() {
    const result = await this.api('users.php?role=petugas');
    return result.success ? result.data : [];
  },

  async getUserById(id) {
    const result = await this.api(`users.php?id=${id}`);
    return result.success ? result.data : null;
  },

  async addUser(userData) {
    const result = await this.api('users.php', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return result;
  },

  async updateUser(id, updates) {
    const result = await this.api(`users.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return result;
  },

  async deleteUser(id) {
    const result = await this.api(`users.php?id=${id}`, {
      method: 'DELETE',
    });
    return result;
  },

  // ── TRANSACTIONS ──
  async getTransactions(filters = {}) {
    let query = 'transactions.php';
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.user_id) params.set('user_id', filters.user_id);
    const qs = params.toString();
    if (qs) query += '?' + qs;

    const result = await this.api(query);
    return result.success ? result.data : [];
  },

  async getPendingTransactions() {
    return this.getTransactions({ status: 'pending' });
  },

  async getUserTransactions(userId) {
    return this.getTransactions({ user_id: userId });
  },

  async addTransaction(data) {
    const result = await this.api('transactions.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result;
  },

  async updateTransaction(id, updates) {
    const result = await this.api(`transactions.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return result;
  },

  // ── JADWAL ──
  async getJadwal(filters = {}) {
    let query = 'jadwal.php';
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    const qs = params.toString();
    if (qs) query += '?' + qs;

    const result = await this.api(query);
    return result.success ? result.data : [];
  },

  async getPetugasJadwal() {
    return this.getJadwal();
  },

  async updateJadwal(id, updates) {
    const result = await this.api(`jadwal.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return result;
  },

  // ── UPLOAD ──
  async uploadBukti(file) {
    const formData = new FormData();
    formData.append('bukti', file);

    try {
      const response = await fetch(`${API_BASE}/upload.php`, {
        method: 'POST',
        credentials: 'same-origin',
        body: formData,
        // Don't set Content-Type header — browser will set multipart/form-data
      });
      return await response.json();
    } catch (error) {
      console.error('Upload Error:', error);
      return { success: false, message: 'Upload gagal' };
    }
  },

  // ── SETTINGS ──
  async getSetting(key) {
    const result = await this.api(`settings.php?key=${encodeURIComponent(key)}`);
    return result.success ? result.data : '';
  },

  async updateSetting(key, value) {
    const result = await this.api('settings.php', {
      method: 'PUT',
      body: JSON.stringify({ key, value }),
    });
    return result;
  },

  // ── FORMAT HELPERS (unchanged) ──
  formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  },

  formatDate(dateStr) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
  },

  formatDateShort(dateStr) {
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    return { day: d.getDate(), month: months[d.getMonth()] };
  }
};
