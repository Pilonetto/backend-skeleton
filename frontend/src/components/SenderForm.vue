<template>
  <v-dialog v-model="visible" max-width="600" persistent>
    <v-card>
      <v-card-title>
        {{ isEditing ? 'Editar número' : 'Novo número' }}
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field v-model="form.phoneNumber" label="Número" required />

          <v-select
            v-model="form.provider"
            label="Provedor"
            :items="['official', 'unofficial']"
            required
          />

          <v-text-field
            v-model="form.token"
            label="Token"
            hint="Obrigatório se provider for 'official'"
            persistent-hint
          />

          <v-text-field
            v-model="form.phoneNumberId"
            label="Phone Number ID"
            hint="Usado em integrações oficiais"
            persistent-hint
          />

          <v-text-field
            v-model="form.wabaId"
            label="WhatsApp Business ID"
            hint="Usado em integrações oficiais"
            persistent-hint
          />

          <v-text-field
            v-model.number="form.cadenceInMs"
            label="Cadência (ms)"
            type="number"
            required
          />

          <v-switch color="secondary" v-model="form.active" label="Ativo?" />

          <div class="d-flex mt-4">
            <v-btn type="submit" color="primary">Salvar</v-btn>
            <v-spacer />
            <v-btn text @click="visible = false" class="ms-2">Cancelar</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import http from '@/api'
import { type SenderNumber } from '@/types/sender.types'

const props = defineProps<{
  open: boolean
  sender: SenderNumber | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const visible = computed({
  get: () => props.open,
  set: (val) => {
    if (!val) emit('close')
  },
})

const isEditing = computed(() => !!props.sender?.id)

const form = ref<SenderNumber>({
  phoneNumber: '',
  provider: 'official',
  token: '',
  phoneNumberId: '',
  cadenceInMs: 3000,
  active: true,
})

watch(
  () => props.sender,
  (s) => {
    form.value = s
      ? { ...s }
      : {
          phoneNumber: '',
          provider: 'official',
          token: '',
          phoneNumberId: '',
          cadenceInMs: 3000,
          active: true,
        }
  },
  { immediate: true },
)

async function handleSubmit() {
  if (isEditing.value && props.sender?.id) {
    await http.put(`/sender-numbers/${props.sender.id}`, form.value)
  } else {
    await http.post('/sender-numbers', form.value)
  }

  emit('saved')
  visible.value = false
}
</script>
