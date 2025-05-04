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
        
        <h3>Added at: </h3>
        <div>{{ formattedTimestamp }}</div>
        
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
    };
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
  computed: {
    formattedTimestamp() {
      const date = new Date(this.project.timestamp);
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      return date.toLocaleDateString('en-US', options) ; 
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
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2.5rem;
  background: linear-gradient(to bottom right, #f0f4f8, #e0f7fa);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  font-family: 'Quicksand', sans-serif;
}

.project-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.project-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  flex: 1 1 60%;
}

.project-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.update-btn, .delete-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.update-btn {
  background: linear-gradient(to right, #2563eb, #0891b2);
  color: white;
}

.update-btn:hover {
  background: linear-gradient(to right, #2563eb, #0891b2);
  transform: translateY(-2px);
}

.delete-btn {
  background: linear-gradient(to right, #ef4444, #f87171);
  color: white;
}

.delete-btn:hover {
  background: linear-gradient(to right, #dc2626, #fb7185);
  transform: translateY(-2px);
}

.home-button {
  background: linear-gradient(to right, #ffffff, #ecdfdf);
  color: rgb(35, 73, 143);
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.home-button:hover {
  transform: translateY(-2px);
}

.project-content {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.project-image {
  flex: 1 1 300px;
}

.project-image img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.project-info {
  flex: 2 1 500px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.project-description h3,
.project-tech-stack h3,
.project-github h3 {
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
}

.project-description p {
  color: #334155;
  line-height: 1.7;
  padding: 1rem;
  border-radius: 10px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background: #03105b;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.github-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  background: #e0f2fe;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: inline-block;
  transition: background-color 0.2s ease;
}
</style>
