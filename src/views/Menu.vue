<template>
    <h1>Menu</h1>
    <router-link to="/create-offer">CreateOffer</router-link> |
    <router-link to="/offers">Offers</router-link> |
    <router-link to="/bookinghistory">Check your booking history</router-link> |
    <router-link to="/usersoffers">Check you offers</router-link> |
    <button @click="handleSignOut" v-if="isLoggedIn">Logout</button>
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

<style>

</style>