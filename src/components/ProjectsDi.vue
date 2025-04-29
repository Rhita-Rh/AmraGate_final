<template>
  <div>
    <ul>
      <li v-for="project in projects" :key="project.id" class="project-card">
        <!-- Project Header: Author and Profile Picture -->
        <div class="project-header">
          <img :src="project.authorProfilePic" alt="Author's Profile Picture" class="profile-pic" />
          <div class="author-details">
            <p class="author-name">{{ project.authorName }}</p>
            <p class="post-time">{{ project.timestamp }}</p>
          </div>
        </div>
        
        <!-- Projet Title and Description -->
        <h2 class="project-title">{{ project.title }}</h2>
        <p class="project-description">{{ project.description }}</p>
        
        <!-- Project GitHub Link -->
        <a :href="project.github" class="project-github" target="_blank">GitHub</a>

        <!-- Project Image -->
        <div v-if="project.image" class="project-image">
          <img :src="project.image" alt="Project Image" />
        </div>

        <!-- Tech Stack -->
        <div class="tech-stack">
          <span v-for="tech in project.techStack" :key="tech" class="tech-item">{{ tech }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from "../firebase-config.js"; 
import { collection, getDocs } from "firebase/firestore";

export default {
  name: 'ProjectsDiv',
  data() {
    return {
      projects: [],
    };
  },

  async created() {
    const querySnapshot = await getDocs(collection(db, "projects"));
    this.projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
};
</script>

<style scoped>
.project-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  color: #333;
}

.project-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: bold;
  font-size: 14px;
  color: #333;
}

.post-time {
  font-size: 12px;
  color: #777;
}

.project-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: rgb(173, 208, 171); /* LinkedIn-style color */
}

.project-description {
  font-size: 14px;
  color: #555;
  margin-bottom: 12px;
}

.project-github {
  color: rgb(173, 208, 171);
  text-decoration: none;
  font-weight: bold;
  margin-bottom: 12px;
}

.project-image img {
  max-width: 100%;
  border-radius: 8px;
}

.tech-stack {
  margin-top: 12px;
}

.tech-item {
  background-color: rgb(173, 208, 171);
  color: white;
  border-radius: 20px;
  padding: 4px 12px;
  margin-right: 8px;
  font-size: 12px;
  margin-bottom: 8px;
  display: inline-block;
}
</style>