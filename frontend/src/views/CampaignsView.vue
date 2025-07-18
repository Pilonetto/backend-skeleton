<template>
  <div class="d-flex flex-column fill-height">
    <div class="d-flex justify-space-between align-center mb-4">
      <h2 class="text-h5">Campanhas</h2>
      <div class="d-flex align-center gap-2">
        <v-btn @click="openForm" color="primary">Nova campanha</v-btn>

        <v-btn class="mx-1" color="warning" @click="toggleShowHidden">
          {{ showHiddenOnly ? 'Ocultar ocultas' : 'Mostrar ocultas' }}
        </v-btn>
      </div>
    </div>

    <v-data-table :items="filteredCampaigns" :headers="headers" item-value="id" class="elevation-1">
      <template #item.status="{ value }">
        <v-chip :color="getStatusColor(value)" dark>{{ value }}</v-chip>
      </template>

      <template #item.scheduledAt="{ value }">
        {{ formatDate(value) }}
      </template>

      <template #item.createdAt="{ value }">
        {{ formatDate(value) }}
      </template>

      <template #item.actions="{ item }">
        <v-btn
          class="text-none text-subtitle-1 mx-2"
          color="green"
          size="small"
          variant="flat"
          style="cursor: pointer"
          @click="viewResults(item.id)"
        >
          Ver resultados
        </v-btn>

        <v-tooltip text="Ocultar campanha" location="top">
          <template #activator="{ props }">
            <v-btn
              icon
              v-bind="props"
              size="small"
              variant="text"
              color="grey-darken-1"
              class="mx-5"
              @click="hideCampaign(item.id)"
            >
              <v-icon size="18">mdi-eye-off</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </template>
    </v-data-table>

    <CampaignForm v-model:open="showForm" @close="showForm = false" @saved="loadCampaigns" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import CampaignForm from '@/components/CampaignForm.vue'
import http from '@/api'
import type { Campaign } from '@/types/campaign.types'

const router = useRouter()
const showForm = ref(false)
const campaigns = ref<Campaign[]>([])

const headers = [
  { title: 'Nome', key: 'name' },
  { title: 'Tipo', key: 'type' },
  { title: 'Status', key: 'status' },
  { title: 'Agendada', key: 'scheduledAt' },
  { title: 'Criada em', key: 'createdAt' },
  { title: 'Ações', key: 'actions', sortable: false },
]

const showHiddenOnly = ref(false)

const filteredCampaigns = computed(() => {
  return showHiddenOnly.value ? campaigns.value.filter((c) => c.hide === true) : campaigns.value
})

function toggleShowHidden() {
  showHiddenOnly.value = !showHiddenOnly.value
}
function openForm() {
  showForm.value = true
}

async function hideCampaign(id: number) {
  try {
    await http.post(`api/campaigns/${id}/hide`, { hide: true })
    await loadCampaigns()
  } catch (error) {
    console.error('Erro ao ocultar campanha:', error)
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'green'
    case 'scheduled':
      return 'blue'
    case 'executing':
      return 'orange'
    case 'failed':
      return 'red'
    default:
      return 'grey'
  }
}

function formatDate(value?: string): string {
  return value ? new Date(value).toLocaleString() : '—'
}

function viewResults(id: number) {
  router.push(`campaigns/${id}/results`)
}

async function loadCampaigns() {
  const { data } = await http.get('api/campaigns')
  campaigns.value = data
}

onMounted(loadCampaigns)
</script>
