<template>
  <div class="card">
    <div class="card-body">
      <h1 class="card-title mb-3">Riwayat Transaksi</h1>

      <div class="overflow-x-auto">
        <router-link to="/transactions/create" class="btn btn-primary">Transaksi Baru</router-link>
        <table class="table">
          <thead>
            <tr>
              <th>Tipe</th>
              <th>Tanggal</th>
              <th>Jumlah Item</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in transactionStore.transactions.data" :key="transaction.id">
              <td>{{ transaction.type }}</td>
              <td>{{ transaction.date }}</td>
              <td>{{ transaction.items.length }}</td>
              <td>
                <button class="btn btn-info btn-sm" @click="getDetail(transaction)">Detail</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination template -->
        <div class="join mt-4" v-if="transactionStore.transactions.last_page > 1">
          <button class="join-item btn" :disabled="transactionStore.transactions.current_page === 1"
            @click="loadPage(transactionStore.transactions.current_page - 1)">
            «
          </button>
          <button class="join-item btn btn-disabled">
            Page {{ transactionStore.transactions.current_page }} of
            {{ transactionStore.transactions.last_page }}
          </button>
          <button class="join-item btn"
            :disabled="transactionStore.transactions.current_page === transactionStore.transactions.last_page"
            @click="loadPage(transactionStore.transactions.current_page + 1)">
            »
          </button>
        </div>

      </div>
    </div>

    <input type="checkbox" id="my_modal_6" class="modal-toggle" v-model="isModalOpen" />
    <div class="modal">
      <div class="modal-box">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="isModalOpen = false">✕</button>
        <h3 class="text-lg font-bold">Detail Transaksi</h3>
        <div class="py-4" v-if="transactionDetail">
          <p><strong>Type:</strong> {{ transactionDetail.type }}</p>
          <p><strong>Date:</strong> {{ transactionDetail.date }}</p>
          <div class="divider">Item</div>
          <table class="table w-full table-sm">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in transactionDetail.items" :key="index">
                <td>{{ item.product.name }}</td>
                <td>{{ item.quantity }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useTransactionStore } from '@/stores/transactionStore'

const transactionStore = useTransactionStore()
const currentPage = ref(1)

const loadPage = async (page) => {
  currentPage.value = page
  await transactionStore.loadTransactions(page)
}

onMounted(() => {
  loadPage(1)
})

const transactionDetail = ref(null)
const isModalOpen = ref(false)
const getDetail = (transaction) => {
  isModalOpen.value = true
  transactionDetail.value = transaction
}

</script>
