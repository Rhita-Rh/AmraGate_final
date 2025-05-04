<template>
  <div class="user-profile">
    <!-- Navbar -->
    <nav class="navbar">
      <img src="R.png" alt="Logo" class="logo" />
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
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
const db = getFirestore();

export default {
  name: 'HomeView',
  components: {
    ProjectsDi,
  },
  data() {
    return {
      showAbout: false,
      user:null
    };
  },
  computed: {
    userInitials() {
      if (!this.user || !this.user.displayName) return '?';
      const names = this.user.displayName.split(' ');
      return names.map(name => name[0]).join('').toUpperCase();
    }
  },
  created() {
    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const docSnap = await getDoc(doc(db, "users", authUser.uid));
        if (docSnap.exists()) {
          const userData = docSnap.data();
          this.user = { ...authUser, ...userData }; // merge both
        } else {
          this.user = authUser; // fallback
        }
      }
    });
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
  background:  #e3f0fc;
  min-height: 100vh;
  font-family: 'Quicksand', sans-serif;
  color: #4a4a4a;
  overflow-x: hidden;
}

/* Navbar */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #e0e0e0;
}

.logo {
  height: 45px;
}

/* Nav Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 15px;
}
.header-btn{
  padding: 10px 20px;
  background: linear-gradient(to right, #6796fb, #8b9df9);
  color: #ffffff;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}
.follow-btn {
  padding: 10px 18px;
  border: none;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: #ffffff;
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
  background: linear-gradient(135deg, #6b0808, #6b0808);
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(228, 138, 138, 0.2);
}

.logout-btn:hover {
  background: linear-gradient(135deg, #6b0808, #6b0808);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(228, 138, 138, 0.25);
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
  background: rgba(255, 255, 255, 0.95);
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  white-space: nowrap;
  font-size: 14px;
  color: #5a5a5a;
  z-index: 200;
  animation: fadeIn 0.3s ease-in-out;
  border: 1px solid #f0f0f0;
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
  border: 2px solid #b1c9f1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
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
  background-color: #d0d6e2;
  color: #6b7c93;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.initials-avatar:hover {
  transform: scale(1.05);
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    padding: 12px 20px;
    flex-wrap: wrap;
  }
  
  .nav-links {
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin: 10px 0;
    order: 3;
    width: 100%;
  }
  
  .follow-btn, .logout-btn {
    padding: 8px 14px;
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
    padding: 0 15px;
    margin: 25px auto;
  }
  
  .dropdown-menu {
    left: -50px;
    right: -50px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 10px 15px;
  }
  
  .follow-btn, .logout-btn {
    padding: 7px 12px;
    font-size: 0.8rem;
  }
  
  .profile-avatar, .initials-avatar {
    width: 35px;
    height: 35px;
  }
}
</style>