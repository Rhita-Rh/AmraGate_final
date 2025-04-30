<template>
  <div class="edit-competence-container">
    <form @submit.prevent="saveCompetence" class="competence-form">
      <h2 class="form-title">Edit Competence</h2>
      
      <div class="form-group">
        <label class="form-label">Name:</label>
        <input 
          type="text" 
          v-model="name" 
          class="form-input"
          required
          placeholder="Enter competence name"
        >
      </div>

      <div class="form-group">
        <label class="form-label">Level:</label>
        <select 
          v-model="level" 
          class="form-select"
          required
        >
          <option value="" disabled>Select a level</option>
          <option value="Débutant">Débutant</option>
          <option value="Intermédiaire">Intermédiaire</option>
          <option value="Avancé">Avancé</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Acquisition Date:</label>
        <input 
          type="date" 
          v-model="date_acqui" 
          class="form-input"
        >
      </div>

      <div class="form-group">
        <label class="form-label">Progress Date:</label>
        <input 
          type="date" 
          v-model="date_progr" 
          class="form-input"
        >
      </div>

      <div class="form-group">
        <label class="form-label">Start Date:</label>
        <input 
          type="date" 
          v-model="date_debut" 
          class="form-input"
          required
        >
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn">Save Changes</button>
        <button 
          type="button" 
          class="cancel-btn"
          @click="$router.go(-1)"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";

export default {
  name: 'Edit_comp',
  props: {
    userId: {
      type: String,
      required: true
    },
    competenceIndex: {
      type: Number,
      required: true
    },
    competence: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      name: "",
      level: "",
      date_acqui: "",
      date_progr: "",
      date_debut: ""
    }
  },
  mounted() {
    if (this.competence) {
      this.name = this.competence.name || "";
      this.level = this.competence.level || "";
      this.date_acqui = this.competence.date_acqui || "";
      this.date_progr = this.competence.date_progr || "";
      this.date_debut = this.competence.date_debut || "";
    }
  },
  methods: {
    async saveCompetence() {
      if (!this.validateForm()) return;
      
      try {
        const userRef = doc(db, "users", this.userId);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          throw new Error("User not found");
        }

        const userData = userSnap.data();
        const competences = [...(userData.competences || [])];

        competences[this.competenceIndex] = {
          name: this.name,
          level: this.level,
          date_acqui: this.date_acqui,
          date_progr: this.date_progr,
          date_debut: this.date_debut
        };

        await updateDoc(userRef, { competences });
        this.$emit('competence-updated');
        alert("Competence updated successfully!");
        this.$router.go(-1); // Go back to previous page
      } catch (error) {
        console.error("Update error:", error);
        alert("Failed to update competence: " + error.message);
      }
    },
    validateForm() {
      if (!this.name.trim()) {
        alert("Please enter a competence name");
        return false;
      }
      if (!this.level) {
        alert("Please select a level");
        return false;
      }
      if (!this.date_debut) {
        alert("Please select a start date");
        return false;
      }
      return true;
    }
  }
}
</script>

<style scoped>
.edit-competence-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.competence-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: #555;
  font-size: 0.95rem;
}

.form-input, .form-select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.submit-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  flex: 1;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #388e3c;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  flex: 1;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

@media (max-width: 640px) {
  .edit-competence-container {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>