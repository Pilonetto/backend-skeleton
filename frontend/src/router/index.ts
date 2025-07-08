import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import SettingsView from '@/views/SettingsView.vue'
import SendersView from '@/views/SendersView.vue'
import CampaignsView from '@/views/CampaignsView.vue'
import CampaignResults from '@/views/CampaignResults.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', component: DashboardView },
      { path: 'settings', component: SettingsView },
      { path: 'senders', component: SendersView },
      { path: 'campaign', component: CampaignsView },
      { path: 'campaigns/:id/results', component: CampaignResults },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
