<template>
  <div class="card">
    <div class="card-body">
      <h1 class="card-title mb-4">Produk</h1>
      <div v-if="productStore.loading">Loading...</div>
      <div v-else-if="productStore.error">Error: {{ productStore.error }}</div>
      <div v-else class="overflow-x-auto">
        <router-link to="/products/create" class="btn btn-primary mb-4">Tambah Produk</router-link>
        <table class="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Deskripsi</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in productStore.products.data" :key="product.id">
              <td><img :src="product.image_url" alt="" style="width: 50px;"></td>
              <td>{{ product.name }}</td>
              <td>{{ product.category?.name }}</td>
              <td>{{ product.description }}</td>
              <td>{{ product.stock }}</td>
              <td>
                <router-link :to="`/products/${product.id}/edit`" class="btn btn-sm btn-primary mr-2">Edit</router-link>
                <button @click="deleteProduct(product.id)" class="btn btn-sm btn-error">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination template -->
        <div class="join mt-4" v-if="productStore.products.meta?.last_page > 1">
          <button class="join-item btn" :disabled="productStore.products.meta.current_page === 1"
            @click="loadPage(productStore.products.meta.current_page - 1)">
            «
          </button>

          <button class="join-item btn btn-disabled">
            Page {{ productStore.products.meta.current_page }} of {{ productStore.products.meta.last_page }}
          </button>

          <button class="join-item btn"
            :disabled="productStore.products.meta.current_page === productStore.products.meta.last_page"
            @click="loadPage(productStore.products.meta.current_page + 1)">
            »
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { ref } from 'vue'

const productStore = useProductStore()
const currentPage = ref(1)

const loadPage = async (page) => {
  currentPage.value = page
  await productStore.loadProducts(page)
}

onMounted(() => {
  loadPage(1)
})

const deleteProduct = async (id) => {
  try {
    await productStore.removeProduct(id)
    // load products again to refresh the list
    await productStore.loadProducts()
  } catch (err) {
    console.error(err)
  }
}
</script>
