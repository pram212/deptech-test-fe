<template>
  <div class="card">
    <div class="card-body">
      <h1 class="card-title">{{ isEdit ? "Edit Product" : "Create Product" }}</h1>
      <div class="my-3 min-h-screen">
        <form @submit.prevent="submit" enctype="multipart/form-data" class="grid grid-cols-2 gap-4">
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Nama Produk</legend>
            <input type="text" class="input w-full" v-model="form.name" placeholder="Type here" />
            <div v-if="productStore.validationErrors.name" class="text-error text-sm">
              {{ productStore.validationErrors.name[0] }}
            </div>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend">Kategori Produk</legend>
            <select class="select w-full" v-model="form.product_category_id">
              <option value="" disabled>Select Category</option>
              <option v-for="category in productCategories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <div v-if="productStore.validationErrors.product_category_id" class="text-error text-sm">
              {{ productStore.validationErrors.product_category_id[0] }}
            </div>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend">Deskripsi Produk</legend>
            <textarea class="textarea" v-model="form.description" placeholder="Type here"></textarea>
            <div v-if="productStore.validationErrors.description" class="text-error text-sm">
              {{ productStore.validationErrors.description[0] }}
            </div>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend">Stock Produk</legend>
            <input type="number" class="input" v-model="form.stock" placeholder="Stock" />
            <div v-if="productStore.validationErrors.stock" class="text-error text-sm">
              {{ productStore.validationErrors.stock[0] }}
            </div>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend">Image Produk</legend>
            <input type="file" @change="handleFileChange" />
            <div v-if="productStore.validationErrors.image" class="text-error text-sm">
              {{ productStore.validationErrors.image[0] }}
            </div>
          </fieldset>

          <br />
          <div class="col-spa-2 space-x-2">
            <button type="submit" class="btn btn-primary">{{ isEdit ? 'Update' : 'Simpan' }}</button>
            <router-link to="/products" class="btn btn-secondary">Batal</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const isEdit = ref(false)

const productCategories = ref([])

const form = ref({
  name: '',
  description: '',
  stock: 0,
  product_category_id: null,
  image: null,
})

const handleFileChange = (event) => {
  const file = event.target.files[0]
  form.value.image = file
}

onMounted(async () => {
  await productStore.loadProductCategoryOptions()
  productCategories.value = productStore.productCategories || []

  const id = route.params.id
  if (id) {
    isEdit.value = true
    const product = await productStore.fetchProduct(id)
    form.value = {
      id: product.data.id,
      name: product.data.name || '',
      description: product.data.description || '',
      stock: product.data.stock || 0,
      product_category_id: product.data.category.id || null,
      image: null,
    }
  }
})

const submit = async () => {
  try {
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('description', form.value.description)
    formData.append('stock', form.value.stock)
    if (form.value.product_category_id)
      formData.append('product_category_id', form.value.product_category_id)
    if (form.value.image) formData.append('image', form.value.image)

    if (isEdit.value) {
      formData.append('_method', 'PUT') // Laravel requires _method=PUT for updates
      await productStore.editProduct(form.value.id, formData)
    } else {
      await productStore.addProduct(formData)
    }

    router.push('/products')

  } catch (err) {
    console.error('Error saving product:', err)
  }
}
</script>
