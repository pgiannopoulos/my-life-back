<template>
  <div class="today fade-in">
    <div class="header">
      <h1 class="title">Daily Log</h1>
      <p class="date">{{ getCurrentDate() }}</p>
    </div>

    <div class="sections">
      <!-- Mood Section -->
      <section class="section glass shadow-soft">
        <div class="section-header">
          <Heart :size="24" class="section-icon mood-icon" />
          <h2 class="section-title">How are you feeling?</h2>
        </div>
        <div class="mood-scale">
          <button
            v-for="num in 10"
            :key="num"
            @click="log.mood = num"
            class="mood-button"
            :class="{ active: log.mood === num }"
          >
            {{ num }}
          </button>
        </div>
      </section>

      <!-- Symptoms Section -->
      <section class="section glass shadow-soft">
        <div class="section-header">
          <AlertCircle :size="24" class="section-icon symptoms-icon" />
          <h2 class="section-title">Symptoms</h2>
        </div>
        <div class="pills-container">
          <button
            v-for="symptom in symptoms"
            :key="symptom"
            @click="toggleSymptom(symptom)"
            class="pill"
            :class="{ active: log.symptoms.includes(symptom) }"
          >
            {{ symptom }}
          </button>
        </div>
      </section>

      <!-- Bowel Movement Section -->
      <section class="section glass shadow-soft">
        <div class="section-header">
          <Activity :size="24" class="section-icon bowel-icon" />
          <h2 class="section-title">Bowel Movements</h2>
        </div>
        <div class="counter-row">
          <label class="counter-label">Number of times:</label>
          <div class="counter">
            <button @click="decrementPoop" class="counter-btn">
              <Minus :size="16" />
            </button>
            <span class="counter-value">{{ log.poopCount }}</span>
            <button @click="log.poopCount++" class="counter-btn">
              <Plus :size="16" />
            </button>
          </div>
        </div>
        <div class="bristol-scale">
          <label class="bristol-label">Bristol Stool Scale:</label>
          <div class="bristol-options">
            <button
              v-for="(type, index) in bristolScale"
              :key="index"
              @click="log.poopType = index + 1"
              class="bristol-option"
              :class="{ active: log.poopType === index + 1 }"
            >
              {{ type }}
            </button>
          </div>
        </div>
      </section>

      <!-- Water Intake Section -->
      <section class="section glass shadow-soft">
        <div class="section-header">
          <Droplets :size="24" class="section-icon water-icon" />
          <h2 class="section-title">Water Intake</h2>
        </div>
        <div class="counter-row">
          <label class="counter-label">Glasses (8oz):</label>
          <div class="counter">
            <button @click="decrementWater" class="counter-btn">
              <Minus :size="16" />
            </button>
            <span class="counter-value">{{ log.waterIntake }}</span>
            <button @click="log.waterIntake++" class="counter-btn">
              <Plus :size="16" />
            </button>
          </div>
        </div>
        <div class="water-progress">
          <div 
            class="water-progress-fill" 
            :style="{ width: Math.min(100, (log.waterIntake / 8) * 100) + '%' }"
          ></div>
        </div>
        <p class="water-goal">Goal: 8 glasses</p>
      </section>

      <!-- Supplements Section -->
      <section class="section glass shadow-soft">
        <div class="section-header">
          <Pill :size="24" class="section-icon supplements-icon" />
          <h2 class="section-title">Supplements</h2>
        </div>
        <div class="pills-container">
          <button
            v-for="supplement in commonSupplements"
            :key="supplement"
            @click="toggleSupplement(supplement)"
            class="pill"
            :class="{ active: log.supplements.includes(supplement) }"
          >
            {{ supplement }}
          </button>
        </div>
        <div class="input-row">
          <input
            v-model="newSupplement"
            @keyup.enter="addCustomSupplement"
            class="custom-input"
            placeholder="Add custom supplement"
          />
          <button @click="addCustomSupplement" class="add-btn gradient-primary">
            <Plus :size="20" />
          </button>
        </div>
      </section>

      <!-- Exercise Section -->
      <section class="section glass shadow-soft">
        <div class="section-header">
          <Dumbbell :size="24" class="section-icon exercise-icon" />
          <h2 class="section-title">Exercise</h2>
        </div>
        <textarea
          v-model="log.exercise"
          class="text-area"
          placeholder="What exercise did you do today?"
          rows="3"
        ></textarea>
      </section>

      <!-- Food Section -->
      <section class="section glass shadow-soft">
        <div class="section-header">
          <UtensilsCrossed :size="24" class="section-icon food-icon" />
          <h2 class="section-title">Food Diary</h2>
        </div>
        <div class="input-row">
          <input
            v-model="newFood"
            @keyup.enter="addFood"
            class="custom-input"
            placeholder="Add food item"
          />
          <button @click="addFood" class="add-btn gradient-success">
            <Plus :size="20" />
          </button>
        </div>
        <div class="food-list">
          <div v-for="(food, index) in log.foods" :key="index" class="food-item">
            <span class="food-text">{{ food }}</span>
            <button @click="removeFood(index)" class="remove-btn">
              <X :size="16" />
            </button>
          </div>
        </div>
      </section>

      <!-- Notes Section -->
      <section class="section glass shadow-soft">
        <div class="section-header">
          <FileText :size="24" class="section-icon notes-icon" />
          <h2 class="section-title">Notes</h2>
        </div>
        <textarea
          v-model="log.notes"
          class="text-area"
          placeholder="Any additional notes about your day..."
          rows="4"
        ></textarea>
      </section>

      <!-- Save Button -->
      <button @click="saveLog" :disabled="isSaving" class="save-btn gradient-success shadow-medium">
        <Save v-if="!isSaving" :size="20" />
        <div v-else class="save-spinner"></div>
        {{ isSaving ? 'Saving...' : 'Save Today\'s Log' }}
      </button>
    </div>
  </div>
