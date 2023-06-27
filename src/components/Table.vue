<script lang="ts" setup>
import { Spinner } from 'flowbite-vue'
import { FetchAction, FetchResources, Record, User } from '../types'
import Pagination from './Pagination.vue'
import { computed } from 'vue'

type Column<T> = {
  label?: string
  render?: (row: T) => any
  flex?: number;
  slotName?: string;
  class?: string
}

export type Props<T> = {
  columns: Column<T>[]
  data: any[]
  emptyMessage?: string;
  loading?: boolean;
  onChangePagination: (params: any) => void
  user: FetchAction<User>
  records: FetchResources<Record>
  deleteRecord: FetchAction<void>
}

const props = defineProps<Props<Record>>()

const loading = computed(() => props.user.loading || props.records.loading || props.deleteRecord.loading)
</script>

<template>
  <div class="flex flex-col justify-between">
    <div class="grow block overflow-y-auto w-full table-container sm:max-w-3xl sm:m-auto">
      <div class="flex flex-col justify-center items-center w-full">
        <div class="grow p-8 transition duration-300 ease-in-out" v-if="loading">
          <Spinner size="4" color="blue" />
        </div>
        <div class="text-gray-500" v-if="!loading && !data.length">No records found</div>
        <div class="w-full">
          <table class="table table-auto w-full" v-if="!!data.length && !loading">
            <thead class="text-left text-xs font-medium text-gray-700 uppercase border-b">
              <tr>
                <th v-for="(column) in columns" scope="col" class="px-6 py-3 w-auto no-wrap">
                  {{ column.label || '' }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item) in data || []" class="bg-white border-b hover:bg-gray-50">
                <td class="group px-6 py-4 text-xs font-normal text-gray-700 w-full" v-for="(column) in columns"
                  :class="column.class">
                  {{ column.render && column.render(item) || '' }}
                  <slot :name="column.slotName" v-bind="item" v-if="!!column.slotName" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="w-full bg-gray-100 border-t pagination flex items-center justify-center"
      v-show="!loading && !!data.length">
      <Pagination :limit="records.result?.limit" :skip="records.result?.skip" :total="records.result?.total"
        :on-request="$props.onChangePagination" />
    </div>
  </div>
</template>

<style scoped>
.balance {
  min-height: 45px;
}

.pagination {
  padding: 4svh;
  padding-top: 3svh;
}

.table-container {
  max-height: 72.5svh;
  height: 100svh;
}

.table tbody tr:last-child {
  border-bottom: none;
}
</style>