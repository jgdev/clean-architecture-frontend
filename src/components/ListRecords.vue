<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { TrashIcon } from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'
import { Record, Operation, FetchResources, FetchAction, User } from '../types'
import Table from './Table.vue';
import Header from './Header.vue';
import PerformOperation from './PerformOperation.vue';
import { formatAmount, limitCharacters } from '../utils/format';
import { DEFAULT_RESULTS_LIMIT } from '../constants';

type Props = {
  records: FetchResources<Record>
  operations: FetchResources<Operation>
  user: FetchAction<User>
  authSession: FetchAction<string>
  authLogout: FetchAction<void>
  deleteRecord: FetchAction<void>
  onDeleteRecord: (recordId: string, params: any) => Promise<void>
  onPerformOperation: (operationId: string, args: any[]) => Promise<void>
}

const props = defineProps<Props>()

const getOperationLabel = (operationType: string) => {
  switch (operationType) {
    case "addition":
      return "Addition"
    case "subtraction":
      return "Subtract"
    case "random_string":
    case "random_string_v2":
      return "Random String"
    case "square_root":
      return "Square Root"
    case "division":
      return "Division"
    case "multiplication":
      return "Multiplication"
    default:
      return "Not supported"
  }
}

const multipleNumberOperationDisplay = (symbol: string, record: Record) => {
  return record.operationArgs.reduce((result, _, index) => {
    const nextItem = record.operationArgs[index + 1]
    return nextItem ? `${result} ${symbol} ${nextItem}` : `${result} = ${record.operationResult}`
  }, record.operationArgs[0])
}

const displayOperation = (record: Record) => {
  switch (record.operationType) {
    case "addition":
      return multipleNumberOperationDisplay('+', record)
    case "subtraction":
      return multipleNumberOperationDisplay('-', record)
    case "multiplication":
      return multipleNumberOperationDisplay('*', record)
    case "division":
      return multipleNumberOperationDisplay('/', record)
    case "random_string":
    case "random_string_v2":
      return record.operationResult;
    case "square_root":
      return `√ ${record.operationArgs[0]} = ${record.operationResult}`
    default:
      return "Not supported"
  }
}

const tableColumns = [
  { label: 'Type', render: (row: Record) => getOperationLabel(row.operationType), class: "min-w-20", orderBy: 'operationType' },
  { label: 'Operation', slotName: 'result' },
  { label: 'Cost', render: (row: Record) => formatAmount(row.cost) },
  { label: 'Date', render: (row: Record) => dayjs(row.date).format('MM/DD/YYYY HH:mm:ss'), class: "!w-40", orderBy: 'date' },
  {
    slotName: 'removeItem',
  }
]

const performOperation = ref(false)

const handleDeleteRecord = (record: Record) => {
  props.onDeleteRecord(record.id, {
    limit: props.records.result?.limit || DEFAULT_RESULTS_LIMIT,
    skip: props.records.result?.skip || 0,
  })
}

const copiedResultId = ref('');

const copyResult = (record: Record) => {
  copiedResultId.value = record.id;
  navigator.clipboard.writeText(displayOperation(record));
}

const state = reactive({
  pagination: {
    limit: DEFAULT_RESULTS_LIMIT,
    skip: 0
  }
})

const onChangePagination = (params: any) => {
  state.pagination = {
    ...state.pagination,
    ...params
  }
  props.records.getAction({
    querystring: state.pagination
  })
}
</script>

<template>
  <PerformOperation v-if="performOperation" :on-close="() => performOperation = false" :on-submit="onPerformOperation"
    :operations="operations" />
  <div class="list-records flex flex-col">
    <Header :on-perform-operation="() => performOperation = true" :auth-logout="authLogout" :auth-session="authSession"
      :user="user" :records="records" />
    <Table :records="records" :user="user" :delete-record="deleteRecord" :columns="tableColumns"
      :data="records.result?.result || []" :loading="records.loading" :on-change-pagination="onChangePagination"
      empty-message="No records to display" class="grow">
      <template #removeItem="record">
        <TrashIcon class="w-4 h-4 hover:text-indigo-500 cursor-pointer" @click="() => handleDeleteRecord(record)" />
      </template>
      <template #result="record">
        <div class="flex justify-between w-44" @mouseleave="() => copiedResultId = ''">
          <span class="relative" :title="record.operationResult">{{ limitCharacters(displayOperation(record), 12)
          }}</span>
          <span class="hidden group-hover:block text-indigo-500 cursor-pointer font-bold font-xs"
            :class="copiedResultId === record.id && '!text-green-500' || ''" @click="() => copyResult(record)">{{
              copiedResultId === record.id ? 'COPIED' : 'COPY' }}</span>
        </div>
      </template>
    </Table>
  </div>
</template>

<style>
.list-records {
  min-height: 100svh;
  max-height: 100svh;
}

#perform>span {
  width: 100%;
  justify-content: center;
}
</style>