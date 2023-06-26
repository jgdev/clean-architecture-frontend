<script lang="ts" setup>
import { computed } from 'vue'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { DEFAULT_RESULTS_LIMIT } from '../constants'
type Props = {
  total?: number;
  skip?: number;
  limit?: number;
  onRequest: (params: any) => void
}

const props = defineProps<Props>()
const skip = computed(() => props.skip || 0);
const limit = computed(() => props.limit || DEFAULT_RESULTS_LIMIT);
const total = computed(() => props.total || 0);
const canGoNext = computed(() => (skip.value + limit.value) <= total.value)
const canGoPrevious = computed(() => skip.value > 0)

const requestPrevious = () => {
  if (!canGoPrevious.value) return;
  const result = skip.value - limit.value;
  props.onRequest({
    limit: limit.value,
    skip: result < 0 ? 0 : result,
  })
}

const requestNext = () => {
  if (!canGoNext.value) return;

  props.onRequest({
    limit: limit.value,
    skip: skip.value + limit.value,
  })
}
</script>
<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-1 items-center justify-between">
      <div class="flex items-center justify-center w-full gap-2">
        <ChevronLeftIcon class="w-4 h-4 cursor-pointer" :class="canGoPrevious ? 'hover:text-blue-600' : 'text-gray-300'"
          @click="requestPrevious" />
        <p class="text-sm text-gray-700">
          Showing from
          {{ ' ' }}
          <span class="font-medium">{{ skip + 1 }}</span>
          {{ ' ' }}
          <span v-if="skip + limit < total || skip + limit > total">
            to
            {{ ' ' }}
            <span class="font-medium">{{ skip + limit > total ? total : skip + limit }}</span>
          </span>
          {{ ' ' }}
          <span :hidden="skip + limit > total">
            of
            {{ ' ' }}
            <span class="font-medium">{{ total }}</span>
            {{ ' ' }}
            results
          </span>
        </p>
        <ChevronRightIcon class="w-4 h-4 cursor-pointer" :class="canGoNext ? 'hover:text-blue-600' : 'text-gray-300'"
          @click="requestNext" />
      </div>
    </div>
  </div>
</template>