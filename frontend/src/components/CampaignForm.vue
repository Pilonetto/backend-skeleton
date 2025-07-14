<template>
  <v-dialog v-model="visible" max-width="700" persistent>
    <v-card>
      <v-card-title>Criar campanha</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-text-field v-model="form.name" label="Nome da campanha" required />

          <v-autocomplete
            v-model="form.senderNumberId"
            label="Remetente"
            :items="senderOptions"
            item-title="phoneNumber"
            item-value="id"
            return-object
            required
            @update:modelValue="onSenderSelected"
          />

          <v-select
            v-model="form.type"
            label="Tipo de conteúdo"
            :items="['text', 'media', 'template']"
            required
          />

          <v-textarea
            v-if="form.type === 'text'"
            v-model="form.content"
            label="Mensagem de texto"
            auto-grow
            required
          />

          <template v-if="form.type === 'media'">
            <v-text-field v-model="form.content" label="URL da mídia" required />
            <v-text-field v-model="form.caption" label="Legenda (opcional)" />
          </template>

          <v-select
            v-if="form.type === 'template'"
            v-model="form.templateName"
            label="Template"
            :items="templateOptions"
            item-title="name"
            item-value="name"
            :disabled="!form.senderNumberId"
            required
          />

          <v-textarea v-model="phonesText" label="Destinatários (um por linha)" rows="4" required />

          <v-text-field
            v-model="form.scheduledAt"
            label="Agendar envio (opcional)"
            type="datetime-local"
          />

          <div class="d-flex justify-end mt-4">
            <v-btn color="primary" type="submit">Salvar</v-btn>
            <v-btn @click="$emit('close')" class="ms-2">Cancelar</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import http from '@/api'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits(['update:open', 'close', 'saved'])

const visible = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val),
})

interface FormData {
  name: string
  type: 'text' | 'media' | 'template'
  templateName: string
  content: string
  caption: string
  senderNumberId: { id: number; phoneNumber: string } | null
  scheduledAt: string
}

const form = ref<FormData>({
  name: '',
  type: 'text',
  templateName: '',
  content: '',
  caption: '',
  senderNumberId: null,
  scheduledAt: '',
})

const phonesText = ref('')
const senderOptions = ref<{ id: number; phoneNumber: string }[]>([])
const templateOptions = ref<{ id: string; name: string }[]>([])

watch(
  () => props.open,
  (val) => {
    if (val) resetForm()
  },
)

function resetForm() {
  form.value = {
    name: '',
    type: 'text',
    content: '',
    caption: '',
    templateName: '',
    senderNumberId: null,
    scheduledAt: '',
  }
  phonesText.value = ''
  templateOptions.value = []
}

async function onSenderSelected(sender: any) {
  form.value.type = 'text' // reseta tipo para evitar erro

  if (!sender?.id) return
  try {
    const { data } = await http.get(`api/sender-numbers/${sender.id}/templates`)
    // Supondo que o backend já retorna { id, name }
    templateOptions.value = data
  } catch (error) {
    console.error('Erro ao buscar templates:', error)
    templateOptions.value = []
  }
}

async function submit() {
  if (!form.value.senderNumberId) return

  const payload = {
    name: form.value.name,
    type: form.value.type,
    templateName: form.value.templateName,
    content: form.value.content,
    caption: form.value.caption || undefined,
    senderNumberId: form.value.senderNumberId?.id ?? 0,
    scheduledAt: form.value.scheduledAt || undefined,
    phones: phonesText.value
      .split(/\r?\n/)
      .map((p) => p.trim())
      .filter((p) => p),
  }

  await http.post('api/campaigns', payload)
  emit('saved')
  emit('close')
}

onMounted(async () => {
  const { data } = await http.get('api/sender-numbers')
  senderOptions.value = data
})
</script>
