<template>
  <router-link to="/menu">Go back to menu</router-link>
  <h1>Find your perfect accomodation</h1>
  <div>
    <ul>
      <li v-for="offer in offers" :key="offer.id">
        <h2>{{ offer.title }}</h2>
        <p>Price per night: {{ offer.price_per_night }} zł</p>
        <p>Max amount of people: {{ offer.max_amount_of_people }}</p>
        <p>Description: {{ offer.description }}</p>
        <img v-if="offer.imageURL" :src="offer.imageURL" alt="Offer Image">
        <router-link :to="{ name: 'OfferDetails', params: { id: offer.id } }">
          Check offer
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
import { db, storage } from "../main.js";
import { collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

export default {
  data() {
    return {
      offers: []
    };
  },
  async created() {
    const querySnapshot = await getDocs(collection(db, "offers"));
    for (const doc of querySnapshot.docs) {
      const offerData = doc.data();
      const imageURL = offerData.imageURL;
      let offer = {
        id: doc.id,
        title: offerData.title,
        price_per_night: offerData.price_per_night,
        max_amount_of_people: offerData.max_amount_of_people,
        description: offerData.description,
        imageURL: null
      };
      if (imageURL) {
        const imageRef = ref(storage, imageURL);
        try {
          const imageURL = await getDownloadURL(imageRef);
          offer.imageURL = imageURL;
        } catch (error) {
          console.error(`Failed to download image for offer ${doc.id}`, error);
        }
      }
      this.offers.push(offer);
    }
  }
};
</script>