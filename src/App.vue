<script setup lang="ts">
import SignIn from './components/SignIn.vue';
import ListRecords from './components/ListRecords.vue';
import { onMounted, watch } from 'vue';
import { Record } from './types'
import { operations, records, authSession, user, deleteRecord, authLogout } from './api';
import { DEFAULT_RESULTS_LIMIT } from './constants'

const getRecords = (params: any = {}) => records.getAction({
  querystring: {
    limit: DEFAULT_RESULTS_LIMIT,
    skip: 0,
    ...params,
  }
})

const onDeleteRecord = async (recordId: string, params: any) => {
  await deleteRecord.delAction({
    params: {
      recordId
    }
  })
  await getRecords(params)
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
    return getRecords()
  })
}

const checkResourceAuthError = (error: any, from?: string) => {
  if (error && error && error.statusCode === 401 || error?.constructor?.name === 'TypeError' && from === 'profile') {
    authSession.result = ''
    window.localStorage.clear()
  }
}

const checkSession = () => {
  if (authSession.result) {
    user.getAction().then(() => {
      getRecords()
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
  watch(() => user.error, () => checkResourceAuthError(user.error, 'profile'))
  watch(() => records.error, () => checkResourceAuthError(records.error))
  watch(() => operations.error, () => checkResourceAuthError(operations.error))
})
</script>

<template>
  <SignIn v-if="!authSession.result" :auth-session="authSession" />
  <ListRecords v-if="!!authSession.result" :auth-session="authSession" :auth-logout="authLogout" :user="user"
    :delete-record="deleteRecord" :records="records" :operations="operations" :on-delete-record="onDeleteRecord"
    :on-perform-operation="onPerformOperation" />
</template>