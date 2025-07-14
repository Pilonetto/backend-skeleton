<template>
  <v-container>
    <v-card>
      <v-card-title>Resultados da campanha: {{ campaignName }}</v-card-title>
      <v-divider />

      <v-card-text>
        <v-data-table :items="recipients" :headers="headers" class="elevation-1" density="compact">
          <template #item.status="{ value }">
            <v-chip :color="getStatusColor(value)" dark>{{ value }}</v-chip>
          </template>

          <template #item.createdAt="{ value }">
            {{ formatDate(value) }}
          </template>

          <template #item.errorMessage="{ value }">
            {{ value || '—' }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import http from '@/api'

interface Recipient {
  id: number
  phone: string
  status: string
  createdAt: string
  errorMessage?: string
}

const route = useRoute()
const campaignId = Number(route.params.id)

const campaignName = ref('')
const recipients = ref<Recipient[]>([])

const headers = [
  { title: 'Telefone', key: 'phone' },
  { title: 'Status', key: 'status' },
  { title: 'Erro', key: 'errorMessage' },
  { title: 'Data', key: 'createdAt' },
]

function getStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'grey'
    case 'success':
      return 'green'
    case 'failed':
      return 'red'
    default:
      return 'blue'
  }
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString()
}

onMounted(async () => {
  try {
    const { data } = await http.get(`api/campaigns/${campaignId}/results`)
    campaignName.value = data.name || `Campanha #${campaignId}`
    recipients.value = data.recipients || []
  } catch (err) {
    console.error('Erro ao buscar resultados da campanha:', err)
  }
})
</script>
