<template>
  <!-- Your original template remains completely unchanged -->
  <router-link to="/Home" class="back-button">
    <button class="back">Back to Home</button>
  </router-link>
  <div v-if="user" class="user-details-container">
    <h2>{{ user.name }}</h2>
    <img :src="user.profilePhoto || '/profile.png'" alt="Profile Photo" class="profile-photo" />
    
    <!-- Follow Button Section - Simplified conditions -->
    <div v-if="currentUser && currentUser.uid && user.id && currentUser.uid !== user.id">
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
    
    <p>@{{ user.username }}</p>
    <p>{{ user.bio }}</p>
    <p>{{ user.email }}</p>
    <h3>Projects</h3>
    <div v-if="projects.length > 0">
      <div v-for="project in projects" :key="project.id" class="project-card">
        <h4>{{ project.title }}</h4>
        <p>{{ project.description }}</p>
      <div style="margin-top: 15px;">
        <router-link :to="`/project/${project.id}`" class="follow-btn" style="text-decoration: none;">View Project</router-link>
      </div>
      </div>
    </div>
    <p v-else>No projects found.</p>
  </div>
  <p v-else>Loading...</p>
</template>

<script>
// Your original script remains completely unchanged
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

export default {
  name: 'UserDetails',
  setup() {
    const route = useRoute();
    const db = getFirestore();
    const user = ref(null);
    const projects = ref([]);
    const auth = getAuth();
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

    const fetchUserDetails = async () => {
      const userDoc = await getDoc(doc(db, 'users', route.params.id));
      if (userDoc.exists()) {
        user.value = { id: userDoc.id, ...userDoc.data() };
        fetchUserProjects(route.params.id);
      }
    };

    const isFollowing = (user) => {
      return currentUserData.value?.following?.includes(user.id) || false;
    };

    const followUser = async (user) => {
      if (!currentUser.value || currentUser.value.uid === user.id) return;

      try {
        await updateDoc(doc(db, "users", currentUser.value.uid), {
          following: arrayUnion(user.id),
        });

        await updateDoc(doc(db, "users", user.id), {
          followers: arrayUnion(currentUser.value.uid),
        });

        currentUserData.value.following = [...(currentUserData.value.following || []), user.id];
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

        currentUserData.value.following = (currentUserData.value.following || []).filter(
          (id) => id !== user.id
        );
      } catch (error) {
        console.error("Error unfollowing user:", error);
      }
    };

    const fetchUserProjects = async (userId) => {
        const q = query(collection(db, 'projects'), where('owner', '==', userId));
        const querySnapshot = await getDocs(q);
        projects.value = querySnapshot.docs.map(doc => ({
          id: doc.id,  
          ...doc.data() 
        }));
      };
    onMounted(() => {
      getCurrentUser();
      fetchUserDetails();
    });

    return {
      user,
      projects,
      unfollowUser,
      isFollowing,
      followUser,
      currentUser,
      currentUserData,
    };
  },
};
</script>

<style scoped>
/* Updated CSS to match your Dashboard style while preserving functionality */
.user-profile {
  min-height: 100vh;
  padding: 20px;
  font-family: 'Quicksand', sans-serif;
  background: radial-gradient(circle at top left, #f3f8fd, #f8f0f8);
  animation: floatBg 10s infinite alternate;
  color: #4a4a4a;
}

@keyframes floatBg {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.user-details-container {
  max-width: 800px;
  margin: 20px auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 12px 30px rgba(148, 182, 229, 0.15);
}

.back-button {
  display: inline-block;
  margin-bottom: 20px;
}

.back {
  background: linear-gradient(135deg, #e48a8a, #f2b6b6);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back:hover {
  background: linear-gradient(135deg, #db7979, #e9a0a0);
  transform: translateY(-2px);
}

.profile-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #7ba6dd;
  margin: 0 auto 20px;
  display: block;
  box-shadow: 0 4px 12px rgba(123, 166, 221, 0.2);
}

h2 {
  color: #7ba6dd;
  text-align: center;
  font-size: 28px;
  margin-bottom: 10px;
}

h3 {
  color: #7ba6dd;
  margin: 25px 0 15px;
  font-size: 22px;
}

.follow-btn,
.unfollow-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin: 0 auto 20px;
}

.follow-btn {
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: white;
  box-shadow: 0 4px 12px rgba(148, 229, 148, 0.2);
}

.follow-btn:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
  transform: translateY(-2px);
}

.unfollow-btn {
  background: linear-gradient(135deg, #e48a8a, #f2b6b6);
  color: white;
  box-shadow: 0 4px 12px rgba(228, 138, 138, 0.2);
}

.unfollow-btn:hover {
  background: linear-gradient(135deg, #db7979, #e9a0a0);
  transform: translateY(-2px);
}

.project-card {
  background: #f5f8fd;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 6px 12px rgba(148, 182, 229, 0.12);
}

.project-card h4 {
  color: #7ba6dd;
  margin: 0 0 10px 0;
}

.view-project-link {
  display: inline-block;
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  margin-top: 15px;
  transition: all 0.3s ease;
}

.view-project-link:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .user-details-container {
    padding: 20px;
  }
}
</style>