</template>

<script>
import { 
  Heart, 
  AlertCircle, 
  Activity, 
  Droplets, 
  Pill, 
  Dumbbell, 
  UtensilsCrossed, 
  FileText, 
  Plus, 
  Minus, 
  X, 
  Save 
} from 'lucide-vue-next'
import { dbService } from '@/lib/supabase'

export default {
  name: 'Today',
  components: {
    Heart,
    AlertCircle,
    Activity,
    Droplets,
    Pill,
    Dumbbell,
    UtensilsCrossed,
    FileText,
    Plus,
    Minus,
    X,
    Save
  },
  data() {
    return {
      log: {
        id: null,
        mood: 5,
        symptoms: [],
        poopCount: 0,
        poopType: 4,
        waterIntake: 0,
        supplements: [],
        exercise: '',
        foods: [],
        notes: ''
      },
      newFood: '',
      newSupplement: '',
      isSaving: false,
      symptoms: [
        'Cramping', 'Bloating', 'Gas', 'Diarrhea', 'Constipation',
        'Nausea', 'Fatigue', 'Anxiety', 'Urgency'
      ],
      commonSupplements: [
        'Probiotics', 'Fiber', 'Digestive Enzymes', 'Magnesium',
        'Peppermint Oil', 'IBgard', 'Vitamin D', 'B12'
      ],
      bristolScale: [
        'Type 1: Hard lumps',
        'Type 2: Lumpy sausage',
        'Type 3: Cracked sausage',
        'Type 4: Smooth sausage',
        'Type 5: Soft blobs',
        'Type 6: Mushy consistency',
        'Type 7: Liquid consistency'
      ]
    }
  },
  async mounted() {
    await this.loadTodaysLog()
  },
  methods: {
    getCurrentDate() {
      return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    async loadTodaysLog() {
      try {
        const existingLog = await dbService.getTodaysLog()
        if (existingLog) {
          this.log = {
            id: existingLog.id,
            mood: existingLog.mood,
            poopCount: existingLog.poop_count,
            poopType: existingLog.poop_type,
            waterIntake: existingLog.water_intake,
            exercise: existingLog.exercise,
            notes: existingLog.notes,
            symptoms: existingLog.symptoms?.map(s => s.symptom_name) || [],
            supplements: existingLog.supplements?.map(s => s.supplement_name) || [],
            foods: existingLog.foods?.map(f => f.food_name) || []
          }
        }
      } catch (error) {
        console.error('Error loading today\'s log:', error)
      }
    },

    toggleSymptom(symptom) {
      const index = this.log.symptoms.indexOf(symptom)
      if (index > -1) {
        this.log.symptoms.splice(index, 1)
      } else {
        this.log.symptoms.push(symptom)
      }
    },

    toggleSupplement(supplement) {
      const index = this.log.supplements.indexOf(supplement)
      if (index > -1) {
        this.log.supplements.splice(index, 1)
      } else {
        this.log.supplements.push(supplement)
      }
    },

    addFood() {
      if (this.newFood.trim()) {
        this.log.foods.push(this.newFood.trim())
        this.newFood = ''
      }
    },

    removeFood(index) {
      this.log.foods.splice(index, 1)
    },

    addCustomSupplement() {
      if (this.newSupplement.trim()) {
        this.log.supplements.push(this.newSupplement.trim())
        this.newSupplement = ''
      }
    },

    decrementPoop() {
      if (this.log.poopCount > 0) {
        this.log.poopCount--
      }
    },

    decrementWater() {
      if (this.log.waterIntake > 0) {
        this.log.waterIntake--
      }
    },

    async saveLog() {
      this.isSaving = true
      try {
        // Save the main log data
        const savedLog = await dbService.saveDailyLog({
          mood: this.log.mood,
          poop_count: this.log.poopCount,
          poop_type: this.log.poopType,
          water_intake: this.log.waterIntake,
          exercise: this.log.exercise,
          notes: this.log.notes
        })

        if (savedLog) {
          this.log.id = savedLog.id

          // Save related data
          await Promise.all([
            dbService.saveSymptoms(savedLog.id, this.log.symptoms),
            dbService.saveSupplements(savedLog.id, this.log.supplements),
            dbService.saveFoods(savedLog.id, this.log.foods)
          ])

          // Show success message
          this.showSuccessMessage()
        }
      } catch (error) {
        console.error('Error saving log:', error)
        alert('Error saving your log. Please try again.')
      } finally {
        this.isSaving = false
      }
    },

    showSuccessMessage() {
      // Create a temporary success message
      const message = document.createElement('div')
      message.textContent = 'Log saved successfully!'
      message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 8px 20px rgba(67, 233, 123, 0.4);
      `
      document.body.appendChild(message)
      
      setTimeout(() => {
        document.body.removeChild(message)
      }, 3000)
    }
  }
}
</script>

<style scoped>
.today {
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
  margin-bottom: 0.5rem;
}

.date {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section {
  padding: 2rem;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.section-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.mood-icon { color: #f093fb; }
.symptoms-icon { color: #fa709a; }
.bowel-icon { color: #43e97b; }
.water-icon { color: #4facfe; }
.supplements-icon { color: #667eea; }
.exercise-icon { color: #f5576c; }
.food-icon { color: #38f9d7; }
.notes-icon { color: #764ba2; }

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mood-scale {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
}

.mood-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.mood-button:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.2);
}

.mood-button.active {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 20px rgba(240, 147, 251, 0.4);
}

.pills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.pill {
  padding: 0.75rem 1.25rem;
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.pill:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.2);
}

.pill.active {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 20px rgba(79, 172, 254, 0.4);
}

.counter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.counter-label {
  font-weight: 500;
  color: white;
  font-size: 1.1rem;
}

.counter {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.counter-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.counter-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.counter-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  min-width: 30px;
  text-align: center;
}

.bristol-scale {
  margin-top: 1rem;
}

.bristol-label {
  display: block;
  font-weight: 500;
  color: white;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.bristol-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bristol-option {
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.bristol-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.bristol-option.active {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
  box-shadow: 0 8px 20px rgba(67, 233, 123, 0.4);
}

.water-progress {
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  overflow: hidden;
  margin: 1rem 0;
}

.water-progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 6px;
  transition: width 0.3s ease;
}

.water-goal {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.input-row {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.custom-input {
  flex: 1;
  padding: 1rem;
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(10px);
}

.custom-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.custom-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
}

.add-btn {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn:hover {
  transform: scale(1.05);
}

.text-area {
  width: 100%;
  padding: 1rem;
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  backdrop-filter: blur(10px);
}

.text-area::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.text-area:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
}

.food-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.food-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.food-text {
  color: white;
  font-weight: 500;
}

.remove-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(250, 112, 154, 0.8);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: rgba(250, 112, 154, 1);
  transform: scale(1.1);
}

.save-btn {
  width: 100%;
  padding: 1.25rem;
  border-radius: 20px;
  border: none;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.save-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .section {
    padding: 1.5rem;
  }
  
  .mood-scale {
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
  }
  
  .mood-button {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .counter-row {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .pills-container {
    gap: 0.5rem;
  }
  
  .pill {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>