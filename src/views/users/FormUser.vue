<template>
  <div class="card">
    <div class="card-body">
      <h1 class="card-title mb-3">{{ isEdit ? "Edit Admin" : "Tambah Admin" }}</h1>

      <form @submit.prevent="submit" class="grid grid-cols-2 gap-4">
        <fieldset>
          <legend class="fieldset-legend">Nama Depan</legend>
          <input class="input" v-model="form.first_name" placeholder="First Name" />
          <div v-if="userStore.validationErrors.first_name" class="text-red-500 text-sm">
            {{ userStore.validationErrors.first_name[0] }}
          </div>
        </fieldset>

        <fieldset>
          <legend class="fieldset-legend">Nama Belakang</legend>
          <input class="input" v-model="form.last_name" placeholder="Last Name" />
          <div v-if="userStore.validationErrors.last_name" class="text-red-500 text-sm">
            {{ userStore.validationErrors.last_name[0] }}
          </div>
        </fieldset>

        <fieldset>
          <legend class="fieldset-legend">Email</legend>
          <input class="input" v-model="form.email" placeholder="Email" type="email" />
          <div v-if="userStore.validationErrors.email" class="text-red-500 text-sm">
            {{ userStore.validationErrors.email[0] }}
          </div>
        </fieldset>

        <fieldset>
          <legend class="fieldset-legend">Tanggal Lahir</legend>
          <input class="input" v-model="form.date_of_birth" placeholder="Date of Birth" type="date" />
          <div v-if="userStore.validationErrors.date_of_birth" class="text-red-500 text-sm">
            {{ userStore.validationErrors.date_of_birth[0] }}
          </div>
        </fieldset>

        <fieldset>
          <legend class="fieldset-legend">Jenis Kelamin</legend>
          <select name="gender" id="gender" class="select" v-model="form.gender">
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <div v-if="userStore.validationErrors.gender" class="text-red-500 text-sm">
            {{ userStore.validationErrors.gender[0] }}
          </div>
        </fieldset>

        <fieldset v-if="!isEdit">
          <legend class="fieldset-legend">Password</legend>
          <input class="input" v-model="form.password" placeholder="Password" type="password" />
          <div v-if="userStore.validationErrors.password" class="text-red-500 text-sm">
            {{ userStore.validationErrors.password[0] }}
          </div>
        </fieldset>

        <fieldset v-if="!isEdit">
          <legend class="fieldset-legend">Confirm Password</legend>
          <input class="input" v-model="form.password_confirmation" placeholder="Confirm Password" type="password" />
          <div v-if="userStore.validationErrors.password_confirmation" class="text-red-500 text-sm">
            {{ userStore.validationErrors.password_confirmation[0] }}
          </div>
        </fieldset>

        <div class="space-x-2 col-span-2">
          <button type="submit" class="btn btn-primary" :disabled="saving">{{ isEdit ? 'Update' : 'Simpan' }}</button>
          <router-link to="/users" class="btn btn-secondary">Batal</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()

const emit = defineEmits(['saved', 'cancel'])

const userStore = useUserStore()
const isEdit = ref(false)
const saving = ref(false)


const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  gender: '',
  date_of_birth: '',
  password: '',
  password_confirmation: '',
})

onMounted(async () => {
  const id = route.params.id

  if (id) {
    isEdit.value = true
    const user = await userStore.fetchUser(id)

    form.value = {
      id: user.data.id,
      first_name: user.data.first_name || '',
      last_name: user.data.last_name || '',
      email: user.data.email || '',
      gender: user.data.gender || '',
      date_of_birth: user.data.date_of_birth || '',
      password: '',
      password_confirmation: '',
    }
  }
})

const submit = async () => {
  try {
    saving.value = true
    if (isEdit.value) {
      await userStore.editUser(form.value.id, form.value)
    } else {
      await userStore.addUser(form.value)
    }
    router.push('/users')
    saving.value = false
  } catch (err) {
    saving.value = false
    // error sudah ditangani di store
    console.error('Error saving user:', err)
  }
}
</script>
