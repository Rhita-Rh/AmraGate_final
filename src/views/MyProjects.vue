<template>
    <div class="projects-container">
        <div class="project-card" v-for="project in projects" :key="project.id">
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
                </div>
                <div class="project-image" v-if="project.imageUrl">
                    <img :src="project.imageUrl" alt="Project image">
                </div>
            </div>
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
        }
    }
};
</script>

<style scoped>
.projects-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
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
</style>