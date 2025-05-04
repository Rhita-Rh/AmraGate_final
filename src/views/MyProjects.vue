<template>
    <div class="projects-container">
        <div class="header-actions">
            <div class="add-project">
                <router-link to="/add-project" class="add-project-button">
                    + Add New Project
                </router-link>
            </div>
            <router-link to="/Dashboard" class="home-button">
                Back to Dashboard
            </router-link>
        </div>
        
        <!-- Search and Filter Section -->
        <div class="search-filter-container">
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Search projects..."
                class="search-bar"
            />
            <select v-model="selectedTech" class="tech-filter">
                <option value="">All Technologies</option>
                <option v-for="tech in allTechStack" :key="tech" :value="tech">{{ tech }}</option>
            </select>
        </div>

        <div v-if="filteredProjects.length > 0">
            <div class="project-card" v-for="project in filteredProjects" :key="project.id">
                <div class="project-header">
                    <div class="project-title">{{ project.title }}</div>
                </div>
                <div class="project-content">
                    <div class="project-details">
                        <div class="project-description">{{ project.description }}</div>
                        <a :href="project.github" class="project-github" target="_blank">
                            View on GitHub
                        </a>
                        <div class="tech-stack">
                            <span class="tech-item" v-for="element in project.techStack" :key="element">
                                {{ element }}
                            </span>
                        </div>
                        <router-link 
                            :to="`/project/${project.id}`" 
                            class="view-details-button"
                        >
                            View Details
                        </router-link>
                    </div>
                    <div class="project-image" v-if="project.imageUrl">
                        <img :src="project.imageUrl" alt="Project image">
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="no-projects">
            <p>No projects found matching your search.</p>
        </div>
    </div>
</template>

<script>
import { db } from "../firebase-config.js"; 
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
    name: 'ProjectsDi',
    data() {
        return {
            projects: [],
            searchQuery: '',
            selectedTech: '',
            allTechStack: []
        }
    },
    computed: {
        filteredProjects() {
            let filtered = this.projects;

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(project => 
                    project.title.toLowerCase().includes(query) ||
                    project.description.toLowerCase().includes(query) ||
                    project.techStack.some(tech => tech.toLowerCase().includes(query))
                );
            }

            if (this.selectedTech) {
                filtered = filtered.filter(project => 
                    project.techStack.includes(this.selectedTech)
                );
            }

            return filtered;
        }
    },
    async created() {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (user) {
            const q = query(collection(db, "projects"), where("owner", "==", user.uid));
            const querySnapshot = await getDocs(q);
            this.projects = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Get all unique tech stack values
            const allTech = new Set();
            this.projects.forEach(project => {
                project.techStack.forEach(tech => allTech.add(tech));
            });
            this.allTechStack = Array.from(allTech).sort();
        }
    }
};
</script>
<style scoped>
.projects-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(148, 182, 229, 0.15);
  font-family: 'Quicksand', sans-serif;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.search-filter-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-bar {
  width: 90%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.tech-filter {
  width: 200px;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
}

.search-bar:focus,
.tech-filter:focus {
  outline: none;
  border-color: #94a3b8;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
}

.add-project-button,
.home-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.add-project-button {
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: #fff;
}

.add-project-button:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
  transform: translateY(-2px);
}

.home-button {
  background: linear-gradient(135deg, #e48a8a, #f2b6b6);
  color: #fff;
}

.home-button:hover {
  background: linear-gradient(135deg, #db7979, #e9a0a0);
  transform: translateY(-2px);
}

.project-card {
  background: #f9fafd;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 6px 18px rgba(148, 182, 229, 0.08);
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(148, 182, 229, 0.12);
}

.project-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
}

.project-content {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.project-details {
  flex: 1;
  min-width: 240px;
}

.project-description {
  font-size: 1rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.project-github {
  display: inline-block;
  color: #4caf50;
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 1rem;
  transition: color 0.2s ease;
}

.project-github:hover {
  color: #388e3c;
}

.view-details-button {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #228550, #33b770);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.view-details-button:hover {
  background: linear-gradient(135deg, #1f7a4b, #2fa964);
}

.project-image {
  width: 280px;
  max-width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(148, 182, 229, 0.1);
}

.project-image img {
  width: 100%;
  border-radius: 12px;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 1rem;
}

.tech-item {
  background: #d4f5e2;
  color: #1c4532;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.no-projects {
  text-align: center;
  padding: 3rem;
  background: #f9fafd;
  border-radius: 16px;
  color: #718096;
  font-size: 1.1rem;
  margin-top: 2rem;
}
</style>
