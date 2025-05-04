<template>
  <!-- Your original template remains completely unchanged -->
  <router-link to="/Home" class="back-button">
    <button class="back">Back to Home</button>
  </router-link>
  <div v-if="user" class="user-details-container">
    <h2>{{ user.name }}</h2>
    <div class="avatar-container">
        <img
          v-if="user.photoURL"
          :src="user.photoURL"
          alt="Profile Photo"
          class="profile-photo"
        />
        <span v-else class="default-avatar">{{ user.name ? user.name.charAt(0).toUpperCase() : 'N' }}</span>
      </div>
    <div v-if="currentUser && currentUser.uid && user.id && currentUser.uid !== user.id">
      <button
        @click="isFollowing(user) ? unfollowUser(user) : followUser(user)"
        :class="isFollowing(user) ? 'unfollow-btn' : 'follow-btn'"
        class="toggle-btn"
      >
        {{ isFollowing(user) ? 'Unfollow' : 'Follow' }}
      </button>
    </div>
    
    <p style="font-size: large; font-weight: 500;">@{{ user.username }}</p>
    <p><span style="font-weight:500;">Email: </span>{{ user.email }}</p>
    <p>{{ user.bio }}</p>
    <br>
    <p class="createdat">{{ formattedCreatedAt }}</p>
    <h3>Projects</h3>
    <div v-if="projects.length > 0">
      <div v-for="project in projects" :key="project.id" class="project-card">
        <h4>{{ project.title }}</h4>
        <p>{{ project.description }}</p>
      <div style="margin-top: 15px;">
        <router-link :to="`/project/${project.id}`" class="view-project-btn">View Project</router-link>
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
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { computed } from 'vue';

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
          currentUserData.value.createdAt = currentUser.value.metadata.creationTime;
        }
      }
    };

    const formattedCreatedAt = computed(() => {
        if (!user.value?.createdAt) return 'Member since: Unknown date';
        
        try {
          // Handle both string timestamps and Firestore Timestamp objects
          const date = typeof user.value.createdAt === 'string' 
            ? new Date(user.value.createdAt)
            : new Date(user.value.createdAt.seconds * 1000);
          
          if (isNaN(date.getTime())) {
            return 'Member since: Unknown date';
          }
          
          return `Member since: ${date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}`;
        } catch (e) {
          console.error('Error formatting date:', e);
          return 'Member since: Unknown date';
        }
      });

    const fetchUserDetails = async () => {
  const userDoc = await getDoc(doc(db, 'users', route.params.id));
  if (userDoc.exists()) {
    const fetchedUser = { id: userDoc.id, ...userDoc.data() };

    // If the viewed user is the current user, add Auth metadata
    if (auth.currentUser && auth.currentUser.uid === fetchedUser.id) {
      // Use the correct Firebase Auth creation time property
      fetchedUser.createdAt = auth.currentUser.metadata.creationTime || new Date().toISOString();
    } else if (fetchedUser.createdAt) {
      // If the date exists in Firestore, ensure it's in proper format
      fetchedUser.createdAt = new Date(fetchedUser.createdAt.seconds * 1000).toISOString();
    } else {
      // Fallback to current time if no date exists
      fetchedUser.createdAt = new Date().toISOString();
    }

    user.value = fetchedUser;
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
      formattedCreatedAt
    };
  },
};
</script>

<style scoped>
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

.toggle-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin: 0 auto 20px;
  min-width: 100px;
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
.createdat{
  padding: 6px 12px;
  background-color: #c9e3ff; 
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
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
.createdat {
  padding: 6px 12px;
  background-color: #f0f7ff; 
  border-radius: 6px;
  font-size: 14px;
  color: #5a7ba6;
  display: inline-block;
  margin: 10px 0;
}
.view-project-btn {
  display: inline-block;
  background: linear-gradient(135deg, #7ba6dd, #94b6e5);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-weight: 500;
  margin-top: 15px;
  transition: all 0.3s ease;
}

.view-project-link:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
  transform: translateY(-1px);
}

.avatar-container{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
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
  color: #7ba6dd;
  border: 2px solid #7ba6dd;
  font-size: 24px;
}


@media (max-width: 768px) {
  .user-details-container {
    padding: 20px;
  }
}
</style>