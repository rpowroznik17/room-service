<template>
  <div class="container-md text-center">  
    <h1 class="pb-2">Welcome to RoomService!</h1>
      <router-link to="/login" type="button" class="btn w-75 btn-dark">Login</router-link> 
      <h4 class="pb-2 pt-2">Don't have an account?</h4>
      <router-link to="/register" type="button" class="btn w-75 btn-dark">Sign up</router-link>
  </div>
  <router-view />
</template>
