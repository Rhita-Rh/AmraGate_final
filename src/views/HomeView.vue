<template>
  <div class="user-profile">
    <!-- Navbar -->
    <nav class="navbar">
      <img src="R.png" alt="Logo" class="logo" />
      <div class="nav-links">
        <router-link to="/accounts" class="nav-btn">Accounts</router-link>
        <router-link to="/dashboard" class="nav-btn">Dashboard</router-link>
        <router-link to="/add-project" class="nav-btn">Add Project</router-link>
        <router-link to="/AjouterComp" class="nav-btn">Add Competence</router-link>
        <router-link to="/feedback" class="nav-btn bb">Feedback</router-link>

        <div class="dropdown" @click="toggleAbout">
          <button class="nav-btn bb b">About Us</button>
          <div v-if="showAbout" class="dropdown-menu">
            <p>Email: AMRA_GATE@gmial.com</p>
            <p>Phone: +123 456 7890</p>
          </div>
        </div>

        
      </div>
      <button class="logout-btn" @click="handleLogout">Log out</button>

    </nav>

    <!-- Project List -->
    <main class="project-list">
      <ProjectsDi />
    </main>
  </div>
</template>

<script>
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import ProjectsDi from '@/components/ProjectsDi.vue';

export default {
  name: 'HomeView',
  components: {
    ProjectsDi,
  },
  data() {
    return {
      showAbout: false,
    };
  },
  methods: {
    toggleAbout() {
      this.showAbout = !this.showAbout;
    },
    async handleLogout() {
      try {
        await signOut(auth);
        console.log("User signed out.");
        this.$router.push('/signup'); 
      } catch (error) {
        console.error("Error signing out:", error);
      }
    },
  },
};
</script>

<style scoped>
.user-profile {
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
  color: #333;
}
.bb{
  font-weight: bold;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}
.b{
  padding: 20px;
}

.logo {
  height: 40px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-btn {
  background-color: #4caf50;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
}

.nav-btn:hover {
  background-color: #388e3c;
}

.logout-btn {
  background-color: #f44336;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

.project-list {
  max-width: 800px;
  margin: 30px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 48px;
  left: 0;
  background-color: #fff;
  padding: 12px 18px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border-radius: 8px;
  white-space: nowrap;
  font-size: 14px;
  z-index: 200;
}
</style>
