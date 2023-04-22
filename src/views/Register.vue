<template>
    <h1>Create an Account</h1>
    <input type="text" placeholder="Email" v-model="email"/>
    <input type="password" placeholder="Password" v-model="password"/>
    <button @click="register">Submit</button>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const router = useRouter();

const register = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email.value, password.value)
     .then((data) => {
        console.log("Successfully registered");
        console.log(auth.currentUser);
        router.push("/menu");
     })
     .catch((error) => {
        console.log(error.code);
        alert(error.message);
     });

}

</script>

<style>

</style>