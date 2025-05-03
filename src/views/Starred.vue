<template>
  <div class="project-details-container">
    <h1>Starred Projects</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-if="starredProjects.length > 0">
        <div v-for="project in starredProjects" :key="project.id" class="project-card">
          <div class="project-header">
            <h2>{{ project.title }}</h2>
            <button @click="toggleStar(project.id)" class="star-button">
              <span>★</span>
            </button>
          </div>
          
          <div class="project-content">
            <div class="project-image" v-if="project.imageUrl">
              <img :src="project.imageUrl" alt="Project image">
            </div>
            
            <div class="project-info">
              <div class="project-description">
                <h3>Description</h3>
                <p>{{ project.description }}</p>
              </div>
              
              <div class="project-tech-stack">
                <h3>Tech Stack</h3>
                <div class="tech-tags">
                  <span v-for="(tech, index) in project.techStack" :key="index" class="tech-tag">
                    {{ tech }}
                  </span>
                </div>
              </div>
              
              <div class="project-github">
                <h3>GitHub Repository</h3>
                <a :href="project.github" target="_blank" class="github-link">
                  {{ project.github }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No starred projects found.</p>
      </div>
    </div>
    <router-link to="/" class="home-button">Back to Home</router-link>
  </div>
</template>

<script>
import { db } from "../firebase-config.js";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  name: 'Starred',
  data() {
    return {
      starredProjects: [],
      loading: true,
      error: null
    }
  },
  async created() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        // Get starred projects for current user
        const starredQuery = collection(db, 'starred');
        const starredSnapshot = await getDocs(starredQuery);
        const starredProjectIds = starredSnapshot.docs
          .filter(doc => doc.data().userId === user.uid)
          .map(doc => doc.data().projectId);

        // Get project details for each starred project
        const projectsCollection = collection(db, 'projects');
        const projectsSnapshot = await getDocs(projectsCollection);
        this.starredProjects = projectsSnapshot.docs
          .filter(doc => starredProjectIds.includes(doc.id))
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
      }
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async toggleStar(projectId) {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
          throw new Error('User not authenticated');
        }

        const starredRef = collection(db, 'starred');
        const starDoc = doc(starredRef, `${user.uid}_${projectId}`);
        
        // Remove from starred projects
        await deleteDoc(starDoc);
        this.starredProjects = this.starredProjects.filter(project => project.id !== projectId);
      } catch (error) {
        this.error = error.message;
      }
    }
  }
}
</script>

<style scoped>
.project-details-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.project-card {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.star-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #ffc107;
}

.project-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.project-image img {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.project-description p {
  color: #4a5568;
  line-height: 1.6;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background-color: #e6fffa;
  padding: 0.5rem 1rem;
  border-radius: 16px;
  font-size: 0.875rem;
  color: #2d3748;
}

.github-link {
  color: #3182ce;
  text-decoration: none;
}

.github-link:hover {
  text-decoration: underline;
}

.home-button {
  display: inline-block;
  background-color: #e2e8f0;
  color: #2d3748;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  text-align: center;
}

.home-button:hover {
  background-color: #cbd5e0;
  transform: translateY(-2px);
}
</style>