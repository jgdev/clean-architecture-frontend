<script lang="ts" setup>
import { BarsArrowUpIcon } from '@heroicons/vue/24/outline'
import { BarsArrowDownIcon } from '@heroicons/vue/24/outline'
import { Spinner } from 'flowbite-vue'
import { FetchAction, FetchResources, Record, User } from '../types'
import Pagination from './Pagination.vue'
import { computed, ref } from 'vue'

type Column<T> = {
  label?: string
  render?: (row: T) => any
  flex?: number;
  slotName?: string;
  class?: string
  orderBy?: string
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
const sortBy = ref<string | undefined>('')
const orderBy = ref<string | undefined>('')

const setOrderBy = (column: Column<any>) => {
  if (orderBy.value === column.orderBy) {
    sortBy.value = sortBy.value === 'desc' ? 'asc' : '';
    if (!sortBy.value) orderBy.value = ''
  } else {
    sortBy.value = 'desc';
    orderBy.value = column.orderBy
  }
  props.onChangePagination({
    orderBy: orderBy.value,
    sortBy: sortBy.value
  })
}

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
                <th v-for="(column) in columns" scope="col" class="px-6 py-3 w-auto no-wrap"
                  @click="() => column.orderBy && setOrderBy(column)">
                  <div class="flex items-center gap-2">
                    <span>{{ column.label || '' }}</span>
                    <div v-if="column.orderBy && orderBy === column.orderBy"
                      :id="`order-${column.orderBy}-sort-${sortBy}`">
                      <BarsArrowDownIcon class="w-3 h-3" v-if="sortBy === 'desc'" />
                      <BarsArrowUpIcon class="w-3 h-3" v-if="sortBy === 'asc'" />
                    </div>
                  </div>
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