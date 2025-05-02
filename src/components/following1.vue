<template>
  <div class="accounts-container">
    <h2>Following</h2>

    <!-- Barre de recherche -->
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

.follow-buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.unfollow-btn {
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

.unfollow-btn:hover {
  background: linear-gradient(135deg, #66bb6a, #81c784);
  transform: scale(1.04);
}

.accounts-container p {
  text-align: center;
  margin-top: 40px;
  font-size: 1.2rem;
  color: #789262;
}
</style>
