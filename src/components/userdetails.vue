<template>
    <div v-if="user" class="user-details-container">
      <h2>{{ user.name }}</h2>
      <div v-if="user">
        <img :src="user.profilePhoto || '/profile.png'" alt="Profile Photo" class="profile-photo" />
        <p>@{{ user.username }}</p>
        <h3>Projects</h3>
        <div v-if="projects.length > 0">
          <div v-for="project in projects" :key="project.id" class="project-card">
            <h4>{{ project.title }}</h4>
            <p>{{ project.description }}</p>
          </div>
        </div>
        <p v-else>No projects found.</p>
      </div>
      <p v-else>Loading...</p>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
  
  export default {
    name: 'UserDetails',
    setup() {
      const route = useRoute();
      const db = getFirestore();
      const user = ref(null);
      const projects = ref([]);
  
      const fetchUserDetails = async () => {
        const userDoc = await getDoc(doc(db, 'users', route.params.id));
        if (userDoc.exists()) {
          user.value = userDoc.data();
          fetchUserProjects(route.params.id);

        }
      };
  
      const fetchUserProjects = async (userId) => {
        const q = query(collection(db, 'projects'), where('owner', '==', userId));
        const querySnapshot = await getDocs(q);
        projects.value = querySnapshot.docs.map(doc => doc.data());
      };
  
      onMounted(() => {
        fetchUserDetails();
      });
  
      return {
        user,
        projects,
      };
    },
  };
  </script>
<style scoped>
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
</style>