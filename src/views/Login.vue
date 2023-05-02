<template>
    <h1>Log in to an Account</h1>
    <p v-if="errorMsg">{{ errorMsg }}</p>
    <input type="text" placeholder="Email" v-model="email"/>
    <input type="password" placeholder="Password" v-model="password"/>
    <button @click="login">Log in</button>
    <button @click="signInWithGoogle">Sign in with Google</button>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const router = useRouter();
const errorMsg = ref();

const login = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email.value, password.value)
     .then((data) => {
        console.log("Successfully logged in");
        console.log(auth.currentUser);
        router.push("/menu");
     })
     .catch((error) => {
        console.log(error.code);
        switch (error.code) {
            case "auth/invalid-email":
                errorMsg.value = "Invalid email";
                break;
            case "auth/user-not-found":
                errorMsg.value = "No account with that email was found";
                break;
            case "auth/wrong-password":
                errorMsg.value = "Invalid password";
                break;
        }
     });

}

const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(getAuth(), provider)
     .then((result) => {
        console.log(result.user);
        router.push("/menu");
     })
     .catch((error) => {
        //handle error
     })
}

</script>

<style>

</style>