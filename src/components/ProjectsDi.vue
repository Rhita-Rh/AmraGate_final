<template>
  <div>
    <ul>
      <li v-for="project in projects" :key="project.id" class="project-card">
        <!-- Project Header: Author and Profile Picture -->
        <div class="project-header">
          <div class="e">
          <div class="avatar-container">
            <!-- Display author photo if available, otherwise show the author's initials -->
            <div v-if="project.owner === user.uid">
              <router-link to="/Dashboard" style="text-decoration: none;"><img 
                v-if="project.authorPhotoURL" 
                :src="project.authorPhotoURL" 
                alt="Profile Picture"
                class="profile-avatar"
              >
              <span v-else class="default-avatar">{{ user.displayName ? user.displayName.charAt(0) : 'N' }}</span>
              </router-link>

            </div>
            
            <div v-else>
              <router-link :to="`/accounts/${project.owner}`" style="text-decoration: none;"><img 
                v-if="project.authorPhotoURL" 
                :src="project.authorPhotoURL" 
                alt="Profile Picture"
                class="profile-avatar"
              >
              <span v-else class="default-avatar">{{ project.authorName ? project.authorName.charAt(0) : 'N' }}</span>
              </router-link>
            </div>

          </div>
          <button 
            v-if="user && project.owner !== user.uid" 
            @click="toggleFollow(project.owner)" 
          class="follow-button"
              >
          {{ followedUsers.includes(project.owner) ? 'Unfollow' : 'Follow' }}
            </button>
          </div>
          <div class="author-details">
            <p class="author-name">{{ project.authorName }}</p>
          </div>
        </div>
        
        <div class="project-content">
          <div class="project-details">
            <!-- Project Title and Description -->
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
            <div style="margin-top: 15px;">
              <router-link :to="`/project/${project.id}`" class="follow-button" style="text-decoration: none;">View Project</router-link>
            </div>
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
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

export default {
  name: 'ProjectsDiv',
  data() {
    return {
      projects: [],
      starredProjects: [],
      followedUsers: [],
      user: null,
    };
  },
  methods: {
    async toggleStar(projectId) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const starDocRef = doc(db, 'starred', `${user.uid}_${projectId}`);
      const snapshot = await getDoc(starDocRef);
      if (snapshot.exists()) {
        await deleteDoc(starDocRef);
        this.starredProjects = this.starredProjects.filter(id => id !== projectId);
      } else {
        await setDoc(starDocRef, {
          projectId,
          userId: user.uid,
          timestamp: new Date(),
        });
        this.starredProjects.push(projectId);
      }
    },

    async toggleFollow(authorId) {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser || authorId === currentUser.uid) return;

      const currentUserRef = doc(db, 'users', currentUser.uid);
      const authorRef = doc(db, 'users', authorId);

      const isFollowing = this.followedUsers.includes(authorId);

      try {
        if (isFollowing) {
          await updateDoc(currentUserRef, {
            following: arrayRemove(authorId)
          });
          await updateDoc(authorRef, {
            followers: arrayRemove(currentUser.uid)
          });
          this.followedUsers = this.followedUsers.filter(id => id !== authorId);
        } else {
          await updateDoc(currentUserRef, {
            following: arrayUnion(authorId)
          });
          await updateDoc(authorRef, {
            followers: arrayUnion(currentUser.uid)
          });
          this.followedUsers.push(authorId);
        }
      } catch (error) {
        console.error("Error updating follow state:", error);
      }
    }
  },
  async created() {
    const auth = getAuth();
    this.user = auth.currentUser;

    const querySnapshot = await getDocs(collection(db, "projects"));
    this.projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    for (let project of this.projects) {
      const authorId = project.owner;
      if (authorId) {
        const userDocRef = doc(db, 'users', authorId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          project.authorPhotoURL = data.photoURL || null;
          project.authorName = data.name || 'Unknown';
        }
      }
    }

    if (this.user) {
      const userDocRef = doc(db, 'users', this.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        this.followedUsers = data.following || [];
      }

      const starredSnapshot = await getDocs(collection(db, 'starred'));
      this.starredProjects = starredSnapshot.docs
        .filter(doc => doc.data().userId === this.user.uid)
        .map(doc => doc.data().projectId);
    }
  }
};

</script>

<style scoped>
li {
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
.e{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

.avatar-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
.follow-button {
  background-color: #4ed185;
  color: white;
  border: none;
  padding: 8px 16px;
  margin-top: 10px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  height: 40px;
  transition: background-color 0.2s ease;
}

.follow-button:hover {
  background-color: #38a169;
}

.project-card {
  background-color: #105a24; /* Light green background */
  border-left: 6px solid #48bb78; /* Green accent border */
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 8px rgba(0, 128, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 128, 0, 0.15);
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-avatar {
  font-size: 32px;
  font-weight: bold;
  color: #555;
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
