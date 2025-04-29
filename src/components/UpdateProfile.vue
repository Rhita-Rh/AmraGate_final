<template>
    <div class="user-profile">
      <h2>My Profile</h2>
      <form @submit.prevent="updateProfile">
        <label>Name:</label>
        <input v-model="userData.name" />
  
        <label>Email:</label>
        <input v-model="userData.email" disabled />

        <label>Phone:</label>
        <input v-model="userData.phone" />
  
        <label>Bio:</label>
        <textarea v-model="userData.bio" />
  
        <div style="display:flex; justify-content:space-between; margin-top:20px;">
          <button type="submit">Update</button>
          <router-link to="/Dashboard"><button>Back to Dashboard</button></router-link>
        </div>
  
      </form>
    </div>
  </template>
  
  <script>
  import { db, auth } from "../firebase-config";
  import { doc, getDoc, updateDoc } from "firebase/firestore";

  export default {
    name: "UpdateProfile",
    data() {
      return {
        userData: {
          name: "",
          email: "",
          bio: "",
          phone: "",
          goals: [],
        }
      };
    },
    created() {
      this.fetchUserData();
    },
    methods: {
      async fetchUserData() {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            this.userData = docSnap.data();
          }
        }
      },
      async updateProfile() {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          await updateDoc(docRef, this.userData);
          alert("Updated Profile");
          this.$router.push("/Dashboard");
        }
      }
    }
  };
  </script>
  
  