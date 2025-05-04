<template>
  <div class="project-details-container">
    <div class="project-header">
      <h1>{{ project.title }}</h1>
      <div class="project-actions">
        <button v-if="isOwner" @click="updateProject" class="update-btn">Update</button>
        <button v-if="isOwner" @click="deleteProject" class="delete-btn">Delete</button>
      </div>
      <router-link to="/Home" class="home-button">Back to Home</router-link>
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
</template>

<script>
import { db } from "../firebase-config.js";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  name: 'ProjectItem',
  data() {
    return {
      project: {},
      loading: true,
      error: null,
      isOwner: false
    }
  },
  async created() {
    try {
      const projectId = this.$route.params.id;
      const projectRef = doc(db, "projects", projectId);
      const projectSnap = await getDoc(projectRef);
      
      if (projectSnap.exists()) {
        this.project = { id: projectSnap.id, ...projectSnap.data() };
        const auth = getAuth();
        const user = auth.currentUser;
        this.isOwner = user && user.uid === this.project.owner;
      } else {
        this.error = "Project not found";
      }
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async deleteProject() {
      try {
        const projectId = this.$route.params.id;
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (user && user.uid === this.project.owner) {
          await deleteDoc(doc(db, "projects", projectId));
          this.$router.push('/my-projects');
        } else {
          this.error = "You are not authorized to delete this project";
        }
      } catch (error) {
        this.error = error.message;
      }
    },
    updateProject() {
      this.$router.push(`/update-project/${this.$route.params.id}`);
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

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.project-header h1 {
  color: #2d3748;
  font-size: 2.5rem;
}

.project-actions {
  display: flex;
  gap: 1rem;
}

.update-btn, .delete-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.update-btn {
  background-color: #228550;
  color: white;
}

.update-btn:hover {
  background-color: #33b770;
  transform: translateY(-2px);
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.delete-btn:hover {
  background-color: #d32f2f;
  transform: translateY(-2px);
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
</style>
