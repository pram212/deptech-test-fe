<template>
  <div class="flex justify-center">
    <div class="card w-1/3 bg-base-200">
      <div class="card-body">
        <h1 class="card-title">Login</h1>
        <div class="divider"></div>
        <form @submit.prevent="submit">
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Email</legend>
            <input v-model="email" type="email" class="input w-full" placeholder="Type here" />
          </fieldset>
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Password</legend>
            <input v-model="password" type="password" class="input w-full" placeholder="Type here" />
          </fieldset>
          <div class="divider"></div>
          <button type="submit" class="btn btn-primary" :disabled="loading">{{ loading ? "Login..." : "Login"
          }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from 'vue-toastification'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const toast = useToast()
const submit = async () => {
  loading.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    loading.value = false
    router.push({ name: 'dashboard' })
  } catch (err) {
    loading.value = false
    console.log(err.response.data.message)
    toast.error("Login gagal " + err.response.data.message)

  }
}
</script>
