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
      today: new Date().toISOString().split('T')[0],  // Only date part (YYYY-MM-DD)
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
          date_debut: now.toISOString(),
          date_progr: now.toISOString(),
          start_date: now.toISOString(),
          elapsed: 'just now',
        };

        await updateDoc(userRef, {
          competences: arrayUnion(competence),
        });

        this.lastAdded = competence;
        this.startTime = now;
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
    }, 60000);
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
  background-color: #f0f4f8;
  padding: 2rem;
  font-family: 'Quicksand', sans-serif;
}

.form-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(148, 182, 229, 0.15);
  padding: 2rem;
  width: 100%;
  max-width: 600px;
}

h1 {
  color: #7ba6dd;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  color: #718096;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 2rem;
}

.competence-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  color: #4a5568;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

input,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d0d6e2;
  border-radius: 10px;
  background: #f9fafd;
  transition: all 0.3s ease;
  font-size: 1rem;
}

input:focus,
select:focus {
  outline: none;
  border-color: #7ba6dd;
  box-shadow: 0 0 0 2px rgba(123, 166, 221, 0.2);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  gap: 1rem;
}

.submit-btn,
.back {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-btn {
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: white;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
  transform: translateY(-2px);
}

.submit-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  transform: none;
}

.back {
  background: linear-gradient(135deg, #e48a8a, #f2b6b6);
  color: white;
}

.back:hover {
  background: linear-gradient(135deg, #db7979, #e9a0a0);
  transform: translateY(-2px);
}

.back-link {
  text-decoration: none;
  flex: 1;
}

.success-message {
  background-color: #f0fff4;
  color: #2f855a;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  font-size: 0.95rem;
  text-align: center;
}

.error-message {
  background-color: #fff5f5;
  color: #c53030;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  font-size: 0.95rem;
  text-align: center;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .form-card {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-btn,
  .back {
    width: 100%;
  }
}
</style>