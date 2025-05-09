<template>
  <div>
    <ul>
      <li v-for="project in filteredProjects" :key="project.id" class="project-card">
        <!-- Project Header: Author and Profile Picture -->
        <div class="project-header">
          <div class="author-details">
            <div class="avatar-container">
              <!-- Display author photo if available, otherwise show the author's initials -->
              <div v-if="project.owner === user.uid">
                <router-link to="/Dashboard" style="text-decoration: none;">
                  <img 
                    v-if="project.authorPhotoURL" 
                    :src="project.authorPhotoURL" 
                    alt="Profile Picture"
                    class="profile-avatar"
                  />
                  <span v-else class="default-avatar">{{ user.displayName ? user.displayName.charAt(0) : 'N' }}</span>
                </router-link>
              </div>
              
              <div v-else>
                <router-link :to="`/accounts/${project.owner}`" style="text-decoration: none;">
                  <img 
                    v-if="project.authorPhotoURL" 
                    :src="project.authorPhotoURL" 
                    alt="Profile Picture"
                    class="profile-avatar"
                  />
                  <span v-else class="default-avatar">{{ project.authorName ? project.authorName.trim().charAt(0) : 'N' }}</span>
                </router-link>
              </div>
            </div>
            <p class="author-name">{{ project.authorName }}</p>
          </div>
          <button 
            v-if="user && project.owner !== user.uid" 
            @click="toggleFollow(project.owner)" 
            :class="followedUsers.includes(project.owner) ? 'unfollow-button' : 'follow-button'"
          >
            {{ followedUsers.includes(project.owner) ? 'Unfollow' : 'Follow' }}
          </button>
        </div>
        
        <div class="project-content">
          <div class="project-details">
            <!-- Project Title and Description -->
            <h2 class="project-title">{{ project.title }}</h2>
            <p class="project-description">{{ project.description }}</p>
            <p class="project-timestamp">Added: {{ formatTimestamp(project.timestamp) }}</p>

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
  props: {
    searchQuery: String,
    selectedTech: String
  },
  name: 'ProjectsDiv',
  data() {
    return {
      projects: [],
      starredProjects: [],
      followedUsers: [],
      user: null,
      allProjects: [], // full list of projects
      filteredProjects: [] // filtered list
    };
  },
  watch: {
    searchQuery: 'filterProjects',
    selectedTech: 'filterProjects'
  },
  computed: {
    filteredProjects() {
      const search = this.searchQuery?.toLowerCase() || '';
      const selected = this.selectedTech || '';
          return this.projects.filter(project => {
        const title = project.title?.toLowerCase() || '';
        const matchesSearch = search === '' || title.includes(search);

        const matchesTech = selected === '' || 
          (project.techStack && project.techStack.map(t => t.toLowerCase()).includes(selected.toLowerCase()));

        return matchesSearch && matchesTech;
      });
    }
  },
  methods: {
    formatTimestamp(timestamp) {
  if (!timestamp) return 'Unknown';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
},

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
.e {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e9e9e9;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(211, 208, 208, 0.3);
  border: 2px solid #7ba6dd;
}

.follow-button {
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  height: 40px;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: 100px;
  text-align: center;
}

.follow-button:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
  transform: translateY(-2px);
}

.unfollow-button {
  background: linear-gradient(135deg, #e48a8a, #f2b6b6);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  height: 40px;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: 100px;
  text-align: center;
}

.unfollow-button:hover {
  background: linear-gradient(135deg, #db7979, #e9a0a0);
  transform: translateY(-2px);
}

.project-card {
  background-color: #ffffff;
  border-left: 4px solid #48bb78;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(244, 244, 244, 0.2);
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-avatar {
  font-size: 24px;
  font-weight: bold;
  color: #7ba6dd;
}

.project-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 1rem;
}

.author-details {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-name {
  color: #4a4a4a;
  font-weight: 600;
  margin: 0;
  font-size: 1rem;
}

.project-content {
  display: flex;
  gap: 24px;
}

.project-details {
  flex: 1;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #080909;
  margin-bottom: 12px;
}

.project-description {
  font-size: 0.9rem;
  color: #424343;
  line-height: 1.6;
  margin-bottom: 16px;
}

.project-github {
  display: inline-block;
  color: #178e82;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 16px;
  transition: color 0.2s ease;
}

.project-github:hover {
  color: #268c87;
  text-decoration: underline;
}

.project-image {
  width: 30%;
  max-width: 300px;
  margin-left: auto;
}

.project-image img {
  width: 100%;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.tech-item {
  background-color: #07255a;
  color: #81e6d9;
  border-radius: 12px;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 500;
}

.star-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #ecc94b;
  padding: 0;
  margin-left: 10px;
  transition: all 0.2s ease;
}

.star-button:hover {
  transform: scale(1.2);
  color: #f6e05e;
}

@media (max-width: 768px) {
  .project-content {
    flex-direction: column;
  }
  
  .project-image {
    width: 100%;
    max-width: none;
    margin-left: 0;
    margin-top: 20px;
  }
  
  .project-header {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .author-details {
    flex: 1;
    min-width: 0;
  }
  
  .follow-button {
    margin-left: auto;
    width: auto;
  }
}
</style>