<template> 
  <div class="add-competence-container">
    <div class="form-card">
      <h1>Add New Competence</h1>
      <p class="subtitle">Track your skills and progress</p>

      <form @submit.prevent="ajouterCompetence" class="competence-form">
        <div class="form-group">
          <label>Skill Name</label>
          <input 
            type="text" 
            v-model="name" 
            required 
            placeholder="e.g. JavaScript, Public Speaking"
          />
        </div>

        <div class="form-group">
          <label>Proficiency Level</label>
          <select v-model="level" required>
            <option value="" disabled>Select your level</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        <div class="form-group">
          <label>Date Acquired</label>
          <input 
            type="date" 
            v-model="date_acqui" 
            required 
            :max="today"
          />
        </div>

        <div style="display:flex; justify-content:space-between; margin-top:20px;">
          <div>
            <button type="submit" class="submit-btn">
              <span v-if="!isLoading">Add Skill</span>
              <span v-else class="spinner"></span>
            </button>
          </div>
          
          <div>
            <router-link to="/Dashboard" class="back-link">
              <button class="back">Back to Dashboard</button>
            </router-link>
          </div>
        </div>
      </form>

      <div v-if="lastAdded" class="success-message">
        ✓ Added <strong>{{ lastAdded.name }}</strong> ({{ elapsed }})
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase-config';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

export default {
  name: 'AjouterComp',
  data() {
    return {
      name: '',
      level: '',
      date_acqui: '',
      today: new Date().toISOString().split('T')[0],
      lastAdded: null,
      isLoading: false,
      error: null,
      elapsed: '',
      timer: null,
      startTime: null,
    };
  },
  methods: {
    async ajouterCompetence() {
      if (!this.validateForm()) return;

      this.isLoading = true;
      this.error = null;

      const now = new Date();

      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) throw new Error('User not authenticated');

        const userRef = doc(db, 'users', user.uid);

        const competence = {
          name: this.name.trim(),
          level: this.level,
          date_acqui: this.date_acqui,
          date_debut: now.toISOString().split('T')[0],
          date_progr: now.toISOString(),
        };

        await updateDoc(userRef, {
          competences: arrayUnion(competence),
        });

        this.lastAdded = competence;
        this.startTime = new Date(competence.date_progr);
        this.elapsed = this.getTimeSince(this.startTime);
        this.resetForm();
      } catch (error) {
        console.error("Error adding competence:", error);
        this.error = "Failed to add skill. Please try again.";
      } finally {
        this.isLoading = false;
      }
    },

    validateForm() {
      if (!this.name.trim()) {
        this.error = "Please enter a skill name";
        return false;
      }
      if (!this.level) {
        this.error = "Please select a proficiency level";
        return false;
      }
      if (!this.date_acqui) {
        this.error = "Please select an acquisition date";
        return false;
      }
      return true;
    },

    resetForm() {
      this.name = '';
      this.level = '';
      this.date_acqui = '';
    },

    getTimeSince(startTime) {
      const now = new Date();
      const then = new Date(startTime);
      const diffMs = now - then;

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      const parts = [];
      if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
      if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
      if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);

      if (parts.length === 0) return 'just now';
      return parts.join(', ') + ' ago';
    },
  },
  mounted() {
    this.timer = setInterval(() => {
      if (this.startTime) {
        this.elapsed = this.getTimeSince(this.startTime);
      }
    }, 60000); // Update every 60 seconds
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
};
</script>
<style scoped>
.add-competence-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.form-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 32px;
  width: 100%;
  max-width: 450px;
}

h1 {
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
}

.subtitle {
  color: #718096;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 24px;
}

.competence-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 500;
}

input, select {
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

input:focus, select:focus {
  outline: none;
  border-color: #4CAF50;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 8px;
  transition: background-color 0.2s;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-btn:hover {
  background-color: #4CAF50;
}
.back{
  background-color: #c62828;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 8px;
  transition: background-color 0.2s;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.back:hover {
  background-color: #c62828;
}
.back-link {
  color: #718096;
  text-align: center;
  font-size: 0.9rem;
  text-decoration: none;
  margin-top: 8px;
  transition: color 0.2s;
}

.back-link:hover {
  color: #4a5568;
  text-decoration: underline;
}

.success-message {
  background-color: #f0fff4;
  color: #2f855a;
  padding: 10px 12px;
  border-radius: 6px;
  margin-top: 16px;
  font-size: 0.9rem;
  text-align: center;
}

.error-message {
  background-color: #fff5f5;
  color: #c53030;
  padding: 10px 12px;
  border-radius: 6px;
  margin-top: 16px;
  font-size: 0.9rem;
  text-align: center;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .form-card {
    padding: 24px;
  }
}
</style>