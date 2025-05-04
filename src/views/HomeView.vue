<template>
  <div class="user-profile">
    <!-- Navbar -->
    <nav class="navbar">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <div class="nav-links">
        <router-link to="/accounts" class="follow-btn">Accounts</router-link>
        <router-link to="/dashboard" class="follow-btn">Dashboard</router-link>
        <router-link to="/add-project" class="follow-btn">Add Project</router-link>
        <router-link to="/feedback" class="follow-btn">Feedback</router-link>

        <div class="dropdown" @click="toggleAbout">
          <button class="follow-btn">About Us</button>
          <div v-if="showAbout" class="dropdown-menu">
            <p>Email: AMRA_GATE@gmail.com</p>
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
        this.$router.push('/'); 
      } catch (error) {
        console.error("Error signing out:", error);
      }
    },
  },
};
</script>

<style scoped>
.user-profile {
  background: radial-gradient(circle at top left, #d0f8ce, #fce4ec);
  min-height: 100vh;
  font-family: 'Quicksand', sans-serif;
  color: #2d2d2d;
  overflow-x: hidden;
}

/* Navbar */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
  background-color: #ffffffcc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(6px);
  border-bottom: 1px solid #d0e8c9;
}

.logo {
  height: 45px;
}

/* Nav Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 15px;
  position: sticky;
  top: 0;
  z-index: 200;
}


.follow-btn {
  padding: 10px 18px;
  border: none;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #66bb6a, #a5d6a7);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(102, 187, 106, 0.25);
  text-decoration: none;
}

.follow-btn:hover {
  background: #388e3c;
  transform: translateY(-2px);
}

/* Logout Button */
.logout-btn {
  background: linear-gradient(135deg, #ef5350, #ef9a9a);
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(239, 83, 80, 0.2);
}

.logout-btn:hover {
  background: #6b0808;
  transform: translateY(-2px);
}

/* Project List */
.project-list {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* Dropdown */
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 48px;
  left: 0;
  background: #ffffff;
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  font-size: 14px;
  color: #333;
  z-index: 200;
  animation: fadeIn 0.3s ease-in-out;
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

/* Responsive */
@media (max-width: 768px) {
  .nav-links {
    flex-wrap: wrap;
    gap: 10px;
  }

  .logo {
    height: 38px;
  }

  .project-list {
    padding: 0 10px;
  }
}
</style>