<template>
  <div class="competences-view">
    <div class="competences-container">
      <div class="header-section">
        <h1>My Competences</h1>
        <div class="action-buttons">
          <router-link to="/AjouterComp">
            <button class="add-btn">Add Competence</button>
          </router-link>
          <router-link to="/Dashboard">
            <button class="back-btn">Back to Dashboard</button>
          </router-link>
        </div>
      </div>
     
      <div v-if="loading" class="loading">Loading...</div>
     
      <div v-else>
        <div v-if="competences.length === 0" class="empty-state">
          You haven't added any competences yet.
        </div>
       
        <div v-else class="competences-list">
          <div v-for="(competence, index) in competences" :key="index" class="competence-card">
            <div class="card-content">
              <div class="competence-header">
                <h3>{{ competence.name }}</h3>
                <span class="level-badge" :class="competence.level.toLowerCase()">
                  {{ competence.level }}
                </span>
              </div>
             
              <div class="competence-details">
                <div class="detail-item">
                  <span class="detail-label">Acquired:</span>
                  <span>{{ formatDate(competence.date_acqui) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Started Tracking:</span>
                  <span>
                    {{ competence.start_date ? formatDate(competence.start_date) + ' (' + calculateElapsedTime(competence.start_date) + ')' : 'N/A' }}
                  </span>
                </div>
              </div>
            </div>
            <div class="buttons">
              <router-link
                :to="{ name: 'Edit_comp', params: {
                  userId: currentUserId,
                  index: index
                }}"
                class="edit-btn"
              >
                Edit
              </router-link>

              <button
                class="delete-btn"
                @click="deletecomp(index)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db, auth } from '../firebase-config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

export default {
  name: 'CompetencesView',
  data() {
    return {
      competences: [],
      loading: true,
      currentUserId: '',
      elapsedTimes: {}
    }
  },
  async created() {
    await this.fetchCompetences()
  },
  methods: {
    async fetchCompetences() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        this.currentUserId = user.uid;
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          this.competences = docSnap.data().competences || [];
          this.updateElapsedTimes();
        }
      } catch (error) {
        console.error('Error fetching competences:', error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(dateString).toLocaleDateString(undefined, options)
    },
    async deletecomp(index) {
      if (confirm("Do you want to delete this competence?")) {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const updatedCompetences = [...this.competences];
          updatedCompetences.splice(index, 1);
         
          try {
            await updateDoc(docRef, { competences: updatedCompetences });
            this.competences = updatedCompetences;
            alert("Competence deleted!");
          } catch (error) {
            console.error("Failed to delete competence:", error);
            alert("Error deleting competence.");
          }
        }
      }
    },
    updateElapsedTimes() {
      this.competences.forEach(competence => {
        this.$set(this.elapsedTimes, competence.id, this.calculateElapsedTime(competence.start_date));
      });
    },
    calculateElapsedTime(dateString) {
      if (!dateString) return 'N/A';

      const now = new Date();
      const start = new Date(dateString);

      if (isNaN(start.getTime())) return 'Invalid date';

      const diffMs = now - start;
      const seconds = Math.floor(diffMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(seconds / 3600);
      const days = Math.floor(seconds / (3600 * 24));

      if (minutes < 1) {
        return 'Just now';
      }

      if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
      }

      if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      }

      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
  },
  mounted() {
    this.updateElapsedTimes();
    this.timer = setInterval(() => {
      this.updateElapsedTimes();
    }, 60000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
}
</script>

<style scoped>
.competences-view {
  min-height: 100vh;
  padding: 30px;
  font-family: 'Quicksand', sans-serif;
  background: radial-gradient(circle at top left, #f3f8fd, #f8f0f8);
  animation: floatBg 10s infinite alternate;
}

@keyframes floatBg {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.competences-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(148, 182, 229, 0.15);
  border: 1px solid #e0e8f5;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 20px;
}

.header-section h1 {
  color: #4d5a6a;
  margin: 0;
  font-size: 2rem;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

button {
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.add-btn {
  background: linear-gradient(135deg, #7ba6dd, #a5c1eb);
  color: white;
}

.add-btn:hover {
  background: linear-gradient(135deg, #6a96d2, #95b4e0);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(123, 166, 221, 0.3);
}

.back-btn {
  background: linear-gradient(135deg, #e48a8a, #f2b6b6);
  color: white;
}

.back-btn:hover {
  background: linear-gradient(135deg, #db7979, #e9a0a0);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(228, 138, 138, 0.3);
}

.loading, .empty-state {
  text-align: center;
  padding: 40px;
  color: #6b7c93;
  font-size: 1.1rem;
}

.competences-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.competence-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(148, 182, 229, 0.1);
  border: 1px solid #e0e8f5;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 220px;
}

.card-content {
  flex: 1;
}

.competence-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(148, 182, 229, 0.2);
}

.competence-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.competence-header h3 {
  color: #4d5a6a;
  margin: 0;
  font-size: 1.2rem;
}

.level-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.level-badge.beginner {
  background-color: #e3f2fd;
  color: #1976d2;
}

.level-badge.intermediate {
  background-color: #fff8e1;
  color: #ff8f00;
}

.level-badge.advanced {
  background-color: #e8f5e9;
  color: #388e3c;
}

.detail-item {
  margin-bottom: 10px;
  display: flex;
}

.detail-label {
  font-weight: 600;
  margin-right: 10px;
  min-width: 120px;
  color: #6b7c93;
  font-size: 0.9rem;
}

.detail-item span:last-child {
  color: #4d5a6a;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: auto;
  padding-top: 15px;
}

.edit-btn, .delete-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: center;
}

.edit-btn {
  background: linear-gradient(135deg, #7ba6dd, #a5c1eb);
  color: white;
  box-shadow: 0 2px 6px rgba(123, 166, 221, 0.2);
}

.edit-btn:hover {
  background: linear-gradient(135deg, #6a96d2, #95b4e0);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(123, 166, 221, 0.3);
}

.delete-btn {
  background: linear-gradient(135deg, #e48a8a, #f2b6b6);
  color: white;
  box-shadow: 0 2px 6px rgba(228, 138, 138, 0.2);
}

.delete-btn:hover {
  background: linear-gradient(135deg, #db7979, #e9a0a0);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(228, 138, 138, 0.3);
}

@media (max-width: 768px) {
  .competences-container {
    padding: 20px;
  }
  
  .header-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .action-buttons {
    width: 100%;
    flex-direction: column;
    gap: 10px;
  }
  
  .action-buttons button {
    width: 100%;
  }
  
  .competences-list {
    grid-template-columns: 1fr;
  }
  
  .competence-card {
    padding: 20px 15px;
  }
}
</style>