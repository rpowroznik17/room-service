<template>
  <div class="container-md text-center">  
        <h1 class="pt-2">Menu</h1>
        <img src="/icons/512.png" class="img-fluid mx-auto">
        <router-link to="/offers" type="button" class="btn w-75 btn-dark mb-3">Rent an appartment</router-link><br>
        <router-link to="/bookinghistory" type="button" class="btn w-75 btn-dark">Check your booking history</router-link> 
        <img src="/icons/megaphone.jpg" class="img-fluid mx-auto">
        <router-link to="/create-offer" type="button" class="btn w-75 btn-dark mb-3">Place an offer</router-link> 
        <router-link to="/usersoffers" type="button" class="btn w-75 btn-dark mb-3">Check your offers</router-link> 
        <button @click="handleSignOut" v-if="isLoggedIn" type="button" class="btn w-75 btn-secondary mb-5">Logout</button>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const isLoggedIn = ref(false);
const router = useRouter();

let auth;

onMounted(() => {
auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
    isLoggedIn.value = true;
    } else {
    isLoggedIn.value = false;
    }
});
});

const handleSignOut = () => {
signOut(auth).then(() => {
    router.push("/");
})
}
</script>

