<template>
  <div class="container">
    <header class="header">
      <img src="R.png" alt="Logo" class="logo" />
      <button class="logout-btn">Log out</button>
    </header>
    
    <aside class="sidebar">
      <router-link to="/accounts" class="nav-link">Accounts</router-link>
    </aside>

    <aside class="sidebar">
      <router-link to="/Dashboard" class="nav-link">Dashboard</router-link>
      <router-link to="/add-project" class="nav-link">Add Project</router-link>
    </aside>

    <main class="content">
      <ProjectsDi />
    </main>

    
  </div>
</template>

  
<script>
import ProjectsDi from '@/components/ProjectsDi.vue';
import accounts from '../components/accounts.vue'; 
export default {
  name: 'HomeView',
  components: {
    ProjectsDi,
    accounts,
  }
}
</script>

<style scoped>
/* General layout */
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f5f3f0;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ae917a; /* brown */
  padding: 10px 20px;
  color: white;
}

.logo {
  height: 40px;
}

.logout-btn {
  background-color: #baefc8; /* green */
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(10, 9, 9, 0.15);
}

.logout-btn:hover {
  background-color: #769c7f;
}

/* Sidebar */
.sidebar {
  display: flex;
  gap: 20px;
  background-color: #e7d3b3;
  padding: 10px 20px;
}

.nav-link {
  color: #3b7d4d;
  text-decoration: none;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background 0.3s ease;
}

.nav-link:hover {
  background-color: #c2e4cb;
}

/* Content */
.content {
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  overflow-y: auto;
}
</style>

  