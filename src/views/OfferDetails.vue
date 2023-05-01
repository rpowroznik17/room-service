<template>
  <div>
    <h1>{{ offer.title }}</h1>
    <p>Price per night: {{ offer.price_per_night }} zł</p>
    <p>Max amount of people: {{ offer.max_amount_of_people }}</p>
    <p>{{ offer.description }}</p>
    <p><button v-on:click="counter += 1">+</button></p>
    <p><button v-on:click="counter > 0 ? counter -= 1 : null" :disabled="counter == 0">-</button></p>
    <p>Nights: {{ counter }}</p>
    <p>Total price: {{ totalPrice }}</p>
    <p><button v-on:click="bookOffer">Book Now</button></p>
  </div>
</template>
<script>
import { db } from "../main.js";
import { getDoc, doc, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
export default {
  data() {
    return {
      offer: null,
      counter: 0,
  };
  },

  computed: {
    totalPrice() {
      if (this.offer) {
        return this.counter * this.offer.price_per_night;
  }   else {
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
    } else {
      console.log("Errror");
    }
  },

  methods: {
    async bookOffer() {
    const user = getAuth().currentUser;
    if (user) {
      const booking = {
      nights: this.counter,
      total_price: this.totalPrice,
      client: doc(db, "users", user.uid),
      offer: doc(db, "offers", this.offer.id),
    };
    try {
      const docRef = await addDoc(db, "bookings", booking);
      console.log("Booking created with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding booking: ", e);
    }
    }
    },
  },
};
</script>