<template>
  <div class="card">
    <div class="card-body">
      <h1 class="card-title mb-3">{{ isEdit ? "Edit Kategori Produk" : "Tambah Kategori Produk" }}</h1>
      <form @submit.prevent="submit" class="grid grid-cols-2 gap-4">
        <fieldset>
          <legend class="fieldset-legend">Nama Kategori</legend>
          <input v-model="form.name" placeholder="Name" class="input" />
          <div v-if="productCategoryStore.validationErrors.name" class="text-red-500 text-sm">
            {{ productCategoryStore.validationErrors.name[0] }}
          </div>
        </fieldset>
        <fieldset>
          <legend class="fieldset-legend">Deskripsi Kategori</legend>
          <input v-model="form.description" placeholder="Description" class="input" />
          <div v-if="productCategoryStore.validationErrors.description" class="text-red-500 text-sm">
            {{ productCategoryStore.validationErrors.description[0] }}
          </div>
        </fieldset>
        <div class="space-x-2">
          <button type="submit" class="btn btn-primary">{{ isEdit ? 'Update' : 'Add' }}</button>
          <router-link to="/product-categories" class="btn btn-secondary">Cancel</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductCategoryStore } from '@/stores/productCategoryStore'
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()

const emit = defineEmits(['saved', 'cancel'])

const productCategoryStore = useProductCategoryStore()
const isEdit = ref(false)

const form = ref({
  name: '',
  description: '',
})

onMounted(async () => {
  const id = route.params.id

  if (id) {
    isEdit.value = true
    const productCategory = await productCategoryStore.fetchProductCategory(id)

    form.value = {
      id: productCategory.data.id,
      name: productCategory.data.name || '',
      description: productCategory.data.description || '',
    }
  }
})

const submit = async () => {
  try {
    if (isEdit.value) {
      await productCategoryStore.editProductCategory(form.value.id, form.value)
    } else {
      await productCategoryStore.addProductCategory(form.value)
    }
    router.push('/product-categories')
  } catch (err) {
    // error sudah ditangani di store
    console.error('Error saving product category:', err)
  }
}
</script>
