<template>
  <div class="container-md">  
    <h1 class="text-center">Find your perfect accomodation</h1>
    <div class="container">
      <div>
      <ul class="list-group no-dot">
        <li v-for="offer in offers" :key="offer.id">
          <h1 class="text-center">{{ offer.title }}</h1>
          <div class="text-center">
            <h6 class="d-inline">Price per night: {{ offer.price_per_night }} zł</h6> | 
            <h6 class="d-inline">Max amount of people: {{ offer.max_amount_of_people }}</h6>
          </div>
          <div>
            <img v-if="offer.imageURL" :src="offer.imageURL" alt="Offer Image" class="img-fluid mx-auto mb-3" style="width:100%">
          </div>
          <router-link :to="{ name: 'OfferDetails', params: { id: offer.id } }" class="btn w-100 btn-dark mb-5">
            Check offer
          </router-link>
        </li>
      </ul>
      </div>
    </div>
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