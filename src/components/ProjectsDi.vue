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
        
        <div class="project-content">
          <div class="project-details">
            <!-- Projet Title and Description -->
            <h2 class="project-title">{{ project.title }}</h2>
            <p class="project-description">{{ project.description }}</p>
            
            <!-- Project GitHub Link -->
            <a :href="project.github" class="project-github" target="_blank">GitHub</a>

            <!-- Tech Stack -->
            <div class="tech-stack">
              <span v-for="tech in project.techStack" :key="tech" class="tech-item">{{ tech }}</span>
            </div>
          <!-- Star Button -->
          <button @click="toggleStar(project.id)" class="star-button">
            <span v-if="starredProjects.includes(project.id)">★</span>
            <span v-else>☆</span>
          </button>
          </div>

          <!-- Project Image -->
          <div v-if="project.imageUrl" class="project-image">
            <img :src="project.imageUrl" alt="Project Image" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from "../firebase-config.js";
import { getAuth } from 'firebase/auth';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

export default {
  name: 'ProjectsDiv',
  data() {
    return {
      projects: [],
      starredProjects: []
    };
  },
  methods: {
    async toggleStar(projectId) {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        console.error('No user is currently signed in');
        return;
      }

      const userId = user.uid;
      const starredRef = collection(db, 'starred');
      const starDoc = doc(starredRef, `${userId}_${projectId}`); // Unique document ID combining user and project
      
      try {
        const starSnapshot = await getDoc(starDoc);
        if (starSnapshot.exists()) {
          await deleteDoc(starDoc);
          this.starredProjects = this.starredProjects.filter(id => id !== projectId);
        } else {
          await setDoc(starDoc, {
            projectId: projectId,
            timestamp: new Date(),
            userId: userId
          });
          this.starredProjects.push(projectId);
        }
      } catch (error) {
        console.error('Error toggling star:', error);
      }
    }
  },
  async created() {
    // Fetch projects
    const querySnapshot = await getDocs(collection(db, "projects"));
    this.projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch starred projects for current user
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      const userId = user.uid;
      const starredQuery = collection(db, 'starred');
      const starredSnapshot = await getDocs(starredQuery);
      this.starredProjects = starredSnapshot.docs
        .filter(doc => doc.data().userId === userId)
        .map(doc => doc.data().projectId);
    }
  }
};
</script>

<style scoped>
li{
  list-style-type: none;
}

.projects-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.add-project {
    margin: 0;
}

.add-project-button {
    background-color: #48bb78;
    color: white;
    padding: 10px 20px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.2s ease;
}

.add-project-button:hover {
    background-color: #38a169;
}

.home-button {
    background-color: #e2e8f0;
    color: #2d3748;
    padding: 10px 20px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.2s ease;
}

.home-button:hover {
    background-color: #cbd5e0;
}

.project-card {
    background-color: #f8fafc;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.project-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.project-header {
    margin-bottom: 16px;
}

.project-title {
    font-size: 20px;
    font-weight: 600;
    color: #2d3748;
}

.project-content {
    display: flex;
    gap: 24px;
}

.project-details {
    flex: 1;
}

.project-description {
    font-size: 15px;
    color: #4a5568;
    line-height: 1.6;
    margin-bottom: 16px;
}

.project-github {
    display: inline-block;
    color: #48bb78;
    text-decoration: none;
    font-weight: 500;
    margin-bottom: 16px;
    transition: color 0.2s ease;
}

.project-github:hover {
    color: #38a169;
}

.project-image {
    width: 30%;
    max-width: 300px;
    margin-left: auto;
}

.project-image img {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
}

.tech-item {
    background-color: #c6f6d5;
    color: #22543d;
    border-radius: 20px;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: 500;
}

.star-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #ffd700;
  padding: 0;
  margin-left: 10px;
  transition: transform 0.2s ease;
}

.star-button:hover {
  transform: scale(1.2);
}

.star-button span {
  display: inline-block;
  transition: transform 0.2s ease;
}

.star-button:hover span {
  transform: scale(1.2);
}
</style>