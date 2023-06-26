<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Input, Button } from 'flowbite-vue'
import { authSession } from '../api'

const email = ref('test@test')
const password = ref('test123')

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
      <form @submit="(e) => handleSubmit(e)">
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