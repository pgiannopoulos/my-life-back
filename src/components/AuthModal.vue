<template>
  <div v-if="showModal" class="auth-modal-overlay" @click="closeModal">
    <div class="auth-modal glass shadow-strong" @click.stop>
      <div class="auth-header">
        <h2 class="auth-title">{{ isSignUp ? 'Create Account' : 'Sign In' }}</h2>
        <p class="auth-subtitle">
          {{ isSignUp ? 'Start tracking your IBS journey' : 'Welcome back to your health tracker' }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="form-input"
            placeholder="Enter your email"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="form-input"
            placeholder="Enter your password"
            minlength="6"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="auth-button gradient-primary shadow-medium"
        >
          <span v-if="!isLoading">{{ isSignUp ? 'Create Account' : 'Sign In' }}</span>
          <span v-else>{{ isSignUp ? 'Creating Account...' : 'Signing In...' }}</span>
        </button>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>

      <div class="auth-footer">
        <p class="auth-switch">
          {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
          <button @click="toggleMode" class="auth-switch-btn">
            {{ isSignUp ? 'Sign In' : 'Sign Up' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuth } from '@/composables/useAuth'

export default {
  name: 'AuthModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  data() {
    return {
      isSignUp: false,
      email: '',
      password: '',
      isLoading: false,
      error: ''
    }
  },
  computed: {
    showModal() {
      return this.show
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
      this.resetForm()
    },
    
    toggleMode() {
      this.isSignUp = !this.isSignUp
      this.error = ''
    },
    
    resetForm() {
      this.email = ''
      this.password = ''
      this.error = ''
      this.isLoading = false
      this.isSignUp = false
    },
    
    async handleSubmit() {
      this.isLoading = true
      this.error = ''
      
      const { signUp, signIn } = useAuth()
      
      try {
        const { data, error } = this.isSignUp 
          ? await signUp(this.email, this.password)
          : await signIn(this.email, this.password)
        
        if (error) {
          this.error = error.message
        } else {
          if (this.isSignUp) {
            this.error = 'Please check your email to confirm your account'
          } else {
            this.closeModal()
          }
        }
      } catch (err) {
        this.error = 'An unexpected error occurred'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.auth-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.auth-modal {
  width: 100%;
  max-width: 400px;
  margin: 1rem;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.auth-header {
  padding: 2rem 2rem 1rem;
  text-align: center;
}

.auth-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.auth-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
}

.auth-form {
  padding: 1rem 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  color: white;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 1rem;
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.form-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
}

.auth-button {
  width: 100%;
  padding: 1rem;
  border-radius: 16px;
  border: none;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.auth-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.auth-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: #ff6b6b;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.75rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.auth-footer {
  padding: 1rem 2rem 2rem;
  text-align: center;
}

.auth-switch {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.auth-switch-btn {
  background: none;
  border: none;
  color: #4facfe;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 0.5rem;
}

.auth-switch-btn:hover {
  color: #00f2fe;
}
</style>