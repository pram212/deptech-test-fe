<template>
  <div class="drawer">
    <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <!-- Navbar -->
      <div class="navbar bg-base-100 w-full">
        <div class="flex-none lg:hidden">
          <label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              class="inline-block h-6 w-6 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </label>
        </div>
        <div class="mx-2 flex-1 px-2">Deptech Technical Test</div>
        <div class="hidden flex-none lg:block">
          <ul class="menu menu-horizontal space-x-2" v-if="auth.user">
            <!-- Navbar menu content here -->
            <li><router-link to="/dashboard" :class="{ 'bg-primary': $route.path == '/dashboard' }">Home</router-link>
            </li>
            <li>
              <router-link to="/products"
                :class="{ 'bg-primary': $route.path.includes('/products') }">Produk</router-link>
            </li>
            <li>
              <router-link to="/users" :class="{ 'bg-primary': $route.path.includes('/users') }">Admin</router-link>
            </li>
            <li>
              <router-link to="/product-categories"
                :class="{ 'bg-primary': $route.path.includes('/product-categories') }">Kategori Produk</router-link>
            </li>
            <li><router-link to="/transactions"
                :class="{ 'bg-primary': $route.path.includes('/transactions') }">Transaksi</router-link></li>
            <li>
              <button type="button" class="btn btn-error btn-sm ml-3" @click="logout">Logout</button>
            </li>
          </ul>
        </div>
      </div>
      <!-- Page content here -->
      <div class="py-6 px-4 bg-base-300 min-h-screen">
        <div class="container bg-base-100 rounded-md">
          <RouterView />
        </div>
      </div>
    </div>
    <div class="drawer-side">
      <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul class="menu bg-base-200 min-h-full w-80 p-4" v-if="auth.user">
        <!-- Sidebar content here -->
        <li><router-link to="/dashboard">Home</router-link></li>
        <li><router-link to="/products">Produk</router-link></li>
        <li><router-link to="/users">Admin</router-link></li>
        <li><router-link to="/product-categories">Kategori Produk</router-link></li>
        <li><router-link to="/transactions">Transaksi</router-link></li>
        <hr class="my-2 border-gray-300" />
        <li><button class="btn btn-error" @click="logout">Logout</button></li>
        <li><a>Sidebar Item 2</a></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const logout = async () => {
  try {
    await auth.logout()
    router.push('/login') // redirect setelah logout
  } catch (e) {
    alert('Logout gagal')
  }
}
</script>
