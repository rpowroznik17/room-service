<template>
  <div class="container-md text-center pt-2">  
        <p v-if="errorMsg">{{ errorMsg }}</p>
        <h2>Enter your credentials</h2>
        <div class="row pb-3">
            <div class="col">
                <input type="text" class="form-control" placeholder="Email" v-model="email"/>
            </div>
            <div class="col">
                <input type="password" class="form-control" placeholder="Password" v-model="password"/>
            </div>
        </div>
        <button @click="login" type="button" class="btn w-75 btn-dark">Log in</button><br>
        <h4 class = "pt-2 pb-2">Or</h4>
        <button @click="signInWithGoogle" type="button" class="btn w-75 btn-dark">Sign in with Google</button>
  </div>
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