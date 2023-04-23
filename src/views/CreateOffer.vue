<template>
    <h1>Create an Offer</h1>

    <input type="text" placeholder="Title" v-model="title" required/>
    <input type="number" placeholder="Max amount of people" v-model="max_amount_of_people" required/>
    <input type="number" placeholder="Price per night" v-model="price_per_night" required/>
    <textarea placeholder="Description" v-model="description"></textarea>
    <div id = "map" style = "width: 900px; height: 580px"></div>

    <button @click="createOffer">Finish</button>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAuth } from "firebase/auth";
import { addDoc, collection, GeoPoint } from 'firebase/firestore'
import { useRouter } from "vue-router";
import { db } from "../main.js"
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const title = ref("");
const max_amount_of_people = ref("");
const price_per_night = ref("");
const description = ref("");
const router = useRouter();
let locationLatitude;
let locationLongitude;

const createOffer = () => {
    const auth = getAuth();
    addDoc(collection(db, "offers"), {
        title: title.value,
        max_amount_of_people: max_amount_of_people.value,
        price_per_night: price_per_night.value,
        description: description.value,
        ownerId: auth.currentUser.uid,
        location: new GeoPoint(locationLatitude, locationLongitude),
    })
    .then((data) => {
        console.log("Successfully placed an offer");
        router.push("/menu");
     })
     .catch((error) => {
        console.log(error.code);
        alert(error.message);
     });
}

onMounted(() => {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        // Show a map centered at latitude / longitude.
        var mapOptions = {
            center: [latitude, longitude],
            zoom: 10
            }
            
            var map = new L.map('map', mapOptions);
            
            var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
            
            map.addLayer(layer);

            map.on("click", (event) => {
                locationLatitude = event.latlng.lat;
                locationLongitude = event.latlng.lng;
            });
    });
});
</script>