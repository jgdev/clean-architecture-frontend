<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Input, Button } from 'flowbite-vue'
import { FetchAction } from '../types'

type Props = {
  authSession: FetchAction<string>
}

const { authSession } = defineProps<Props>()

const email = ref('')
const password = ref('')

const handleSubmit = (e: Event) => {
  e.preventDefault();

  authSession.error = ''
  authSession.postAction({
    data: {
      email: email.value, password: password.value
    }
  })
}

watch(email, () => {
  authSession.error = ''
})
watch(password, () => {
  authSession.error = ''
})
</script>
<template>
  <div className="sign-in flex flex-col justify-center items-center sm:p-4 sm:max-w-sm m-auto">
    <h1 class="text-xl mb-8">Arithmetic App</h1>
    <div class="rounded-lg p-8 bg-white w-full text-center">
      <h1 class="text-xl mb-8 text-gray-600">Sign in</h1>
      <form @submit="handleSubmit">
        <Input v-model="email" type="email" placeholder="Email" autocomplete="email" required class="mb-4"
          :disabled="authSession.loading" />
        <Input v-model="password" type="password" placeholder="Password" autocomplete="current-password" required
          class="mb-2" :disabled="authSession.loading" />
        <h3 class="my-4 p-0 text-sm text-red-600">{{ authSession.error?.detail || authSession.error?.msg ||
          authSession.error }}</h3>
        <Button color="light" type="submit" :disabled="authSession.loading">{{ authSession.loading ? 'Please wait ...' :
          'Submit'
        }}</Button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.sign-in {
  min-height: 100vh;
}
</style>