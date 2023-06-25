<script setup lang="ts">
import SignIn from './components/SignIn.vue';
import ListRecords from './components/ListRecords.vue';
import { onMounted, watch } from 'vue';
import { operations, records, authSession, user } from './api';
import { Record } from './types'

const onDeleteRecord = async (recordId: string) => {
  console.log('Deleting record', recordId)
}

const onPerformOperation = async (operationType: string, args: any[]) => {
  const operationId = (operations.result?.result || []).find(operation => operation.type === operationType)?.id
  if (!operationId) throw { detail: 'Operation not supported' }
  return records.postAction({
    data: {
      operationId,
      operationArgs: args
    }
  }).then((record: Record) => {
    user.result = { ...user.result!, balance: record.newUserBalance }
    return records.getAction()
  })
}

const checkResourceAuthError = (error: any) => {
  if (error && error && error.statusCode === 401 || error.message && error.message.includes('NetworkError')) {
    console.log('Login out')
    authSession.result = ''
    window.localStorage.clear()
  }
}

const checkSession = () => {
  if (authSession.result) {
    user.getAction().then(() => {
      records.getAction()
      operations.getAction()
    })
  }
}

onMounted(() => {
  checkSession();

  watch(() => authSession.result, () => {
    checkSession();
    localStorage.setItem('auth-session-id', authSession.result || '')
  })
  watch(() => user.error, () => checkResourceAuthError(user.error))
  watch(() => records.error, () => checkResourceAuthError(records.error))
  watch(() => operations.error, () => checkResourceAuthError(operations.error))
})
</script>

<template>
  <SignIn v-if="!authSession.result" />
  <ListRecords v-if="!!authSession.result" :records="records" :operations="operations" :on-delete-record="onDeleteRecord"
    :on-perform-operation="onPerformOperation" />
</template>