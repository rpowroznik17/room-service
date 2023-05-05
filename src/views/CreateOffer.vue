<template>
  <div class="container-md text-center">  
    <h1>Create an offer</h1>
    <div class="row pb-3">
      <input type="text" class="form-control" placeholder="Title" v-model="title" required />
    </div>  
    <div class="row pb-3">
      <input type="number" class="form-control" placeholder="Max amount of people" v-model="max_amount_of_people" required/>
    </div>
    <div class="row pb-3">

      <input type="number" class="form-control" placeholder="Price per night" v-model="price_per_night" required/>
    </div>  
    <textarea placeholder="Description" class="form-control" v-model="description"></textarea>
    <p class=mt-3>Upload a file:</p>
    <input class="btn w-75 btn-dark" type="file" @change="handleFileUpload"/>
    <img :src="imageUrl" class="img-fluid mx-auto mb-3" style="width:100%" v-if="imageUrl" />

    <div id="map" class="img-fluid mx-auto mb-3 mt-3"  style="width: 900px; height: 580px"></div>
    <button class="my-3 w-75 btn btn-dark" @click="createOffer">Post offer</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAuth } from "firebase/auth";
import { addDoc, collection, GeoPoint } from "firebase/firestore";
import { ref as refStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "vue-router";
import { db, storage } from "../main.js";
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
  const storageRef = refStorage(storage, "images/" + Date.now() + file.name);

  // Upload the file to Firebase Storage
  uploadBytes(storageRef, file)
    .then(() => {
      getDownloadURL(storageRef).then((downloadURL) => {
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
      navigator.vibrate(1000);
      alert("Successfully placed an offer!")
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

    var marker = null;

    map.on("click", (event) => {
      if (marker != null) {
        map.removeLayer(marker);
      }
      locationLatitude = event.latlng.lat;
      locationLongitude = event.latlng.lng;
      marker = new L.Marker([locationLatitude, locationLongitude]);
      map.addLayer(marker);
    });
  });
});
</script>