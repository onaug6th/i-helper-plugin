import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import ContextMenu from "@onaug6th/vue3-context-menu";

createApp(App).use(ContextMenu).use(router).mount('#app');
