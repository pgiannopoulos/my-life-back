<template>
  <div class="insights fade-in">
    <div class="header">
      <h1 class="title">Insights</h1>
      <div class="period-selector glass shadow-soft">
        <button
          v-for="period in periods"
          :key="period"
          @click="selectedPeriod = period"
          class="period-btn"
          :class="{ active: selectedPeriod === period }"
        >
          {{ period.charAt(0).toUpperCase() + period.slice(1) }}
        </button>
      </div>
    </div>

    <div class="content">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Analyzing your data...</p>
      </div>

      <div v-else-if="!hasData" class="empty-state">
        <TrendingUp :size="48" class="empty-icon" />
        <h3 class="empty-title">Not enough data yet</h3>
        <p class="empty-description">Keep logging your daily symptoms to see personalized insights here.</p>
      </div>

      <div v-else>
        <!-- Key Metrics -->
        <section class="metrics-section">
          <h2 class="section-title">Key Metrics</h2>
          <div class="metrics-grid">
            <div 
              v-for="(metric, index) in calculatedMetrics" 
              :key="index" 
              class="metric-card glass shadow-soft slide-in"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="metric-header">
                <span class="metric-title">{{ metric.title }}</span>
                <div class="trend-indicator" :class="{ positive: metric.isPositive }">
                  <TrendingUp v-if="metric.isPositive" :size="16" />
                  <TrendingDown v-else :size="16" />
                  <span>{{ metric.change > 0 ? '+' : '' }}{{ metric.change }}%</span>
                </div>
              </div>
              <div class="metric-value">{{ metric.value }}</div>
              <div class="metric-description">{{ metric.description }}</div>
            </div>
          </div>
        </section>

        <!-- Trigger Foods -->
        <section class="triggers-section">
          <h2 class="section-title">Most Common Foods</h2>
          <div class="triggers-list">
            <div 
              v-for="(food, index) in topFoods" 
              :key="index" 
              class="trigger-card glass shadow-soft slide-in"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="trigger-header">
                <span class="trigger-food">{{ food.name }}</span>
                <div class="frequency-badge">
                  {{ food.count }}x
                </div>
              </div>
              <div class="trigger-frequency">
                Consumed {{ food.count }} times this {{ selectedPeriod }}
              </div>
              <div class="trigger-bar">
                <div 
                  class="trigger-bar-fill" 
                  :style="{ width: `${(food.count / topFoods[0]?.count || 1) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Weekly Pattern -->
        <section class="pattern-section">
          <h2 class="section-title">Patterns</h2>
          <div class="pattern-card glass shadow-soft">
            <div class="pattern-item">
              <h3 class="pattern-title">Mood Trends</h3>
              <p class="pattern-text">
                Your average mood is {{ averageMood.toFixed(1) }}/10. 
                {{ averageMood >= 7 ? 'You\'re doing great!' : averageMood >= 5 ? 'Keep tracking to identify patterns.' : 'Consider discussing with your healthcare provider.' }}
              </p>
            </div>
            <div class="pattern-item">
              <h3 class="pattern-title">Symptom Frequency</h3>
              <p class="pattern-text">
                You experience an average of {{ averageSymptoms.toFixed(1) }} symptoms per day.
                {{ averageSymptoms <= 2 ? 'Your symptoms are well managed.' : 'Consider tracking trigger foods more closely.' }}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { TrendingUp, TrendingDown } from 'lucide-vue-next'
import { dbService } from '@/lib/supabase'

export default {
  name: 'Insights',
  components: {
    TrendingUp,
    TrendingDown
  },
  data() {
    return {
      selectedPeriod: 'month',
      periods: ['week', 'month', 'quarter'],
      logs: [],
      loading: false
    }
  },
  computed: {
    hasData() {
      return this.logs.length >= 3 // Need at least 3 days of data for insights
    },

    averageMood() {
      if (this.logs.length === 0) return 0
      const total = this.logs.reduce((sum, log) => sum + log.mood, 0)
      return total / this.logs.length
    },

    averageSymptoms() {
      if (this.logs.length === 0) return 0
      const total = this.logs.reduce((sum, log) => sum + (log.symptoms?.length || 0), 0)
      return total / this.logs.length
    },

    averageWater() {
      if (this.logs.length === 0) return 0
      const total = this.logs.reduce((sum, log) => sum + log.water_intake, 0)
      return total / this.logs.length
    },

    exerciseDays() {
      return this.logs.filter(log => log.exercise && log.exercise.trim().length > 0).length
    },

    calculatedMetrics() {
      return [
        {
          title: 'Average Mood',
          value: `${this.averageMood.toFixed(1)}/10`,
          change: Math.round(Math.random() * 20 - 10), // Placeholder for trend calculation
          isPositive: this.averageMood >= 6,
          description: `Your mood has been ${this.averageMood >= 7 ? 'excellent' : this.averageMood >= 5 ? 'stable' : 'challenging'} this ${this.selectedPeriod}`
        },
        {
          title: 'Symptom Frequency',
          value: `${this.averageSymptoms.toFixed(1)}/day`,
          change: Math.round(Math.random() * 15 - 5),
          isPositive: this.averageSymptoms <= 2,
          description: `${this.averageSymptoms <= 2 ? 'Low' : this.averageSymptoms <= 4 ? 'Moderate' : 'High'} symptom frequency this ${this.selectedPeriod}`
        },
        {
          title: 'Water Intake',
          value: `${this.averageWater.toFixed(1)} glasses`,
          change: Math.round(Math.random() * 10),
          isPositive: this.averageWater >= 6,
          description: `You're ${this.averageWater >= 8 ? 'exceeding' : this.averageWater >= 6 ? 'meeting' : 'below'} hydration goals`
        },
        {
          title: 'Exercise Days',
          value: `${this.exerciseDays} days`,
          change: Math.round(Math.random() * 25),
          isPositive: this.exerciseDays > 0,
          description: `${this.exerciseDays > 0 ? 'Great job staying active!' : 'Consider adding light exercise'}`
        }
      ]
    },

    topFoods() {
      const foodCounts = {}
      
      this.logs.forEach(log => {
        if (log.foods) {
          log.foods.forEach(food => {
            const foodName = food.food_name
            foodCounts[foodName] = (foodCounts[foodName] || 0) + 1
          })
        }
      })

      return Object.entries(foodCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    }
  },
  watch: {
    selectedPeriod() {
      this.loadInsights()
    }
  },
  async mounted() {
    await this.loadInsights()
  },
  methods: {
    async loadInsights() {
      this.loading = true
      try {
        this.logs = await dbService.getInsightsData(this.selectedPeriod)
      } catch (error) {
        console.error('Error loading insights:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.insights {
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

.period-selector {
  display: inline-flex;
  padding: 0.5rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.period-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.period-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.period-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
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

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  padding: 1.5rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-4px);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.metric-title {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.trend-indicator.positive {
  color: #43e97b;
}

.trend-indicator:not(.positive) {
  color: #fa709a;
}

.metric-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.metric-description {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
}

.triggers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.trigger-card {
  padding: 1.5rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.trigger-card:hover {
  transform: translateY(-2px);
}

.trigger-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.trigger-food {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
}

.frequency-badge {
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.trigger-frequency {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
}

.trigger-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.trigger-bar-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  transition: width 0.3s ease;
}

.pattern-card {
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.pattern-item {
  margin-bottom: 1.5rem;
}

.pattern-item:last-child {
  margin-bottom: 0;
}

.pattern-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.pattern-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .period-selector {
    width: 100%;
    justify-content: center;
  }
}
</style>