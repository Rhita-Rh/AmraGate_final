<template>
  <div class="activity-feed">
    <h2 class="feed-title">Recent Activity</h2>
    
    <div v-if="loading" class="loading">
      Loading activities...
    </div>
    
    <div v-else-if="activities.length === 0" class="no-activities">
      No recent activities to show.
    </div>
    
    <div v-else class="activities-list">
      <div v-for="activity in activities" :key="activity.id" class="activity-card">
        <div class="activity-header">
          <div class="user-info">
            <router-link :to="`/accounts/${activity.userId}`" class="user-link">
              <div class="avatar-container">
                <img
                  v-if="activity.userPhotoURL"
                  :src="activity.userPhotoURL"
                  alt="Profile Photo"
                  class="profile-photo"
                />
                <span v-else class="default-avatar">{{ activity.userName ? activity.userName.charAt(0).toUpperCase() : 'N' }}</span>
              </div>
              <span class="user-name">{{ activity.userName }}</span>
            </router-link>
          </div>
          <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
        </div>
        
        <div class="activity-content">
          <div v-if="activity.type === 'project'" class="project-activity">
            <h3>Added a new project</h3>
            <p class="project-title">{{ activity.title }}</p>
            <p class="project-description">{{ activity.description }}</p>
            <div class="tech-stack">
              <span v-for="tech in activity.techStack" :key="tech" class="tech-tag">
                {{ tech }}
              </span>
            </div>
            <router-link :to="`/project/${activity.id}`" class="view-link">View Project</router-link>
          </div>
          
          <div v-else-if="activity.type === 'competence'" class="competence-activity">
            <h3>Added a new skill</h3>
            <p class="skill-name">{{ activity.name }}</p>
            <p class="skill-level">Level: {{ activity.level }}</p>
          </div>
          
          <div v-else-if="activity.type === 'goal'" class="goal-activity">
            <h3>Added a new goal</h3>
            <p class="goal-title">{{ activity.obj }}</p>
            <p class="goal-status">Status: {{ activity.status }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase-config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export default {
  name: 'ActivityFeed',
  data() {
    return {
      activities: [],
      loading: true
    };
  },
  async created() {
    await this.fetchActivities();
  },
  methods: {
    async fetchActivities() {
      try {
        // Fetch recent projects
        const projectsQuery = query(
          collection(db, 'projects'),
          orderBy('addedAt', 'desc'),
          limit(10)
        );
        const projectsSnapshot = await getDocs(projectsQuery);
        
        // Fetch recent competences
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const allCompetences = [];
        const allGoals = [];
        
        usersSnapshot.forEach(userDoc => {
          const userData = userDoc.data();
          if (userData.competences) {
            userData.competences.forEach(comp => {
              allCompetences.push({
                ...comp,
                userId: userDoc.id,
                userName: userData.name,
                userPhotoURL: userData.photoURL,
                type: 'competence',
                timestamp: new Date(comp.date_progr)
              });
            });
          }
          if (userData.goals) {
            userData.goals.forEach(goal => {
              allGoals.push({
                ...goal,
                userId: userDoc.id,
                userName: userData.name,
                userPhotoURL: userData.photoURL,
                type: 'goal',
                timestamp: new Date()
              });
            });
          }
        });

        // Combine and sort all activities
        const projectActivities = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'project',
          timestamp: doc.data().addedAt
        }));

        this.activities = [
          ...projectActivities,
          ...allCompetences,
          ...allGoals
        ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 20);

      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        this.loading = false;
      }
    },
    formatTime(timestamp) {
      const now = new Date();
      const date = new Date(timestamp);
      const diff = now - date;
      
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      if (days > 0) return `${days}d ago`;
      if (hours > 0) return `${hours}h ago`;
      if (minutes > 0) return `${minutes}m ago`;
      return 'just now';
    }
  }
};
</script>

<style scoped>
.activity-feed {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.feed-title {
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.activity-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.activity-card:hover {
  transform: translateY(-2px);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
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
.default-avatar {
  font-size: 24px;
  font-weight: bold;
  color: #7ba6dd;
}

.initials-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #4a5568;
}

.user-name {
  font-weight: 600;
  color: #2d3748;
}

.activity-time {
  color: #718096;
  font-size: 0.875rem;
}

.activity-content {
  margin-top: 1rem;
}

.activity-content h3 {
  color: #4a5568;
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

.project-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.project-description {
  color: #4a5568;
  margin-bottom: 1rem;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tech-tag {
  background: #e2e8f0;
  color: #2d3748;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
}

.view-link {
  color: #4299e1;
  text-decoration: none;
  font-weight: 500;
}

.view-link:hover {
  text-decoration: underline;
}

.skill-name {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.skill-level {
  color: #4a5568;
}

.goal-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.goal-status {
  color: #4a5568;
}
.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;   /* Adjust size as needed */
  height: 50px;
  border-radius: 50%;
  background-color: #ccc; /* Default background for initials */
  overflow: hidden;
}

.profile-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.default-avatar {
  font-size: 24px;
  font-weight: bold;
  color: white;
}
.loading, .no-activities {
  text-align: center;
  color: #718096;
  padding: 2rem;
}

.user-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: inherit;
}

.user-link:hover {
  opacity: 0.8;
}
</style> 