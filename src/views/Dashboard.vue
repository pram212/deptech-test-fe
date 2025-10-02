<template>
  <div class="card">
    <div class="card-body">
      <h1 class="card-title">Dashboard</h1>
      <p class="card-text">Welcome, {{ auth.user?.name }}</p>
      <p class="card-text">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quaerat eveniet sequi rem dicta aut
        aliquid aspernatur tempora similique, error animi laudantium a, perspiciatis doloribus placeat est quo ullam
        itaque dolor?</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
</script>
