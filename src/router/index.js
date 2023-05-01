import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },

    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: {
        requiresAuth: false,
      },
    },

    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue'),
      meta: {
        requiresAuth: false,
      },
    },

    {
      path: '/menu',
      name: 'Menu',
      component: () => import('../views/Menu.vue'),
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/create-offer',
      name: 'CreateOffer',
      component: () => import('../views/CreateOffer.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/offers',
      name: 'Offers',
      component: () => import('../views/Offers.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/offers/:id",
      name: "OfferDetails",
      component: () => import('../views/OfferDetails.vue'),
      meta: {
        requiresAuth: true,
      },
    }
  ]
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      alert("You should log in to access this page!");
      next("/");
    }
  } else {
    next();
  }
});

export default router
