<template>
  <div class="flex justify-center">
    <div class="card">
      <div class="card-body">
        <h1 class="card-title">Login</h1>
        <div class="divider"></div>
        <form @submit.prevent="submit">
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Email</legend>
            <input v-model="email" type="email" class="input" placeholder="Type here" />
          </fieldset>
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Password</legend>
            <input v-model="password" type="password" class="input" placeholder="Type here" />
          </fieldset>
          <div class="divider"></div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

const submit = async () => {
  try {
    await auth.login({ email: email.value, password: password.value })
    router.push({ name: 'dashboard' })
  } catch (e) {
    alert('Login gagal')
  }
}
</script>
