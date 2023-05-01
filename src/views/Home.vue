<template>
  <h1>Room Service</h1>

  <div class="container">
    <nav>
      <router-link to="/login">Login</router-link> |
      <router-link to="/register">Register</router-link>
    </nav>
  </div>
    <router-view />
</template>
<style>
body {background-color: antiquewhite;}
h1{text-align: center;}
nav{text-align: center;}
</style>