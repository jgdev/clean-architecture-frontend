<script lang="ts" setup>
import { ref } from 'vue';
import { TrashIcon } from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'
import { Record, Operation, FetchResources } from '../types'
import Table from './Table.vue';
import Header from './Header.vue';
import PerformOperation from './PerformOperation.vue';
import { formatAmount, limitCharacters } from '../utils/format';

type Props = {
  records: FetchResources<Record>
  operations: FetchResources<Operation>
  onDeleteRecord: (recordId: string) => Promise<void>
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
      return "Random String"
    case "square_root":
      return "Square Root"
    default:
      return "Not supported"
  }
}

const displayOperation = (record: Record) => {
  switch (record.operationType) {
    case "addition":
      return record.operationArgs.reduce((result, _, index) => {
        const nextItem = record.operationArgs[index + 1]
        return nextItem ? `${result} + ${nextItem}` : `${result} = ${record.operationResult}`
      }, record.operationArgs[0])
    case "subtraction":
      return record.operationArgs.reduce((result, _, index) => {
        const nextItem = record.operationArgs[index + 1]
        return nextItem ? `${result} - ${nextItem}` : `${result} = ${record.operationResult}`
      }, record.operationArgs[0])
    case "random_string":
    case "random_string_v2":
    case "square_root":
      return record.operationResult;
    default:
      return "Not supported"
  }
}

const tableColumns = [
  { label: 'Operation Type', render: (row: Record) => getOperationLabel(row.operationType) },
  { label: 'Cost', render: (row: Record) => formatAmount(row.cost) },
  { label: 'Result', slotName: 'result' },
  { label: 'Date', render: (row: Record) => dayjs(row.date).format('MM/DD/YYYY HH:mm:ss') },
  {
    slotName: 'removeItem',
  }
]

const performOperation = ref(false)

const handleDeleteRecord = (record: Record) => {
  props.onDeleteRecord(record.id)
}

const copiedResultId = ref('');

const copyResult = (record: Record) => {
  copiedResultId.value = record.id;
  navigator.clipboard.writeText(displayOperation(record));
}
</script>

<template>
  <PerformOperation v-if="performOperation" @close="() => performOperation = false" :on-submit="onPerformOperation" />
  <div class="list-records flex flex-col">
    <Header @performOperation="() => performOperation = true" />
    <Table :columns="tableColumns" :data="props.records.result?.result || []" :loading="props.records.loading"
      empty-message="No records to display" class="grow">
      <template #removeItem="record">
        <TrashIcon class="w-4 h-4 hover:text-indigo-500 cursor-pointer" @click="() => handleDeleteRecord(record)"/>
      </template>
      <template #result="record">
        <div class="flex justify-between w-44" @mouseleave="() => copiedResultId = ''">
          <span>{{ limitCharacters(displayOperation(record), 12) }}</span>
          <span class="hidden group-hover:block text-indigo-500 cursor-pointer font-bold font-xs" :class="copiedResultId === record.id && '!text-green-500' || ''" @click="() => copyResult(record)">{{ copiedResultId === record.id ? 'COPIED' : 'COPY' }}</span>
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