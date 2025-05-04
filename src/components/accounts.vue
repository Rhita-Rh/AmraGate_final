<template>
  <router-link to="/Home" class="back-button">
    <button class="back">Back to Home</button>
  </router-link>
  <div class="accounts-container">
    <h2>All Users</h2>
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search users by name..."
      class="search-bar"
    />
    <div class="user-card" v-for="(user, index) in filteredUsers" :key="index">
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
      <div class="follow-buttons" v-if="currentUser?.uid !== user.id">
        <button
          v-if="!isFollowing(user)"
          @click="followUser(user)"
          class="follow-btn"
        >
          Follow
        </button>
        <button
          v-else
          @click="unfollowUser(user)"
          class="unfollow-btn"
        >
          Unfollow
        </button>
      </div>
      <button
        @click="goToUserDetails(user.id)"
        class="follow-btn"
      >
        View Details
      </button>
    </div>
    <p v-if="filteredUsers.length === 0">No users found.</p>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRouter } from 'vue-router';
export default {
  name: "accounts",
  setup() {
    const router = useRouter();

    const goToUserDetails = (userId) => {
      router.push({ name: 'UserDetails', params: { id: userId } });
    };

    const db = getFirestore();
    const auth = getAuth();

    const users = ref([]);
    const searchQuery = ref("");
    const currentUser = ref(null);
    const currentUserData = ref({});

    const getCurrentUser = async () => {
      currentUser.value = auth.currentUser;
      if (currentUser.value) {
        const userDoc = await getDoc(doc(db, "users", currentUser.value.uid));
        if (userDoc.exists()) {
          currentUserData.value = userDoc.data();
        }
      }
    };

    const getUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        users.value = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((user) => user.id !== auth.currentUser?.uid); // 🔥 Exclure soi-même
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const isFollowing = (user) => {
      return (
        currentUserData.value?.following &&
        currentUserData.value.following.includes(user.id)
      );
    };

    const followUser = async (user) => {
      if (!currentUser.value) return;

      try {
        await updateDoc(doc(db, "users", currentUser.value.uid), {
          following: arrayUnion(user.id),
        });

        await updateDoc(doc(db, "users", user.id), {
          followers: arrayUnion(currentUser.value.uid),
        });

        if (!currentUserData.value.following) {
          currentUserData.value.following = [];
        }
        if (!currentUserData.value.following.includes(user.id)) {
          currentUserData.value.following.push(user.id);
        }

        await getUsers();
      } catch (error) {
        console.error("Error following user:", error);
      }
    };

    const unfollowUser = async (user) => {
      if (!currentUser.value) return;

      try {
        await updateDoc(doc(db, "users", currentUser.value.uid), {
          following: arrayRemove(user.id),
        });

        await updateDoc(doc(db, "users", user.id), {
          followers: arrayRemove(currentUser.value.uid),
        });

        if (currentUserData.value.following) {
          currentUserData.value.following = currentUserData.value.following.filter(
            (id) => id !== user.id
          );
        }

        await getUsers();
      } catch (error) {
        console.error("Error unfollowing user:", error);
      }
    };

    const filteredUsers = computed(() => {
      const query = searchQuery.value.trim().toLowerCase();
      return users.value.filter((user) =>
        user.name?.toLowerCase().startsWith(query)
      );
    });

    onMounted(async () => {
      await getCurrentUser();
      await getUsers();
    });

    return {
      users,
      currentUser,
      isFollowing,
      followUser,
      unfollowUser,
      searchQuery,
      filteredUsers,
      goToUserDetails,
    };
  },
};
</script>
<style scoped>
.accounts-container {
  min-height: 100vh;
  padding: 20px;
  font-family: 'Quicksand', sans-serif;
  background: radial-gradient(circle at top left, #f3f8fd, #f8f0f8);
  animation: floatBg 10s infinite alternate;
  color: #4a4a4a;
  overflow-x: hidden;
}

@keyframes floatBg {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.accounts-container h2 {
  text-align: center;
  color: #7ba6dd;
  font-size: 2.5rem;
  margin-bottom: 25px;
  letter-spacing: 1px;
}

.search-bar {
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 25px;
  border: 1px solid #d0d6e2;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  background-color: #f9fafd;
  box-shadow: 0 2px 6px rgba(148, 182, 229, 0.1);
}

.user-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 20px;
  box-shadow: 0 6px 14px rgba(148, 182, 229, 0.15);
  transition: transform 0.3s ease;
  border: 1px solid #e0e8f5;
}

.user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(148, 182, 229, 0.2);
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
  font-size: 1.4rem;
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

.follow-btn,
.unfollow-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(148, 182, 229, 0.15);
}

.follow-btn:hover,
.unfollow-btn:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
  transform: translateY(-2px);
}

.unfollow-btn {
  background: linear-gradient(135deg, #e48a8a, #f2b6b6);
}

.unfollow-btn:hover {
  background: linear-gradient(135deg, #db7979, #e9a0a0);
}

.accounts-container p {
  text-align: center;
  margin-top: 40px;
  font-size: 1.2rem;
  color: #6b7c93;
}

.back {
  background: linear-gradient(135deg, #e48a8a, #f2b6b6);
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(228, 138, 138, 0.2);
}

.back:hover {
  background: linear-gradient(135deg, #db7979, #e9a0a0);
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  .user-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .follow-buttons {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 15px;
  }

  .follow-btn,
  .unfollow-btn {
    width: 48%;
  }
}

/* Additional matching styles from dashboard */
.info-item {
  display: flex;
  margin-bottom: 15px;
  align-items: center;
}

.info-label {
  font-weight: 600;
  width: 100px;
  color: #7ba6dd;
}

.info-value {
  flex: 1;
  padding: 8px 12px;
  background: #f5f8fd;
  border-radius: 6px;
}

.default-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #6b7c93;
  border: 2px solid #7ba6dd;
  font-size: 24px;
}
</style>
