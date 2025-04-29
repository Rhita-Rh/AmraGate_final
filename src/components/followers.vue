<template>
    <div class="followers-list">
      <h2>Followers</h2>
      <ul>
        <li v-for="(follower, index) in followers" :key="index">
          <p>{{ follower.name }} - {{ follower.email }}</p>
        </li>
      </ul>
      <p v-if="followers.length === 0">No followers found.</p>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
  import { getAuth } from "firebase/auth";
  
  export default {
    name: "FollowersList",
    setup() {
      const db = getFirestore();
      const auth = getAuth();
      const followers = ref([]);
  
      // Fetch followers data from Firestore
      const getFollowers = async () => {
        const user = auth.currentUser;
        if (!user) {
          console.log("User not logged in");
          return;
        }
  
        try {
          // Assuming 'followers' collection in Firestore, where 'followerIds' are stored
          const followersQuery = query(
            collection(db, "users", user.uid, "followers") // Assuming followers are under 'users/{uid}/followers'
          );
  
          const querySnapshot = await getDocs(followersQuery);
          followers.value = querySnapshot.docs.map(doc => doc.data());
        } catch (error) {
          console.error("Error fetching followers:", error);
        }
      };
  
      onMounted(() => {
        getFollowers();
      });
  
      return {
        followers,
      };
    },
  };
  </script>
  
  <style scoped>
  .followers-list {
    margin: 20px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
  }
  
  h2 {
    color: #4caf50;
  }
  
  ul {
    list-style-type: none;
    padding-left: 0;
  }
  
  li {
    padding: 10px;
    margin: 10px 0;
    background-color: #e0e0e0;
    border-radius: 4px;
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
  </style>
  