<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Resultados da campanha: {{ campaignName }}</span>
        <v-btn size="small" color="primary" @click="exportToCsv">Exportar CSV</v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text>
        <!-- Filtros -->
        <v-row class="mb-4" dense>
          <v-col cols="12" md="3">
            <v-select
              v-model="statusFilter"
              :items="['pending', 'sent', 'success', 'failed']"
              label="Filtrar por status"
              clearable
              variant="outlined"
              density="compact"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="typeFilter"
              :items="['button', 'text', 'read', 'delivered', 'failed']"
              label="Filtrar por tipo de interação"
              clearable
              variant="outlined"
              density="compact"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="interactionPresence"
              :items="[
                { title: 'Todas', value: 'all' },
                { title: 'Com interação', value: 'with' },
                { title: 'Sem interação', value: 'without' },
              ]"
              item-title="title"
              item-value="value"
              label="Interações"
              clearable
              variant="outlined"
              density="compact"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="search"
              label="Buscar telefone ou interação"
              clearable
              variant="outlined"
              density="compact"
            />
          </v-col>
        </v-row>

        <!-- Tabela -->
        <v-data-table
          :items="filteredRecipients"
          :headers="headers"
          class="elevation-1"
          density="compact"
        >
          <template #item.phone="{ value }">
            <a
              :href="`https://wa.me/${value}`"
              target="_blank"
              rel="noopener noreferrer"
              style="text-decoration: none; color: inherit"
            >
              {{ formatPhone(value) }}
            </a>
          </template>
          <template #item.status="{ value }">
            <v-chip size="x-small" :color="getStatusColor(value)" dark variant="flat">{{
              value
            }}</v-chip>
          </template>

          <template #item.interactionType="{ value }">
            <v-chip size="x-small" :color="getInteractionColor(value)">
              {{ value || '—' }}
            </v-chip>
          </template>

          <template #item.interaction="{ value }">
            {{ value || '—' }}
          </template>

          <template #item.createdAt="{ value }">
            {{ formatDate(value) }}
          </template>

          <template #item.errorMessage="{ value }">
            {{ value === 'ok' ? '—' : value || '—' }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import http from '@/api'

interface Recipient {
  id: number
  phone: string
  status: string
  createdAt: string
  errorMessage?: string
  interaction?: string
  interactionType?: 'button' | 'text' | 'read' | 'delivered' | 'failed'
}

const route = useRoute()
const campaignId = Number(route.params.id)

const campaignName = ref('')
const recipients = ref<Recipient[]>([])

const statusFilter = ref<string | null>(null)
const typeFilter = ref<string | null>(null)
const interactionPresence = ref<'all' | 'with' | 'without'>('all')
const search = ref<string>('')

const headers = [
  { title: 'Telefone', key: 'phone' },
  { title: 'Status', key: 'status' },
  { title: 'Tipo Interação', key: 'interactionType' },
  { title: 'Interação', key: 'interaction' },
  { title: 'Erro', key: 'errorMessage' },
  { title: 'Data', key: 'createdAt' },
]

function formatPhone(raw: string): string {
  // Remove qualquer coisa que não for número
  const digits = raw.replace(/\D/g, '')

  // Remove o DDI se começar com 55
  const local = digits.startsWith('55') ? digits.slice(2) : digits

  // Aplica máscara
  const match = local.match(/^(\d{2})(\d{5})(\d{4})$/)
  if (!match) return raw

  const [, ddd, prefix, suffix] = match
  return `(${ddd}) ${prefix}-${suffix}`
}

const filteredRecipients = computed(() => {
  return recipients.value.filter((r) => {
    const matchStatus = !statusFilter.value || r.status === statusFilter.value
    const matchType = !typeFilter.value || r.interactionType === typeFilter.value
    const matchPresence =
      interactionPresence.value === 'all' ||
      (interactionPresence.value === 'with' && !!r.interaction) ||
      (interactionPresence.value === 'without' && !r.interaction)
    const matchSearch =
      !search.value ||
      r.phone.includes(search.value) ||
      r.interaction?.toLowerCase().includes(search.value.toLowerCase())

    return matchStatus && matchType && matchPresence && matchSearch
  })
})

function getStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'grey'
    case 'sent':
      return 'green'
    case 'success':
      return 'blue-grey'
    case 'failed':
      return 'red'
    default:
      return 'blue'
  }
}

function getInteractionColor(type?: string) {
  switch (type) {
    case 'button':
      return 'green'
    case 'text':
      return 'orange'
    case 'read':
      return 'blue'
    case 'delivered':
      return 'grey'
    case 'failed':
      return 'red'
    default:
      return 'default'
  }
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString()
}

function exportToCsv() {
  const data = filteredRecipients.value
  const headers = ['Telefone', 'Status', 'Tipo Interação', 'Interação', 'Erro', 'Data']
  const rows = data.map((r) => [
    r.phone,
    r.status,
    r.interactionType ?? '',
    r.interaction ?? '',
    r.errorMessage === 'ok' ? '' : (r.errorMessage ?? ''),
    formatDate(r.createdAt),
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${(cell ?? '').toString().replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `campanha-${campaignId}-resultados.csv`)
  link.click()
}

onMounted(async () => {
  try {
    const { data } = await http.get(`/api/campaigns/${campaignId}/results`)
    campaignName.value = data.name || `Campanha #${campaignId}`
    recipients.value = data.recipients || []
  } catch (err) {
    console.error('Erro ao buscar resultados da campanha', err)
  }
})
</script>
