<script lang="ts" setup>
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/24/outline' 
</script>
<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-1 items-center justify-between">
      <div class="flex items-center justify-center w-full">
        <p class="text-sm text-gray-700">
          Showing
          {{ ' ' }}
          <span class="font-medium">1</span>
          {{ ' ' }}
          to
          {{ ' ' }}
          <span class="font-medium">10</span>
          {{ ' ' }}
          of
          {{ ' ' }}
          <span class="font-medium">97</span>
          {{ ' ' }}
          results
        </p>
      </div>
    </div>
  </div>
</template>