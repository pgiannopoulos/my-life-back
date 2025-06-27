<template>
  <div class="settings fade-in">
    <div class="header">
      <h1 class="title">Settings</h1>
    </div>

    <div class="content">
      <!-- Notifications Section -->
      <section class="settings-section">
        <h2 class="section-title">Notifications</h2>
        <div class="settings-group glass shadow-soft">
          <div class="setting-item">
            <div class="setting-left">
              <div class="setting-icon gradient-primary">
                <Bell :size="20" />
              </div>
              <div class="setting-content">
                <h3 class="setting-title">Daily Reminders</h3>
                <p class="setting-subtitle">Get reminded to log your daily symptoms</p>
              </div>
            </div>
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="settings.notifications"
                @change="saveSettings"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </section>

      <!-- Appearance Section -->
      <section class="settings-section">
        <h2 class="section-title">Appearance</h2>
        <div class="settings-group glass shadow-soft">
          <div class="setting-item">
            <div class="setting-left">
              <div class="setting-icon gradient-secondary">
                <Moon :size="20" />
              </div>
              <div class="setting-content">
                <h3 class="setting-title">Dark Mode</h3>
                <p class="setting-subtitle">Switch to dark theme</p>
              </div>
            </div>
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="settings.darkMode"
                @change="saveSettings"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item" @click="showLanguageModal">
            <div class="setting-left">
              <div class="setting-icon gradient-success">
                <Globe :size="20" />
              </div>
              <div class="setting-content">
                <h3 class="setting-title">Language</h3>
                <p class="setting-subtitle">English (US)</p>
              </div>
            </div>
            <ChevronRight :size="20" class="chevron" />
          </div>
        </div>
      </section>

      <!-- Privacy & Security Section -->
      <section class="settings-section">
        <h2 class="section-title">Privacy & Security</h2>
        <div class="settings-group glass shadow-soft">
          <div class="setting-item" @click="showPrivacyModal">
            <div class="setting-left">
              <div class="setting-icon gradient-warning">
                <Shield :size="20" />
              </div>
              <div class="setting-content">
                <h3 class="setting-title">Privacy Policy</h3>
                <p class="setting-subtitle">Learn how we protect your data</p>
              </div>
            </div>
            <ChevronRight :size="20" class="chevron" />
          </div>
          <div class="setting-item" @click="exportData">
            <div class="setting-left">
              <div class="setting-icon gradient-primary">
                <Download :size="20" />
              </div>
              <div class="setting-content">
                <h3 class="setting-title">Export Data</h3>
                <p class="setting-subtitle">Download your health data</p>
              </div>
            </div>
            <ChevronRight :size="20" class="chevron" />
          </div>
        </div>
      </section>

      <!-- Data Management Section -->
      <section class="settings-section">
        <h2 class="section-title">Data Management</h2>
        <div class="settings-group glass shadow-soft">
          <div class="setting-item danger" @click="confirmDeleteData">
            <div class="setting-left">
              <div class="setting-icon gradient-danger">
                <Trash2 :size="20" />
              </div>
              <div class="setting-content">
                <h3 class="setting-title">Delete All Data</h3>
                <p class="setting-subtitle">Permanently remove all logged data</p>
              </div>
            </div>
            <ChevronRight :size="20" class="chevron" />
          </div>
        </div>
      </section>

      <!-- Support Section -->
      <section class="settings-section">
        <h2 class="section-title">Support</h2>
        <div class="settings-group glass shadow-soft">
          <div class="setting-item" @click="showSupportModal">
            <div class="setting-left">
              <div class="setting-icon gradient-success">
                <HelpCircle :size="20" />
              </div>
              <div class="setting-content">
                <h3 class="setting-title">Help & Support</h3>
                <p class="setting-subtitle">Get help with using the app</p>
              </div>
            </div>
            <ChevronRight :size="20" class="chevron" />
          </div>
        </div>
      </section>

      <!-- App Info -->
      <div class="app-info glass shadow-soft">
        <div class="app-logo gradient-primary">
          <Heart :size="32" />
        </div>
        <h3 class="app-name">IBS Tracker</h3>
        <p class="app-version">Version 1.0.0</p>
        <p class="app-description">
          A comprehensive tool for tracking IBS symptoms, food intake, and overall wellness.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  Bell, 
  Moon, 
  Globe, 
  Shield, 
  Download, 
  Trash2, 
  HelpCircle, 
  ChevronRight, 
  Heart 
} from 'lucide-vue-next'

export default {
  name: 'Settings',
  components: {
    Bell,
    Moon,
    Globe,
    Shield,
    Download,
    Trash2,
    HelpCircle,
    ChevronRight,
    Heart
  },
  data() {
    return {
      settings: {
        notifications: true,
        darkMode: false,
        dataExport: false
      }
    }
  },
  methods: {
    saveSettings() {
      // Here you would typically save to localStorage or backend
      localStorage.setItem('ibsTrackerSettings', JSON.stringify(this.settings))
      console.log('Settings saved:', this.settings)
    },
    loadSettings() {
      const saved = localStorage.getItem('ibsTrackerSettings')
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) }
      }
    },
    showLanguageModal() {
      alert('Language settings coming soon!')
    },
    showPrivacyModal() {
      alert('Privacy policy details would be shown here.')
    },
    showSupportModal() {
      alert('Support resources would be shown here.')
    },
    exportData() {
      alert('Your health data will be exported as a CSV file.')
    },
    confirmDeleteData() {
      if (confirm('This will permanently delete all your logged data. This action cannot be undone. Are you sure?')) {
        this.deleteAllData()
      }
    },
    deleteAllData() {
      // Here you would typically clear all user data
      localStorage.clear()
      alert('All data has been deleted.')
    }
  },
  mounted() {
    this.loadSettings()
  }
}
</script>

<style scoped>
.settings {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-section {
  width: 100%;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.settings-group {
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.setting-item.danger:hover {
  background: rgba(250, 112, 154, 0.1);
}

.setting-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.setting-icon {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.setting-content {
  flex: 1;
}

.setting-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
}

.setting-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
}

.chevron {
  color: rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  flex-shrink: 0;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.2);
  transition: 0.3s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .toggle-slider {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.app-info {
  text-align: center;
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 1rem;
}

.app-logo {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
}

.app-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.app-version {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
}

.app-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  max-width: 300px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .setting-item {
    padding: 1.25rem;
  }
  
  .setting-left {
    gap: 0.75rem;
  }
  
  .setting-icon {
    width: 45px;
    height: 45px;
  }
  
  .app-info {
    padding: 1.5rem;
  }
}
</style>