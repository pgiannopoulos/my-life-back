<template>
  <div class="history fade-in">
    <div class="header">
      <h1 class="title">History</h1>
      <div class="month-nav glass shadow-soft">
        <button @click="navigateMonth('prev')" class="nav-btn">
          <ChevronLeft :size="20" />
        </button>
        <span class="month-text">{{ getCurrentMonth() }}</span>
        <button @click="navigateMonth('next')" class="nav-btn">
          <ChevronRight :size="20" />
        </button>
      </div>
    </div>

    <div class="content">
      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card glass shadow-soft">
          <div class="summary-icon gradient-primary">
            <Heart :size="20" />
          </div>
          <div class="summary-content">
            <span class="summary-label">Avg Mood</span>
            <span class="summary-value">{{ summaryStats.avgMood }}</span>
          </div>
        </div>
        <div class="summary-card glass shadow-soft">
          <div class="summary-icon gradient-secondary">
            <Calendar :size="20" />
          </div>
          <div class="summary-content">
            <span class="summary-label">Days Logged</span>
            <span class="summary-value">{{ summaryStats.daysLogged }}</span>
          </div>
        </div>
        <div class="summary-card glass shadow-soft">
          <div class="summary-icon gradient-success">
            <Droplets :size="20" />
          </div>
          <div class="summary-content">
            <span class="summary-label">Avg Water</span>
            <span class="summary-value">{{ summaryStats.avgWater }}</span>
          </div>
        </div>
      </div>

      <!-- Recent Entries -->
      <div class="entries-section">
        <h2 class="section-title">Recent Entries</h2>
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">Loading your history...</p>
        </div>
        <div v-else-if="logs.length === 0" class="empty-state">
          <Calendar :size="48" class="empty-icon" />
          <h3 class="empty-title">No entries found</h3>
          <p class="empty-description">Start logging your daily symptoms to see your history here.</p>
        </div>
        <div v-else class="entries-list">
          <div 
            v-for="(entry, index) in logs" 
            :key="entry.id" 
            class="entry-card glass shadow-soft slide-in"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="entry-header">
              <div class="entry-date">
                <Calendar :size="16" />
                <span>{{ formatDate(entry.log_date) }}</span>
              </div>
              <div class="mood-indicator" :style="{ background: getMoodGradient(entry.mood) }">
                {{ entry.mood }}
              </div>
            </div>
            
            <div class="entry-stats">
              <div class="stat">
                <span class="stat-label">Symptoms</span>
                <span class="stat-value">{{ entry.symptoms?.length || 0 }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">BM Count</span>
                <span class="stat-value">{{ entry.poop_count }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Water</span>
                <span class="stat-value">{{ entry.water_intake }}</span>
              </div>
            </div>

            <div v-if="entry.symptoms && entry.symptoms.length > 0" class="symptoms-list">
              <div 
                v-for="(symptom, idx) in entry.symptoms.slice(0, 3)" 
                :key="idx" 
                class="symptom-pill"
              >
                {{ symptom.symptom_name }}
              </div>
              <span v-if="entry.symptoms.length > 3" class="more-symptoms">
                +{{ entry.symptoms.length - 3 }} more
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ChevronLeft, ChevronRight, Calendar, Heart, Droplets } from 'lucide-vue-next'
import { dbService } from '@/lib/supabase'

export default {
  name: 'History',
  components: {
    ChevronLeft,
    ChevronRight,
    Calendar,
    Heart,
    Droplets
  },
  data() {
    return {
      selectedMonth: new Date(),
      logs: [],
      loading: false
    }
  },
  computed: {
    summaryStats() {
      if (this.logs.length === 0) {
        return {
          avgMood: '0',
          daysLogged: '0',
          avgWater: '0'
        }
      }

      const totalMood = this.logs.reduce((sum, log) => sum + log.mood, 0)
      const totalWater = this.logs.reduce((sum, log) => sum + log.water_intake, 0)

      return {
        avgMood: (totalMood / this.logs.length).toFixed(1),
        daysLogged: this.logs.length.toString(),
        avgWater: (totalWater / this.logs.length).toFixed(1)
      }
    }
  },
  async mounted() {
    await this.loadLogs()
  },
  methods: {
    getCurrentMonth() {
      return this.selectedMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      })
    },

    async navigateMonth(direction) {
      const newDate = new Date(this.selectedMonth)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      this.selectedMonth = newDate
      await this.loadLogs()
    },

    async loadLogs() {
      this.loading = true
      try {
        const year = this.selectedMonth.getFullYear()
        const month = this.selectedMonth.getMonth() + 1
        this.logs = await dbService.getLogsForMonth(year, month)
      } catch (error) {
        console.error('Error loading logs:', error)
      } finally {
        this.loading = false
      }
    },

    getMoodGradient(mood) {
      if (mood >= 8) return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
      if (mood >= 6) return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      if (mood >= 4) return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.history {
  max-width: 1000px;
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
  margin-bottom: 1.5rem;
}

.month-nav {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.month-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  min-width: 150px;
  text-align: center;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.summary-card {
  padding: 1.5rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-4px);
}

.summary-icon {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.summary-content {
  display: flex;
  flex-direction: column;
}

.summary-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.25rem;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.entries-section {
  width: 100%;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
}

.empty-icon {
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;
}

.empty-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
}

.entries-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.entry-card {
  padding: 1.5rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.entry-card:hover {
  transform: translateY(-2px);
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.entry-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.mood-indicator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.entry-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
}

.symptoms-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.symptom-pill {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  border-radius: 16px;
  font-size: 0.85rem;
  color: white;
  font-weight: 500;
}

.more-symptoms {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .entry-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  
  .month-nav {
    padding: 0.75rem 1rem;
    gap: 0.75rem;
  }
  
  .month-text {
    min-width: 120px;
    font-size: 1rem;
  }
}
</style>