import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import router from './router'
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCcA5PWCp8aoppX7N6biBIyWonlwWdFd4s",
  authDomain: "projekt-d2407.firebaseapp.com",
  projectId: "projekt-d2407",
  storageBucket: "projekt-d2407.appspot.com",
  messagingSenderId: "127230562160",
  appId: "1:127230562160:web:9170c6a678ba64ac95c9b5",
  measurementId: "G-8VVE15WHGL"
};

const firestoreApp = initializeApp(firebaseConfig);

const db = getFirestore(firestoreApp);

const app = createApp(App)

app.use(router)

app.mount('#app')

export { db }
window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./sw.js');
  }
}