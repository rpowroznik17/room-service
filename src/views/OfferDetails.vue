<template>
    <div class="container-mb mx-auto" style="max-width: 80%">
      <div class = "text-center">        
      <h1>{{ offer.title }}</h1>
      <img :src="offer.imageURL" alt="Offer Image" class="img-fluid mx-auto mb-3" style="width:100%" v-if="offer.imageURL">
      </div>
      <h5>Description</h5>
      <p>{{ offer.description }}</p>
      <h5>{{ offer.price_per_night }} PLN/night</h5>
      <p>Max amount of people: {{ offer.max_amount_of_people }}</p>
      <div class = "container text-center">
        <p>Nights: {{ counter }}</p>
        <div class="container text-center">   
        <button class="my-3 w-25 btn btn-dark text-center" v-on:click="counter += 1">+</button>
        <button style="display: inline;" class="my-3 w-25 btn btn-dark" v-on:click="counter > 0 ? counter -= 1 : null" :disabled="counter == 0">-</button>
        </div>
      </div>   
      <h5>Total price: {{ totalPrice }}</h5>
      <div class = "text-center">        
        <!--<div id="map" class="img-fluid mx-auto mb-3" style="width: 900px; height: 580px"></div> working on local, not on firebase -->
        <button type="button" class="my-3 w-75 btn btn-dark" @click="bookOffer">Book now</button>
      </div>
    </div>
</template>
<script>
import { db, storage } from "../main.js";
import { getDoc, doc, addDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRouter } from "vue-router";
import { ref, getDownloadURL } from "firebase/storage";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
export default {
    data() {
      return {
        offer: null,
        counter: 0,
        router: useRouter()
    };
    },
  computed: {
    totalPrice() {
      if (this.offer) {
        return this.counter * this.offer.price_per_night;
    } else {
        return 0;
    }
    },
  },

  async created() {
    const offerId = this.$route.params.id;
    const docRef = doc(db, "offers", offerId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.offer = docSnap.data();
    if (this.offer.imageFileName) {
      const imageRef = ref(storage, `images/${this.offer.imageFileName}`);
      const imageURL = await getDownloadURL(imageRef);
      this.offer.imageURL = imageURL;
    }
    } else {
      console.log("Error");
    }
  },
// Map code, working on localhost, not working on firebase
  mounted() {
    const { latitude, longitude } = this.offer.location;
    // Show a map centered at latitude / longitude.
    var mapOptions = {
      center: [latitude, longitude],
      zoom: 10,
    };

    var map = new L.map("map", mapOptions);

    var layer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");

    map.addLayer(layer);

    var marker = L.marker([latitude, longitude]);

    // Adding marker to the map
    marker.addTo(map);
  },

  methods: {
    async bookOffer() {
      const user = getAuth().currentUser;
      const offerId = this.$route.params.id;
      const docRef = doc(db, "offers", offerId);
      if (user) {
        const booking = {
        nights: this.counter,
        total_price: this.totalPrice,
        client: user.uid,
        offer: docRef.id,
      };
      try {
        const docRef = await addDoc(collection(db, "bookings"), booking);
        navigator.vibrate(1000);
        alert("Congratulations! You have booked a room. Reservation ID: " + docRef.id)
        this.router.push("/offers");
      } catch (e) {
          console.error("Error adding booking: ", e);
    }
    }
    },
    },
};
</script>