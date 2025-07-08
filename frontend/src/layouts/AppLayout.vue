<template>
  <v-app>
    <!-- MENU LATERAL -->
    <v-navigation-drawer
      v-model="drawer"
      :permanent="isDesktop"
      app
      color="grey-lighten-4"
      class="pt-4"
    >
      <v-list>
        <v-list-item class="px-4">
          <v-list-item-title class="text-h6 font-weight-bold"> Painel </v-list-item-title>
        </v-list-item>

        <v-divider class="my-2" />

        <v-list-item v-for="item in menuItems" :key="item.to" :to="item.to" link router exact>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </v-list-item>

        <v-divider class="my-4" />

        <!-- Logout ou outro item fixo -->
        <v-list-item @click="logout" class="text-red">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Sair</v-list-item-title>
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
  { label: 'Senders', icon: 'mdi-phone', to: '/senders' },
  { label: 'Campaigns', icon: 'mdi-phone', to: '/campaign' },
  { label: 'Settings', icon: 'mdi-cog', to: '/settings' },
]

function logout() {
  // Aqui pode limpar token, redirecionar, etc
  console.log('Logout')
}
</script>
