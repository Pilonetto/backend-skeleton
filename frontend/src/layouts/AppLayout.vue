<template>
  <v-app>
    <!-- MENU LATERAL -->
    <v-navigation-drawer
      v-model="drawer"
      :permanent="isDesktop"
      app
      color="white"
      class="pa-3 elevation-2"
      width="240"
    >
      <v-list>
        <v-list-item class="px-4">
          <v-list-item-title class="text-h6 font-weight-bold"> Painel </v-list-item-title>
        </v-list-item>

        <v-divider class="my-2" />

        <v-list-item
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          link
          router
          exact
          class="d-flex align-center rounded-lg mb-2"
          active-class="bg-primary text-white"
        >
          <template v-slot:prepend>
            <v-icon class="me-3">{{ item.icon }}</v-icon>
          </template>

          <template v-slot:title>
            <span class="text-body-1 font-weight-medium">{{ item.label }}</span>
          </template>
        </v-list-item>

        <v-divider class="my-4" />

        <!-- Logout ou outro item fixo -->
        <v-list-item @click="logout" class="mt-auto rounded-lg text-red" style="cursor: pointer">
          <v-list-item-icon>
            <template v-slot:prepend>
              <v-icon class="me-3">mdi-logout</v-icon>
            </template>
          </v-list-item-icon>
          <template v-slot:title>
            <span class="text-body-1 font-weight-medium">Sair</span>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- BARRA SUPERIOR -->
    <v-app-bar app color="secondary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer">
        <v-icon color="white">mdi-menu</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title>AInternet Group</v-toolbar-title>
    </v-app-bar>

    <!-- CONTEÚDO -->
    <v-main class="bg-grey-lighten-5">
      <v-container fluid class="pa-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()
const isDesktop = computed(() => mdAndUp.value)
const drawer = ref(isDesktop.value)

const menuItems = [
  { label: 'Dashboard', icon: 'mdi-view-dashboard', to: '/' },
  { label: 'Senders', icon: 'mdi-account-voice', to: '/senders' },
  { label: 'Campaigns', icon: 'mdi-email-multiple-outline', to: '/campaign' },
  { label: 'Settings', icon: 'mdi-cog-outline', to: '/settings' },
]

function logout() {
  // Aqui pode limpar token, redirecionar, etc
  console.log('Logout')
}
</script>
