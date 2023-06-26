<script lang="ts" setup>
import { ref, reactive, watch, computed } from 'vue'
import { Modal, Button, Spinner, Select } from 'flowbite-vue';
import FormOperationInput from './FormOperationInput.vue';
import { FetchResources, Operation } from '../types';
import { mapConfiguration } from '../utils/operations';

type Props = {
  onClose: () => void
  onSubmit: (operationId: string, args: any[]) => Promise<void>
  operations: FetchResources<Operation>
}

const props = defineProps<Props>()

const operationsConfig = computed(() => (props.operations.result?.result || []).map(operation => mapConfiguration[operation.type]).sort((a: Operation, b: Operation) => {
  if (a.name < b.name) return 1;
  if (b.name < a.name) return -1;
  return 0;
}))

const form = ref<HTMLFormElement>()
const loading = ref(false)
const operationSelected = ref('')
const error = ref('')
const state = reactive({
  inputs: {},
  options: {}
})

const onClose = () => {
  if (loading.value) return;
  props.onClose();
}

const onSubmit = (e: Event) => {
  e.preventDefault();
  const inputArgs = Object.values(state.inputs).map((v: any) => Number(v?.value))
  const optionsArgs = Object.values(state.options).map((v: any) => v.value);
  loading.value = true
  error.value = ''

  props.onSubmit(operationSelected.value, [...inputArgs, ...optionsArgs]).then(() => {
    loading.value = false;
    onClose()
  }).catch(err => {
    loading.value = false;
    error.value = err.detail || err.msg || err
  })
}

const handleSubmit = () => {
  form.value?.requestSubmit()
}

const handleInputsChange = (inputs: any, options: any) => {
  state.inputs = inputs;
  state.options = options;
  error.value = ''
}

watch(operationSelected, () => {
  error.value = ''
})
</script>

<template>
  <Modal @close="onClose" size="sm" :popup="true">
    <template #header>
      <h1>Perform operation</h1>
    </template>
    <template #body>
      <form @submit="onSubmit" ref="form">
        <Select size="sm" placeholder="Operation type" :disabled="loading" class="mb-4" :options="operationsConfig"
          v-model="operationSelected" required />
        <div class="flex flex-col gap-4">
          <FormOperationInput v-if="!!operationSelected"
            :get-input="() => operationsConfig.find(operation => operation.value === operationSelected)?.input || null"
            :update-input-values="(inputs: any, options: any) => handleInputsChange(inputs, options)" :loading="loading"
            :error="error" />
        </div>
      </form>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <Button color="light" @click="onClose" :disabled="loading">Cancel</Button>
        <Button type="submit" color="default" outline :disabled="loading" @click="handleSubmit">
          <div class="flex justify-center items-center gap-2">
            {{ loading ? 'Performing ...' : 'Submit' }}
            <Spinner color="blue" size="4" v-if="loading" />
          </div>
        </Button>
      </div>
    </template>
  </Modal>
</template>