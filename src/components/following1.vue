<template>
  <router-link to="/Dashboard"><button class="back">Back to Dashboard</button></router-link>
  <div class="accounts-container">
    <h2>Following</h2>

    <!-- Search bar -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search by name..."
      class="search-bar"
    />

    <div class="user-card" v-for="user in filteredFollowing" :key="user.id">
      <div class="user-info">
        <img
          :src="user.profilePhoto || '/profile.png'"
          alt="Profile Photo"
          class="profile-photo"
        />
        <div class="user-details">
          <h3>{{ user.name }}</h3>
          <p>@{{ user.username }}</p>
        </div>
      </div>
      <div class="follow-buttons">
        <button @click="unfollowUser(user)" class="unfollow-btn">
          Unfollow
        </button>
      </div>
    </div>

    <p v-if="filteredFollowing.length === 0">
      You're not following anyone yet.
    </p>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  arrayRemove,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  name: "Following",
  setup() {
    const db = getFirestore();
    const auth = getAuth();

    const currentUser = ref(null);
    const followingUsers = ref([]);
    const searchQuery = ref("");

    const loadFollowingUsers = async () => {
      currentUser.value = auth.currentUser;
      if (!currentUser.value) return;

      const userDoc = await getDoc(doc(db, "users", currentUser.value.uid));
      if (!userDoc.exists()) return;

      const followingIds = userDoc.data().following || [];

      if (followingIds.length === 0) {
        followingUsers.value = [];
        return;
      }

      const usersSnapshot = await getDocs(collection(db, "users"));
      followingUsers.value = usersSnapshot.docs
        .filter((doc) => followingIds.includes(doc.id))
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
    };

    const unfollowUser = async (user) => {
      try {
        if (!currentUser.value) return;

        await updateDoc(doc(db, "users", currentUser.value.uid), {
          following: arrayRemove(user.id),
        });

        await updateDoc(doc(db, "users", user.id), {
          followers: arrayRemove(currentUser.value.uid),
        });

        await loadFollowingUsers();
      } catch (error) {
        console.error("Error unfollowing user:", error);
      }
    };

    const filteredFollowing = computed(() => {
      return followingUsers.value.filter((user) =>
        user.name
          ?.toLowerCase()
          .startsWith(searchQuery.value.trim().toLowerCase())
      );
    });

    onMounted(loadFollowingUsers);

    return {
      followingUsers,
      searchQuery,
      filteredFollowing,
      unfollowUser,
    };
  },
};
</script>

<style scoped>
.accounts-container {
  min-height: 100vh;
  padding: 30px;
  font-family: 'Quicksand', sans-serif;
  background: radial-gradient(circle at top left, #f3f8fd, #f8f0f8);
  animation: floatBg 10s infinite alternate;
  color: #4a4a4a;
}

@keyframes floatBg {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.accounts-container h2 {
  text-align: center;
  color: #7ba6dd;
  font-size: 2.2rem;
  margin-bottom: 30px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 15px;
}

.search-bar {
  width: 100%;
  padding: 12px 20px;
  margin-bottom: 30px;
  border: 1px solid #d0d6e2;
  border-radius: 10px;
  font-size: 1rem;
  background-color: #f9fafd;
  box-shadow: 0 2px 6px rgba(148, 182, 229, 0.1);
  transition: all 0.3s ease;
}

.search-bar:focus {
  outline: none;
  border-color: #7ba6dd;
  box-shadow: 0 0 0 3px rgba(123, 166, 221, 0.2);
}

.user-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px 25px;
  margin-bottom: 20px;
  box-shadow: 0 6px 20px rgba(148, 182, 229, 0.15);
  border: 1px solid #e0e8f5;
  transition: all 0.3s ease;
}

.user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(148, 182, 229, 0.2);
}

.user-info {
  display: flex;
  align-items: center;
}

.profile-photo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #7ba6dd;
  margin-right: 20px;
  box-shadow: 0 2px 8px rgba(123, 166, 221, 0.15);
}

.user-details h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #4d5a6a;
}

.user-details p {
  margin: 4px 0 0;
  font-size: 0.95rem;
  color: #6b7c93;
  font-weight: 500;
}

.follow-buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.unfollow-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #e48a8a, #f2b6b6);
  color: white;
  box-shadow: 0 4px 12px rgba(228, 138, 138, 0.15);
}

.unfollow-btn:hover {
  background: linear-gradient(135deg, #db7979, #e9a0a0);
  transform: translateY(-2px);
}

.back {
  background: linear-gradient(135deg, #e48a8a, #f2b6b6);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(228, 138, 138, 0.2);
  margin-bottom: 20px;
}

.back:hover {
  background: linear-gradient(135deg, #db7979, #e9a0a0);
  transform: translateY(-2px);
}

.accounts-container p {
  text-align: center;
  margin-top: 40px;
  font-size: 1.2rem;
  color: #6b7c93;
}

@media (max-width: 768px) {
  .accounts-container {
    padding: 20px 15px;
  }
  
  .user-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .follow-buttons {
    width: 100%;
    margin-top: 15px;
  }
  
  .unfollow-btn {
    width: 100%;
  }
}
</style>