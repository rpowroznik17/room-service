<template>
    <h1>Menu</h1>
    <router-link to="/offers">Check offers</router-link>
    <router-link to="/create-offer">CreateOffer</router-link>
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