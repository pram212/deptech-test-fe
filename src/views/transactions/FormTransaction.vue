<template>
  <div class="card">
    <div class="card-body">
      <h1 class="card-title mb-3">{{ isEdit ? "Edit Transaction" : "Create Transaction" }}</h1>
      <p class="card-text">Manage your transactions</p>
      <form @submit.prevent="submit" class="min-h-screen">
        <div class="grid grid-cols-2 gap-2">
          <fieldset>
            <legend class="fieldset-legend">Type</legend>
            <select v-model="form.type" class="select w-full">
              <option value="" disabled>Select type</option>
              <option value="in">In</option>
              <option value="out">Out</option>
            </select>
            <div v-if="transactionStore.validationErrors.type" class="text-red-500 text-sm">
              {{ transactionStore.validationErrors.type[0] }}
            </div>
          </fieldset>

          <fieldset>
            <legend class="fieldset-legend">Date</legend>
            <input type="date" v-model="form.date" class="input w-full" />
            <div v-if="transactionStore.validationErrors.date" class="text-red-500 text-sm">
              {{ transactionStore.validationErrors.date[0] }}
            </div>
          </fieldset>
        </div>
        <div class="divider">Items</div>
        <table class="table w-full mb-4">
          <thead>
            <tr>
              <th>Product</th>
              <th>Stock</th>
              <th>Quantity</th>
              <th><button type="button" @click="addItem" class="btn btn-sm btn-success">Add Item</button></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in form.items" :key="index">
              <td>
                <select v-model="item.product_id" @change="updateStock(index)" class="select w-full">
                  <option value="" disabled>Select Product</option>
                  <option v-for="p in products" :key="p.id" :value="p.id">
                    {{ p.name }}
                  </option>
                </select>
              </td>
              <td>{{ item.stock ?? '-' }}</td>
              <td>
                <input type="number" class="input w-full" v-model="item.quantity" min="1" />
                <!-- tampilkan error quantity per item -->
                <div v-if="transactionStore.validationErrors[`items.${index}.quantity`]" class="text-red-500 text-sm">
                  {{ transactionStore.validationErrors[`items.${index}.quantity`][0] }}
                </div>
              </td>
              <td>
                <button type="button" class="btn btn-sm btn-error" @click="removeItem(index)">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="divider"></div>
        <button type="submit" class="btn btn-primary">Submit Transaction</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTransactionStore } from '@/stores/transactionStore'
import router from '@/router'

const transactionStore = useTransactionStore()

const form = ref({
  type: '',
  date: '',
  items: [{ product_id: null, quantity: 1, stock: null }],
})

const products = ref([])

onMounted(async () => {
  // fetch products dari API
  await transactionStore.loadProductOptions()
  products.value = transactionStore.products
})

// Tambah / hapus item
const addItem = () => {
  form.value.items.push({ product_id: null, quantity: 1, stock: null })
}

const removeItem = (index) => {
  form.value.items.splice(index, 1)
}

// update stok saat pilih produk
const updateStock = (index) => {
  const product_id = form.value.items[index].product_id
  const product = products.value.find(p => p.id === product_id)
  form.value.items[index].stock = product?.stock ?? null
}

// submit transaksi
const submit = async () => {
  try {
    // siapkan request body sesuai API
    const payload = {
      type: form.value.type,
      date: form.value.date,
      items: form.value.items.map(i => ({ product_id: i.product_id, quantity: i.quantity }))
    }
    await transactionStore.addTransaction(payload)
    router.push('/transactions')
  } catch (err) {
    console.error('Error submitting transaction:', err)
  }
}
</script>
