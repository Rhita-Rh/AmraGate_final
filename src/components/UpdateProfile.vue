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
  
  <style scoped>
  .user-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    background-color: #f5f7fa;
    min-height: 100vh;
    font-family: 'Segoe UI', sans-serif;
    color: #333;
  }
  
  h2 {
    color: #2f855a;
    margin-bottom: 30px;
  }
  

  form {
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 12px;
    padding: 30px;
    width: 100%;
    max-width: 600px;
    box-sizing: border-box;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
  }
  
  input,
  textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 8px;
    border: 1px solid #ccc;
    background-color: #fff;
    font-size: 14px;
    box-sizing: border-box;
  }
  
  input:focus,
  textarea:focus {
    border-color: #4CAF50;
    outline: none;
  }
  
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    background-color: #e14444;
  }
  

  button[type="submit"] {
    background-color: #4CAF50;
  }
  
  button[type="submit"]:hover {
    background-color: #388E3C;
  }
  
  form > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    gap: 15px;
  }

  input[disabled], textarea[disabled] {
    background-color: #f0f0f0;
    cursor: not-allowed;
  }
  

  textarea {
    height: 100px;
    resize: vertical;
  }
  
  p {
    margin-top: 20px;
    color: #666;
    font-size: 16px;
  }
  </style>
  