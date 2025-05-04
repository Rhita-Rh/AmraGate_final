<template>
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
.follow-buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.follow-btn,
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

.follow-btn:hover,
.unfollow-btn:hover {
  background: linear-gradient(135deg, #66bb6a, #81c784);
  transform: scale(1.04);
}
.user-details-container {
  max-width: 900px;
  margin: 40px auto;
  background: linear-gradient(135deg, #f1fff5, #ffffff);
  border-radius: 20px;
  padding: 30px 40px;
  box-shadow: 0 12px 40px rgba(76, 175, 80, 0.1);
  font-family: 'Quicksand', sans-serif;
}

.user-details-container h2 {
  text-align: center;
  color: #66bb6a;
  font-size: 2.5rem;
  margin-bottom: 35px;
  letter-spacing: 1px;
}

.profile-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #66bb6a;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 128, 0, 0.15);
}

.project-card {
  background: #e8f5e9;
  border: 2px solid #a5d6a7;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 6px 14px rgba(76, 175, 80, 0.08);
}

.project-card h4 {
  margin: 0;
  font-size: 1.4rem;
  color: #66bb6a;
}
.project-card p {
  margin: 5px 0 0;
  font-size: 1rem;
  color: #333;
}
.back{
  background-color: #c62828;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}
.back:hover{
  background-color: #b71c1c;
  transform: scale(1.05);
}
</style>