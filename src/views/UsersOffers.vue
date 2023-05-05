<template>
  <div class="container-md text-center">  
    <div>
      <h1>My offers</h1>
      <div v-if="offers.length === 0">
        <p>You haven't added any offers yet.</p>
      </div>
      <div v-else>
      <ul class="list-group no-dot">
        <li v-for="offer in offers" :key="offer.id">
          <h2>{{ offer.title }}</h2>
          <p class="d-inline">Price per night: {{ offer.price_per_night }} zł</p>|
          <p class="d-inline"> Max amount of people: {{ offer.max_amount_of_people }}</p>|
          <p class="d-inline">Description: {{ offer.description }}</p>
          <img v-if="offer.imageURL" :src="offer.imageURL" alt="Offer Image" class="img-fluid mx-auto mb-3" style="width:100%">        
        </li>
      </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { db, storage } from "../main.js";
import { getDocs, collection, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDownloadURL, ref } from "firebase/storage";

export default {
  data() {
    return {
      offers: [],
    };
  },
  async created() {
    const auth = getAuth();
    const user = auth.currentUser;

    const q = query(
      collection(db, "offers"),
      where("ownerId", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      const offer = doc.data();
      offer.id = doc.id;

      if (offer.imageFileName) {
        const imageRef = ref(storage, `images/${offer.imageFileName}`);
        const imageURL = await getDownloadURL(imageRef);
        offer.imageURL = imageURL;
      }

      this.offers.push(offer);
    });
  },
};
</script>
