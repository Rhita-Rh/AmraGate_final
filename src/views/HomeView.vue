<template>
  <div class="user-profile">
    <!-- Navbar -->
    <nav class="navbar">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <div class="nav-links">
        <router-link to="/Dashboard" style="text-decoration: none;">
          <div v-if="user && user.photoURL" class="profile-avatar-wrapper">
            <img 
              :src="user.photoURL" 
              alt="Profile Picture"
              class="profile-avatar"
            />
          </div>
          <div v-else-if="user" class="initials-avatar">
            {{ userInitials }}
          </div>
          
        </router-link>
        <router-link to="/accounts" class="header-btn">Accounts</router-link>
        <router-link to="/dashboard" class="header-btn">Dashboard</router-link>
        <router-link to="/add-project" class="header-btn">Add Project</router-link>
        <router-link to="/feedback" class="header-btn">Feedback</router-link>

        <div class="dropdown" @click="toggleAbout" style="border: none;">
          <button class="header-btn">About Us</button>
          <div v-if="showAbout" class="dropdown-menu">
            <p>Email: AMRA_GATE@gmail.com</p>
            <p>Phone: +123 456 7890</p>
          </div>
        </div>

        
      </div>
      <button class="logout-btn" @click="handleLogout">Log out</button>

    </nav>

    <!-- Search and Filters -->
    <div class="search-container">
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search projects..." 
          class="search-input"
        />
        <select v-model="selectedTech" class="tech-filter">
          <option value="">All Technologies</option>
          <option v-for="tech in availableTechs" :key="tech" :value="tech">
            {{ tech }}
          </option>
        </select>
        <button class="search-button" @click="applyFilters">
          <span class="search-icon">🔍</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Activity Feed -->
      <div class="feed-section">
        <ActivityFeed />
      </div>

      <!-- Project List -->
      <div class="project-section">
        <ProjectsDi 
          :search-query="searchQuery"
          :selected-tech="selectedTech"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import ProjectsDi from '@/components/ProjectsDi.vue';
import ActivityFeed from '@/components/ActivityFeed.vue';
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";
const db = getFirestore();

export default {
  name: 'HomeView',
  components: {
    ProjectsDi,
    ActivityFeed
  },
  data() {
    return {
      showAbout: false,
      user: null,
      searchQuery: '',
      selectedTech: '',
      availableTechs: []
    };
  },
  computed: {
    userInitials() {
      if (!this.user || !this.user.displayName) return '?';
      const names = this.user.displayName.split(' ');
      return names.map(name => name[0]).join('').toUpperCase();
    }
  },
  async created() {
    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const docSnap = await getDoc(doc(db, "users", authUser.uid));
        if (docSnap.exists()) {
          const userData = docSnap.data();
          this.user = { ...authUser, ...userData };
        } else {
          this.user = authUser;
        }
      }
    });

    // Fetch all unique technologies from projects
    const projectsSnapshot = await getDocs(collection(db, "projects"));
    const techs = new Set();
    projectsSnapshot.forEach(doc => {
      const project = doc.data();
      if (project.techStack) {
        project.techStack.forEach(tech => techs.add(tech));
      }
    });
    this.availableTechs = Array.from(techs).sort();
  },
  methods: {
    toggleAbout() {
      this.showAbout = !this.showAbout;
    },
    async handleLogout() {
      try {
        await signOut(auth);
        console.log("User signed out.");
        this.$router.push('/'); 
      } catch (error) {
        console.error("Error signing out:", error);
      }
    },
    applyFilters() {
      // The filtering is handled by the ProjectsDi component
    }
  },
};
</script>

<style scoped>

/* Background Styling */
.home-view {
  min-height: 100vh;
  font-family: 'Quicksand', sans-serif;
  background: radial-gradient(circle at top left, #f3f8fd, #f8f0f8);
  animation: floatBg 10s infinite alternate;
  color: #4a4a4a;
  padding: 2rem;
}

@keyframes floatBg {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(148, 182, 229, 0.15);
  margin-bottom: 2rem;
}

.logo {
  height: 45px;
}

/* Nav Links */
.nav-links {
  display: flex;
  gap: 1rem;
}

/* Buttons */
.header-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: white;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.header-btn:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
  transform: translateY(-2px);
}

.follow-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: white;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(148, 182, 229, 0.2);
  text-decoration: none;
}

.follow-btn:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(148, 182, 229, 0.25);
}

/* Logout Button */
.logout-btn {
  background: linear-gradient(135deg, #e48a8a, #f2b6b6);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(228, 138, 138, 0.2);
}

.logout-btn:hover {
  background: linear-gradient(135deg, #db7979, #e9a0a0);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(228, 138, 138, 0.25);
}

/* Project List */
.project-list {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Dropdown */
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 3rem;
  left: 0;
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(148, 182, 229, 0.15);
  white-space: nowrap;
  font-size: 0.9rem;
  color: #4d5a6a;
  z-index: 200;
  animation: fadeIn 0.3s ease-in-out;
  border: 1px solid #e0e0e0;
}

/* Animations */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #7ba6dd;
  box-shadow: 0 2px 6px rgba(148, 182, 229, 0.15);
  transition: transform 0.3s ease;
}

.profile-avatar:hover {
  transform: scale(1.05);
}

.profile-avatar-wrapper {
  position: relative;
}

.initials-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f9fafd;
  color: #7ba6dd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 2px 6px rgba(148, 182, 229, 0.15);
  transition: transform 0.3s ease;
  border: 2px solid #7ba6dd;
}

.initials-avatar:hover {
  transform: scale(1.05);
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
    flex-wrap: wrap;
  }
  
  .nav-links {
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    margin: 0.5rem 0;
    order: 3;
    width: 100%;
  }
  
  .follow-btn, .logout-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  .logo {
    height: 35px;
    order: 1;
  }
  
  .logout-btn {
    order: 2;
  }

  .project-list {
    padding: 0 1rem;
    margin: 1.5rem auto;
  }
  
  .dropdown-menu {
    left: -50px;
    right: -50px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 0.75rem;
  }
  
  .follow-btn, .logout-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .profile-avatar, .initials-avatar {
    width: 35px;
    height: 35px;
  }
}

/* Search Container */
.search-container {
  max-width: 1000px;
  margin: 0 auto 2rem;
  padding: 0 2rem;
}

.search-bar {
  display: flex;
  gap: 1rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(148, 182, 229, 0.15);
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #d0d6e2;
  border-radius: 8px;
  font-size: 0.95rem;
  background: #f9fafd;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #7ba6dd;
  box-shadow: 0 0 0 2px rgba(123, 166, 221, 0.2);
}

.tech-filter {
  padding: 0.75rem 1rem;
  border: 1px solid #d0d6e2;
  border-radius: 8px;
  font-size: 0.95rem;
  background: #f9fafd;
  color: #4a4a4a;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tech-filter:focus {
  outline: none;
  border-color: #7ba6dd;
  box-shadow: 0 0 0 2px rgba(123, 166, 221, 0.2);
}

.search-button {
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
  transform: translateY(-2px);
}

.search-icon {
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .search-container {
    padding: 0 1rem;
  }
  
  .search-bar {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .search-input,
  .tech-filter,
  .search-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .search-container {
    margin-bottom: 1.5rem;
  }
}

.main-content {
  display: flex;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.feed-section {
  flex: 1;
  max-width: 400px;
}

.project-section {
  flex: 2;
}

@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }
  
  .feed-section {
    max-width: 100%;
  }
}
</style>