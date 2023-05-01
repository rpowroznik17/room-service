<template>
    <h1>Create an Account</h1>
    <div class="container">
      <input type="text" placeholder="Email" v-model="email"/>
      <input type="password" placeholder="Password" v-model="password"/>
      <input type="text" placeholder="Name" v-model="name"/>
      <input type="text" placeholder="Surname" v-model="surname"/>
      <input type="text" placeholder="Bio" v-model="bio"/>
      <button @click="register">Submit</button>
    </div>
    
</template>

<script setup>
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from 'firebase/firestore'
import { useRouter } from "vue-router";
import { db } from "../main.js"

const email = ref("");
const password = ref("");
const name = ref("");
const surname = ref("");
const bio = ref("");
const router = useRouter();

const register = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email.value, password.value).then(() => {
      setDoc(doc(db, "users", auth.currentUser.uid), {
         name: name.value,
         surname: surname.value,
         bio: bio.value,
      })
      
    })
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
h1{text-align: center;}
div{text-align: center;}
</style>