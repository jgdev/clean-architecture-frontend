<script lang="ts" setup>
import { onMounted, onUpdated, reactive, watch } from 'vue';
import { TrashIcon } from "@heroicons/vue/24/outline"
import { Button, Input, Checkbox } from 'flowbite-vue';

type InputOptions = {
  type: string;
  multiple?: boolean;
  options: Array<[string, boolean]>
  minInput?: number;
  maxLength?: number;
  getPlaceholder?: (index: number) => string
  getLabel?: (index: number) => string;
}

type Props = {
  error?: string;
  loading?: boolean;
  getInput: () => InputOptions
  updateInputValues: (inputs: { [key: string]: { value: string } }, options?: {
    [key: string]: { value: boolean, label: string }
  }) => void
};

const { loading, getInput, updateInputValues, error } = defineProps<Props>()
const state = reactive<{ input: InputOptions | undefined, inputs: { [key: string]: any }, options: { [key: string]: any } }>({
  input: undefined,
  inputs: {},
  options: {}
})

const updateInputState = () => {
  const input = getInput();
  state.input = input;
  state.inputs = new Array(input.minInput || 1).fill(null).reduce((result, _) => {
    return { ...result, [crypto.randomUUID()]: { value: '' } }
  }, {})
  state.options = (input.options || []).reduce((result, _, index) => {
    return { ...result, [index]: { value: input.options[index][1], label: input.options[index][0] } }
  }, {})
}

const handleAddInput = () => {
  const toAdd = crypto.randomUUID();
  state.inputs = {
    ...state.inputs,
    [toAdd]: { value: '' },
  }
}

const handleRemoveInput = (key: string) => {
  state.inputs = Object.keys(state.inputs).filter(k => k !== key).reduce((result, id) => {
    return { ...result, [id]: state.inputs[id] }
  }, {})
}

const handleChangeOption = (e: InputEvent, index: number) => {
  state.options[index].value = (e.target as any).checked
  updateInputValues(state.inputs, state.options)
}

const getLabelOf = (index: number) => {
  return state.input?.getLabel && state.input.getLabel(index) || ''
}

const getPlaceholderOf = (index: number) => {
  return state.input?.getPlaceholder && state.input.getPlaceholder(index) || ''
}

onMounted(() => {
  updateInputState()
})

watch(getInput, () => updateInputState())


onUpdated(() => {
  const firstInput = document.querySelector('input.operation-field');
  (window as any).firstInput = firstInput
})
</script>
<template>
  <div>
    <div v-for="(key, index) in Object.keys(state.inputs)" class="flex gap-2 items-center mb-4" id="inputs-container">
      <div class="flex flex-col w-full">
        <label class="text-xs p-1">{{ getLabelOf(index) }}</label>
        <Input size="sm" class="w-full operation-field" :disabled="loading" :placeholder="getPlaceholderOf(index)"
          autocomplete="off" v-model="state.inputs[key].value"
          @change="() => updateInputValues(state.inputs, state.options)" required :max="state.input?.maxLength || 0"
          :type="state.input?.type" />
      </div>
      <TrashIcon :class="`mt-6 ml-2 mr-4 w-5 h-5 text-gray-800 hover:text-blue-500 cursor-pointer`"
        v-if="!!state.input?.multiple" @click="() => handleRemoveInput(key)" />
    </div>
    <div v-if="state.input?.options" class="grid grid-cols-2">
      <Checkbox v-for="(_, index) in Object.keys(state.options)" :label="state.options[index].label"
        :model-value="state.options[index].value" @change="(e: InputEvent) => handleChangeOption(e, index)"
        :disabled="loading" />
    </div>
    <Button class="w-full" color="light" v-if="!!state.input?.multiple" @click="() => handleAddInput()">+ Add number
      argument</Button>
    <div v-if="!!error" class="text-center p-4 pb-0">
      <h3 class="text-red-600 font-bold text-sm p-0 m-0">{{ error }}</h3>
    </div>
  </div>
</template>