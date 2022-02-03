import { createApp } from 'vue'
import { store, key } from '@/store'
import './sass/main.scss'
import App from './App.vue'

const app = createApp(App)
app.use(store, key)
app.mount('#app')
