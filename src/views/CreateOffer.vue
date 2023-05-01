<template>
    <h1>Create an Offer</h1>
    <div class="container">
    <input type="text" placeholder="Title" v-model="title" required />
    <input
      type="number"
      placeholder="Max amount of people"
      v-model="max_amount_of_people"
      required
    />
    <input
      type="number"
      placeholder="Price per night"
      v-model="price_per_night"
      required
    />
    <textarea placeholder="Description" v-model="description"></textarea>
  </div>
    <div>
      <input type="file" @change="handleFileUpload" />
      <img :src="imageUrl" v-if="imageUrl" />
    </div>
    <div id="map" style="width: 900px; height: 580px"></div>
  <button @click="createOffer">Finish</button>
  </template>
  
  <script setup>
  import { onMounted } from "vue";
  import { getStorage, ref, uploadBytes } from "firebase/storage";
  import { getAuth } from "firebase/auth";
  import { addDoc, collection, GeoPoint } from "firebase/firestore";
  import { useRouter } from "vue-router";
  import { db } from "../main.js";
  import "leaflet/dist/leaflet.css";
  import L from "leaflet";
  const title = ref("");
  const max_amount_of_people = ref("");
  const price_per_night = ref("");
  const description = ref("");
  const router = useRouter();
  let locationLatitude;
  let locationLongitude;
  const imageUrl = ref(null);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    // Create a storage reference with a unique filename
    const storageRef = ref(getStorage(), `images/${Date.now()}_${file.name}`);
    // Upload the file to Firebase Storage
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          imageUrl.value = downloadURL;
        });
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to upload image");
      });
  };
  const createOffer = () => {
    const auth = getAuth();
    addDoc(collection(db, "offers"), {
      title: title.value,
      max_amount_of_people: max_amount_of_people.value,
      price_per_night: price_per_night.value,
      description: description.value,
      ownerId: auth.currentUser.uid,
      location: new GeoPoint(locationLatitude, locationLongitude),
      imageURL: imageUrl.value,
    })
      .then((data) => {
        console.log("Successfully placed an offer");
        router.push("/menu");
      })
      .catch((error) => {
        console.log(error.code);
        alert(error.message);
      });
  };
  onMounted(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      // Show a map centered at latitude / longitude.
      var mapOptions = {
        center: [latitude, longitude],
        zoom: 10,
      };
      var map = new L.map("map", mapOptions);
      var layer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
      map.addLayer(layer);
      map.on("click", (event) => {
        locationLatitude = event.latlng.lat;
        locationLongitude = event.latlng.lng;
      });
    });
  });
  </script>
<style>
h1{text-align: center;}
div{text-align: center;}
</style>