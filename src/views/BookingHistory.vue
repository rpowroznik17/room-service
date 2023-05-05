<template>
  <div class="container-md">  
    <div>
      <h2 class="text-center">My reservations:</h2>
      <ul class="list-group no-dot">
        <li v-for="booking in bookings" :key="booking.id">
          <h3 class="text-center">{{ offers[booking.offer].title }}</h3>
          <p>Nights: {{ booking.nights }}</p>
          <p class="pb-2">Total price: {{ booking.total_price }} zł</p>
          <p class="d-inline">Rating (1-5):</p>
          <input class="d-inline pb-2" type="number" min="1" max="5" v-model="booking.rating">
          <p>Describe:</p>
          <textarea class="form-control pb-2 mb-2" v-model="booking.review"></textarea>
          <div class="text-center">
          <button class="btn w-75 btn-dark" @click="submitReview(booking)">Save opinion</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { db } from "../main.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

export default {
  data() {
    return {
      bookings: [],
      offers: {}
    };
  },


  async created() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("client", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const bookings = [];
        querySnapshot.forEach((doc) => {
          const booking = doc.data();
          booking.id = doc.id;
          bookings.push(booking);
        });
        this.bookings = bookings;

        const offersRef = collection(db, "offers");
        const offersSnapshot = await getDocs(offersRef);
        const offers = {};
        offersSnapshot.forEach((doc) => {
          const offer = doc.data();
          offers[doc.id] = offer;
        });
        this.offers = offers;
      }
    });
  },


  methods: {
    async submitReview(booking) {
      try {
        const bookingRef = doc(db, "bookings", booking.id);
        await updateDoc(bookingRef, {
          rating: booking.rating,
          review: booking.review,
        });
        console.log("Opinia została zapisana");
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>