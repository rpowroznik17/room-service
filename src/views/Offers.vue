<template>
  <h1>Find your perfect accomodation</h1>
  <div>
    <ul>
      <li v-for="offer in offers" :key="offer.id">
        <h2>{{ offer.title }}</h2>
        <p>Price per night: {{ offer.price_per_night }} zł</p>
        <p> Max amount of people: {{ offer.max_amount_of_people }}</p>
        <p>Description: {{ offer.description }}</p>
        <router-link :to="{ name: 'OfferDetails', params: { id: offer.id } }">
          Check offer
        </router-link>

      </li>
    </ul>
  </div>
</template>
<script>
import { db } from "../main.js"
import { collection, getDocs } from "firebase/firestore"; 

export default {
  data() {
    return {
      offers: []
    }
  },
  async created() {
    const querySnapshot = await getDocs(collection(db, "offers"));
    querySnapshot.forEach((doc) => {
      this.offers.push({
        id: doc.id,
        title: doc.data().title,
        price_per_night: doc.data().price_per_night,
        max_amount_of_people: doc.data().max_amount_of_people,
        description: doc.data().description
      });
    });
  }
}
</script>
