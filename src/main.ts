import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Today from './views/Today.vue'
import History from './views/History.vue'
import Insights from './views/Insights.vue'
import Settings from './views/Settings.vue'
import './style.css'

const routes = [
  { path: '/', redirect: '/today' },
  { path: '/today', component: Today },
  { path: '/history', component: History },
  { path: '/insights', component: Insights },
  { path: '/settings', component: Settings }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App).use(router).mount('#app')