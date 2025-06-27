<template>
  <div class="app">
    <!-- Auth Modal -->
    <AuthModal :show="showAuthModal" @close="showAuthModal = false" />

    <!-- Navigation -->
    <nav class="nav glass shadow-medium">
      <div class="nav-container">
        <div class="nav-brand">
          <Heart class="nav-logo" :size="28" />
          <h1 class="nav-title">IBS Tracker</h1>
        </div>
        
        <div v-if="isAuthenticated" class="nav-links">
          <router-link 
            v-for="link in navLinks" 
            :key="link.path"
            :to="link.path" 
            class="nav-link"
            :class="{ active: $route.path === link.path }"
          >
            <component :is="link.icon" :size="20" />
            <span>{{ link.name }}</span>
          </router-link>
        </div>

        <div class="nav-auth">
          <div v-if="isAuthenticated" class="user-menu">
            <span class="user-email">{{ user?.email }}</span>
            <button @click="handleSignOut" class="sign-out-btn">
              <LogOut :size="18" />
            </button>
          </div>
          <button v-else @click="showAuthModal = true" class="auth-btn gradient-primary">
            Sign In
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main">
      <div v-if="authLoading" class="loading-screen">
        <div class="loading-spinner"></div>
        <p class="loading-text">Loading your health data...</p>
      </div>
      <div v-else-if="!isAuthenticated" class="welcome-screen">
        <div class="welcome-content glass shadow-strong">
          <Heart class="welcome-icon" :size="64" />
          <h2 class="welcome-title">Welcome to IBS Tracker</h2>
          <p class="welcome-description">
            Track your symptoms, mood, diet, and wellness journey with our comprehensive IBS management tool.
          </p>
          <button @click="showAuthModal = true" class="welcome-btn gradient-primary shadow-medium">
            Get Started
          </button>
        </div>
      </div>
      <router-view v-else />
    </main>
  </div>
</template>

<script>
import { Heart, Home, Calendar, TrendingUp, Settings, LogOut } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import AuthModal from '@/components/AuthModal.vue'

export default {
  name: 'App',
  components: {
    Heart,
    Home,
    Calendar,
    TrendingUp,
    Settings,
    LogOut,
    AuthModal
  },
  data() {
    return {
      showAuthModal: false,
      navLinks: [
        { path: '/today', name: 'Today', icon: 'Home' },
        { path: '/history', name: 'History', icon: 'Calendar' },
        { path: '/insights', name: 'Insights', icon: 'TrendingUp' },
        { path: '/settings', name: 'Settings', icon: 'Settings' }
      ]
    }
  },
  setup() {
    const { user, isAuthenticated, loading, signOut, initialize } = useAuth()
    
    return {
      user,
      isAuthenticated,
      authLoading: loading,
      signOut,
      initialize
    }
  },
  async mounted() {
    await this.initialize()
  },
  methods: {
    async handleSignOut() {
      const { error } = await this.signOut()
      if (error) {
        console.error('Error signing out:', error)
      }
    }
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  border-radius: 0 0 24px 24px;
  margin-bottom: 2rem;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-logo {
  color: #667eea;
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3));
}

.nav-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 16px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-link:hover::before {
  opacity: 1;
}

.nav-link:hover {
  color: white;
  transform: translateY(-2px);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-auth {
  display: flex;
  align-items: center;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-email {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-weight: 500;
}

.sign-out-btn {
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

.sign-out-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.auth-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 16px;
  border: none;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.auth-btn:hover {
  transform: translateY(-2px);
}

.main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
  width: 100%;
}

.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1.5rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
}

.welcome-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
}

.welcome-content {
  text-align: center;
  padding: 3rem;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
}

.welcome-icon {
  color: #667eea;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3));
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.welcome-btn {
  padding: 1rem 2rem;
  border-radius: 16px;
  border: none;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.welcome-btn:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .nav-container {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .nav-link span {
    display: none;
  }
  
  .main {
    padding: 0 1rem 2rem;
  }

  .welcome-content {
    padding: 2rem;
    margin: 1rem;
  }

  .user-email {
    display: none;
  }
}
</style>