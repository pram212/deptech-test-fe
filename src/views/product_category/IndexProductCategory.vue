<template>
  <div class="card">
    <div class="card-body">
      <h1 class="card-title mb-3">Kategori Produk</h1>
      <div v-if="productCategoryStore.loading">Loading...</div>
      <div v-else-if="productCategoryStore.error">Error: {{ productCategoryStore.error }}</div>

      <div v-else class="overflow-auto">
        <router-link to="/product-categories/create" class="btn btn-primary mb-4">Tambah</router-link>
        <table class="table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="productCategory in productCategoryStore.productCategories.data" :key="productCategory.id">
              <td>{{ productCategory.name }}</td>
              <td>{{ productCategory.description }}</td>
              <td>
                <router-link :to="`/product-categories/${productCategory.id}/edit`"
                  class="btn btn-sm btn-primary mr-2">Edit</router-link>
                <button @click="deleteProductCategory(productCategory.id)" class="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination template -->
        <div class="join mt-4" v-if="productCategoryStore.productCategories.meta?.last_page > 1">
          <button class="join-item btn" :disabled="productCategoryStore.productCategories.meta.current_page === 1"
            @click="loadPage(productCategoryStore.productCategories.meta.current_page - 1)">
            «
          </button>
          <button class="join-item btn btn-disabled">
            Page {{ productCategoryStore.productCategories.meta.current_page }} of
            {{ productCategoryStore.productCategories.meta.last_page }}
          </button>
          <button class="join-item btn"
            :disabled="productCategoryStore.productCategories.meta.current_page === productCategoryStore.productCategories.meta.last_page"
            @click="loadPage(productCategoryStore.productCategories.meta.current_page + 1)">
            »
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useProductCategoryStore } from '@/stores/productCategoryStore'

const productCategoryStore = useProductCategoryStore()
const currentPage = ref(1)
const loadPage = async (page) => {
  currentPage.value = page
  await productCategoryStore.loadProductCategories(page)
}
onMounted(() => {
  loadPage(1)
})

const deleteProductCategory = async (id) => {
  try {
    await productCategoryStore.removeProductCategory(id)
    // load product categories again to refresh the list
    await productCategoryStore.loadProductCategories()
  } catch (err) {
    console.error(err)
  }
}
</script>
