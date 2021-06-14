import { createRouter, createWebHashHistory } from 'vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [

  {
    path: '/',
    component: () => import('../views/notes/index.vue')
  },
  {
    path: '/note',
    component: () => import('../views/note/index.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
