<template>
  <div class="container-md text-center">  
      <h1>Create your account</h1>
      <div class="row pb-3">
         <div class="col">
            <input type="text" class="form-control" placeholder="Email" v-model="email"/>
         </div>
         <div class="col">
            <input type="password" class="form-control" placeholder="Password" v-model="password"/>
         </div>
      </div>
      <div class="row pb-3">
         <div class="col">
            <input type="text" class="form-control" placeholder="Name" v-model="name"/>
         </div>
         <div class="col">
            <input type="text" class="form-control" placeholder="Surname" v-model="surname"/>
         </div>
      </div>
      <input type="text" class="form-control form-control-lg pb-5 mb-2" placeholder="Bio" v-model="bio"/>
      <button @click="register" class="btn w-75 btn-dark">Create account</button>
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

</style>