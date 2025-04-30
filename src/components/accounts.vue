<template>
    <div class="accounts-container">
      <h2>All Users</h2>
      <div class="user-card" v-for="(user, index) in users" :key="index">
        <div class="user-info">
          <img :src="user.profilePhoto" alt="Profile Photo" class="profile-photo" />
          <div class="user-details">
            <h3>{{ user.name }}</h3>
            <p>@{{ user.username }}</p>
          </div>
        </div>
        <!-- Follow/Unfollow button -->
        <div class="follow-buttons">
          <button
            v-show="!isFollowing(user)"
            @click="followUser(user)"
            class="follow-btn"
          >
            Follow
          </button>
          <button
            v-show="isFollowing(user)"
            @click="unfollowUser(user)"
            class="unfollow-btn"
          >
            Unfollow
          </button>
        </div>
      </div>
      <p v-if="users.length === 0">No users found.</p>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { getFirestore, collection, getDocs, updateDoc, doc, arrayUnion, arrayRemove } from "firebase/firestore";
  import { getAuth } from "firebase/auth";
  
  export default {
    name: "accounts",
    setup() {
      const db = getFirestore();
      const auth = getAuth();
      const users = ref([]);
      const currentUser = ref(null);
  
      // Fetch the logged-in user
      const getCurrentUser = () => {
        currentUser.value = auth.currentUser;
        console.log('Current user:', currentUser.value); // Debugging line
      };
  
      // Fetch users data from Firestore
      const getUsers = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "users"));
          users.value = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
  
      // Check if the current user is following a particular user
      const isFollowing = (user) => {
        if (!currentUser.value || !currentUser.value.following) {
          return false; // If there's no current user or no following list, return false
        }
        return currentUser.value.following.includes(user.id); // Check if user.id is in the current user's following list
      };
  
      // Follow a user
      const followUser = async (user) => {
        if (!currentUser.value) {
          console.error("No logged-in user");
          return;
        }
  
        try {
          // Update the current user's "following" array
          await updateDoc(doc(db, "users", currentUser.value.uid), {
            following: arrayUnion(user.id), // Add the user to the "following" list
          });
  
          // Add the current user to the target user's "followers" array
          await updateDoc(doc(db, "users", user.id), {
            followers: arrayUnion(currentUser.value.uid), // Add current user to "followers" list
          });
  
          // Refresh users list and current user data to reflect changes
          getUsers();
          getCurrentUser();
        } catch (error) {
          console.error("Error following user:", error);
        }
      };
  
      // Unfollow a user
      const unfollowUser = async (user) => {
        if (!currentUser.value) {
          console.error("No logged-in user");
          return;
        }
  
        try {
          // Remove the user from the current user's "following" array
          await updateDoc(doc(db, "users", currentUser.value.uid), {
            following: arrayRemove(user.id), // Remove the user from the "following" list
          });
  
          // Remove the current user from the target user's "followers" array
          await updateDoc(doc(db, "users", user.id), {
            followers: arrayRemove(currentUser.value.uid), // Remove current user from "followers" list
          });
  
          // Refresh users list and current user data to reflect changes
          getUsers();
          getCurrentUser();
        } catch (error) {
          console.error("Error unfollowing user:", error);
        }
      };
  
      onMounted(() => {
        getCurrentUser();
        getUsers();
      });
  
      return {
        users,
        followUser,
        unfollowUser,
        isFollowing,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Existing styles remain the same */
  
  .follow-btn, .unfollow-btn {
    background-color: #4caf50;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
    margin: 5px 0;
  }
  
  .follow-btn:hover, .unfollow-btn:hover {
    background-color: #45a049;
  }
  
  .unfollow-btn {
    background-color: #ff4f4f;
  }
  
  .unfollow-btn:hover {
    background-color: #e04848;
  }
  </style>
  