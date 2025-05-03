<template>
  <router-link to="/Dashboard"><button class="back">Back to Dashboard</button></router-link>
  <div class="accounts-container">
    <h2>Followers</h2>

    <!-- Search Bar -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search by name..."
      class="search-bar"
    />

    <div
      class="user-card"
      v-for="follower in filteredFollowers"
      :key="follower.id"
    >
      <div class="user-info">
        <img
          :src="follower.profilePhoto || '/profile.png'"
          alt="Profile Photo"
          class="profile-photo"
        />
        <div class="user-details">
          <h3>{{ follower.name }}</h3>
          <p>@{{ follower.username }}</p>
        </div>
        <button class="unfollow-btn" @click="goToUserDetails(follower.id)">
    View Details
  </button>
      </div>
    </div>

    <p v-if="filteredFollowers.length === 0">No followers found.</p>
  </div>
</template>

<script>
import { ref, onMounted,computed } from "vue";
import { useRouter } from "vue-router";
import {
  getFirestore,
  getDoc,
  doc,
  getDocs,
  collection,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  name: "followers",
  setup() {
    const router = useRouter();
  const goToUserDetails = (userId) => {
    router.push(`/accounts/${userId}`);
  };
    const db = getFirestore();
    const auth = getAuth();
    const currentUser = ref(null);
    const followers = ref([]);
    const searchQuery = ref("");

    const getFollowers = async () => {
      currentUser.value = auth.currentUser;
      if (!currentUser.value) return;

      const userDoc = await getDoc(doc(db, "users", currentUser.value.uid));
      if (!userDoc.exists()) return;

      const followerIds = userDoc.data().followers || [];

      if (followerIds.length === 0) {
        followers.value = [];
        return;
      }

      const usersSnapshot = await getDocs(collection(db, "users"));

      followers.value = usersSnapshot.docs
        .filter((doc) => followerIds.includes(doc.id))
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
    };

    const filteredFollowers = computed(() => {
      return followers.value.filter((follower) =>
        follower.name
          ?.toLowerCase()
          .startsWith(searchQuery.value.trim().toLowerCase())
      );
    });

    onMounted(() => {
      getFollowers();
    });

    return {
      followers,
      searchQuery,
      filteredFollowers,
      goToUserDetails,
    };
  },
};
</script>

<style scoped>
.accounts-container {
  max-width: 900px;
  margin: 40px auto;
  background: linear-gradient(135deg, #f1fff5, #ffffff);
  border-radius: 20px;
  padding: 30px 40px;
  box-shadow: 0 12px 40px rgba(76, 175, 80, 0.1);
  font-family: 'Quicksand', sans-serif;
}

.accounts-container h2 {
  text-align: center;
  color: #66bb6a;
  font-size: 2.5rem;
  margin-bottom: 25px;
  letter-spacing: 1px;
}

.unfollow-btn {
  display: flex;
  margin-left: 400px;
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #66bb6a, #a5d6a7);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(102, 187, 106, 0.25);
}
.search-bar {
  width: 100%;
  padding: 10px 15px;
  margin-bottom: 25px;
  border: 2px solid #a5d6a7;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
}

.user-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #e8f5e9;
  border: 2px solid #a5d6a7;
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 20px;
  box-shadow: 0 6px 14px rgba(76, 175, 80, 0.08);
  transition: transform 0.3s ease;
}

.user-card:hover {
  transform: translateY(-4px);
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
  border: 3px solid #66bb6a;
  margin-right: 20px;
  box-shadow: 0 2px 8px rgba(0, 128, 0, 0.15);
}

.user-details h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #66bb6a;
}

.user-details p {
  margin: 4px 0 0;
  font-size: 0.95rem;
  color: #66bb6a;
  font-weight: 500;
}
.back{
  background-color: #f44336;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.accounts-container p {
  text-align: center;
  margin-top: 40px;
  font-size: 1.2rem;
  color: #789262;
}
</style>
