<template>

  <div>
    <div class="card">
      <div class="card-body">
        <h1 class="card-title">List Admin</h1>
        <div class="divider"></div>
        <div v-if="userStore.loading">Loading...</div>
        <div v-else-if="userStore.error">Error: {{ userStore.error }}</div>
        <div v-else class="overflow-x-auto">
          <router-link to="/users/create" class="btn btn-primary">Tambah Admin</router-link>
          <table class="table">
            <thead>
              <tr>
                <th>Nama Depan</th>
                <th>Nama Belakang</th>
                <th>Email</th>
                <th>Tanggal Lahir</th>
                <th>Jenis Kelamin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in userStore.users.data" :key="user.id">
                <td>{{ user.first_name }}</td>
                <td>{{ user.last_name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.date_of_birth }}</td>
                <td>{{ user.gender }}</td>
                <td>
                  <router-link :to="`/users/${user.id}/edit`" class="btn btn-sm btn-primary mr-2">Edit</router-link>
                  <button @click="deleteUser(user.id)" class="btn btn-sm btn-error">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination template -->
          <div class="join mt-4" v-if="userStore.users.meta?.last_page > 1">
            <button class="join-item btn" :disabled="userStore.users.meta.current_page === 1"
              @click="loadPage(userStore.users.meta.current_page - 1)">
              «
            </button>
            <button class="join-item btn btn-disabled">
              Page {{ userStore.users.meta.current_page }} of {{ userStore.users.meta.last_page }}
            </button>
            <button class="join-item btn"
              :disabled="userStore.users.meta.current_page === userStore.users.meta.last_page"
              @click="loadPage(userStore.users.meta.current_page + 1)">
              »
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'


const userStore = useUserStore()
const currentPage = ref(1)

const loadPage = async (page) => {
  currentPage.value = page
  await userStore.loadUsers(page)
}

onMounted(() => {
  loadPage(1)
})

const deleteUser = async (id) => {
  try {
    await userStore.removeUser(id)
    // load users again to refresh the list
    await userStore.loadUsers()
  } catch (err) {
    console.error(err)
  }
}
</script>
