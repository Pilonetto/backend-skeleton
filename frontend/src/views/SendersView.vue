<template>
  <div class="d-flex flex-column fill-height px-2">
    <div class="d-flex justify-space-between align-center mb-4">
      <h2 class="text-h5">Gerenciar Números</h2>
      <v-btn color="primary" @click="newSender">Novo número</v-btn>
    </div>

    <v-data-table
      :items="senders"
      :headers="headers"
      item-value="id"
      class="flex-grow-1"
      density="comfortable"
    >
      <!-- ✅ STATUS -->
      <template #item.active="{ value }">
        <v-chip :color="value ? 'green' : 'grey'" dark>
          {{ value ? 'Ativo' : 'Inativo' }}
        </v-chip>
      </template>

      <!-- ✅ PROVIDER -->
      <template #item.provider="{ value }">
        <v-chip :color="value === 'official' ? 'blue' : 'orange'" dark>
          {{ value === 'official' ? 'Oficial' : 'Não Oficial' }}
        </v-chip>
      </template>

      <!-- ✅ AÇÕES -->
      <template #item.actions="{ item }">
        <v-btn
          class="text-none text-subtitle-1"
          color="#5865f2"
          size="small"
          variant="flat"
          @click="editSender(item)"
          style="cursor: pointer"
        >
          Editar
        </v-btn>
        <v-btn
          class="text-none text-subtitle-1 mx-2"
          color="rgb(244, 67, 54)"
          size="small"
          variant="flat"
          @click="deleteSender(item?.id ?? 0)"
          style="cursor: pointer"
        >
          Excluir
        </v-btn>
      </template>
    </v-data-table>

    <SenderForm
      :open="showForm"
      :sender="selectedSender"
      @close="showForm = false"
      @saved="loadSenders"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/api'
import { type SenderNumber } from '@/types/sender.types'
import SenderForm from '@/components/SenderForm.vue'

const senders = ref<SenderNumber[]>([])
const showForm = ref(false)
const selectedSender = ref<SenderNumber | null>(null)

const headers = [
  { title: 'Número', key: 'phoneNumber' },
  { title: 'Provedor', key: 'provider' },
  { title: 'Cadência (ms)', key: 'cadenceInMs' },
  { title: 'Último envio', key: 'lastSentAt' },
  { title: 'Status', key: 'active' },
  { title: 'Ações', key: 'actions', sortable: false },
]

async function loadSenders() {
  const { data } = await http.get('api/sender-numbers')
  senders.value = data
}

function newSender() {
  selectedSender.value = null
  showForm.value = true
}

function editSender(sender: SenderNumber) {
  selectedSender.value = { ...sender }
  showForm.value = true
}

async function deleteSender(id: number) {
  if (confirm('Tem certeza que deseja excluir?')) {
    await http.delete(`api/sender-numbers/${id}`)
    await loadSenders()
  }
}

onMounted(loadSenders)
</script>
