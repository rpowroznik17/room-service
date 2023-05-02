<template>
  <router-link to="/menu">Go back to menu</router-link>
  <div>
    <h2>My reservations:</h2>
    <ul>
      <li v-for="booking in bookings" :key="booking.id">
        <h3>{{ booking.offer.title }}</h3>
        <p>Nights: {{ booking.nights }}</p>
        <p>Total price: {{ booking.total_price }} zł</p>
        <p>Rating:</p>
        <input type="number" min="1" max="5" v-model="booking.rating">
        <p>Describe:</p>
        <textarea v-model="booking.review"></textarea>
        <button @click="submitReview(booking)">Save opinion</button>
      </li>
    </ul>
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
