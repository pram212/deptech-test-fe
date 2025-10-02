import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { guest: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/users/IndexUser.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/users/create',
    name: 'createUser',
    component: () => import('@/views/users/FormUser.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/users/:id/edit',
    name: 'editUser',
    component: () => import('@/views/users/FormUser.vue'),
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: '/product-categories',
    name: 'productCategories',
    component: () => import('@/views/product_category/IndexProductCategory.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/product-categories/create',
    name: 'createProductCategory',
    component: () => import('@/views/product_category/FormProductCategory.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/product-categories/:id/edit',
    name: 'editProductCategory',
    component: () => import('@/views/product_category/FormProductCategory.vue'),
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('@/views/products/IndexProduct.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/products/create',
    name: 'createProduct',
    component: () => import('@/views/products/FormProduct.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/products/:id/edit',
    name: 'editProduct',
    component: () => import('@/views/products/FormProduct.vue'),
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('@/views/transactions/IndexTransaction.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/transactions/create',
    name: 'createTransaction',
    component: () => import('@/views/transactions/FormTransaction.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue'),
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Route guard
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  if (auth.token && !auth.user) {
    try {
      await auth.getUser()
    } catch (err) {
      auth.logout()
    }
  }

  if (to.meta.requiresAuth && !auth.token) {
    next({ name: 'login' })
  } else if (to.meta.guest && auth.token) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
