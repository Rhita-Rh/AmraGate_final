<template>
  <div class="edit-competence-container">
    <form v-if="loaded" @submit.prevent="saveCompetence" class="competence-form">
      <h2 class="form-title">Edit Competence</h2>

      <div class="form-group">
        <label class="form-label">Name:</label>
        <input v-model="name" type="text" class="form-input" required placeholder="Enter competence name" />
      </div>

      <div class="form-group">
        <label class="form-label">Level:</label>
        <select v-model="level" class="form-select" required>
          <option value="" disabled>Select a level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Acquisition Date:</label>
        <input v-model="date_acqui" type="date" class="form-input" />
      </div>

      <div class="form-group">
        <label class="form-label">Progress Date:</label>
        <input v-model="date_progr" type="date" class="form-input" />
      </div>

      <div class="form-group">
        <label class="form-label">Start Date:</label>
        <input v-model="date_debut" type="date" class="form-input" required />
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn">Save Changes</button>
        <button type="button" class="cancel-btn" @click="$router.go(-1)">Cancel</button>
      </div>
    </form>

    <p v-else>Loading competence...</p>
  </div>
</template>

<script>
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase-config";

export default {
  name: "Edit_comp",
  props: {
    userId: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      name: "",
      level: "",
      date_acqui: "",
      date_progr: "",
      date_debut: "",
      loaded: false,
      competences: []
    };
  },
  created() {
    this.loadCompetence();
  },
  methods: {
    async loadCompetence() {
      try {
        const userRef = doc(db, "users", this.userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) throw new Error("User not found");

        const data = userSnap.data();
        this.competences = Array.isArray(data.competences) ? data.competences : [];

        const comp = this.competences[this.index];
        if (!comp) throw new Error("Invalid competence index");

        this.name = comp.name || "";
        this.level = comp.level || "";
        this.date_acqui = comp.date_acqui || "";
        this.date_progr = comp.date_progr || "";
        this.date_debut = comp.date_debut || "";
        this.loaded = true;
      } catch (error) {
        console.error("Error loading competence:", error);
        alert("Failed to load competence: " + error.message);
        this.$router.push("/Dashboard");
      }
    },

    async saveCompetence() {
      if (!this.validateForm()) return;

      try {
        const userRef = doc(db, "users", this.userId);

        this.competences[this.index] = {
          name: this.name,
          level: this.level,
          date_acqui: this.date_acqui,
          date_progr: this.date_progr,
          date_debut: this.date_debut
        };

        await updateDoc(userRef, { competences: this.competences });

        alert("Competence updated successfully!");
        this.$router.go(-1);
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
};
</script>
<style scoped>
.edit-competence-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(148, 182, 229, 0.15);
  border: 1px solid #e0e8f5;
}

.form-title {
  text-align: center;
  color: #4d5a6a;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 12px;
}

.competence-form {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.form-label {
  font-weight: 600;
  color: #6b7c93;
  font-size: 1rem;
}

.form-input, .form-select {
  padding: 0.85rem;
  border: 1px solid #d0d6e2;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f9fafd;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #7ba6dd;
  box-shadow: 0 0 0 3px rgba(123, 166, 221, 0.2);
}

.form-actions {
  display: flex;
  gap: 1.2rem;
  margin-top: 1.5rem;
}

.submit-btn {
  background: linear-gradient(135deg, #94e594, #9eeec2);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.85rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(148, 182, 229, 0.2);
}

.submit-btn:hover {
  background: linear-gradient(135deg, #7bdd8a, #9eeec2);
  transform: translateY(-2px);
}

.cancel-btn {
  background: linear-gradient(135deg, #f5f5f5, #f0f0f0);
  color: #6b7c93;
  border: 1px solid #d0d6e2;
  border-radius: 10px;
  padding: 0.85rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: linear-gradient(135deg, #e0e0e0, #f0f0f0);
  transform: translateY(-2px);
  color: #4d5a6a;
}

@media (max-width: 640px) {
  .edit-competence-container {
    padding: 1.5rem;
    margin: 1rem;
    border-radius: 12px;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 0.8rem;
  }

  .submit-btn, .cancel-btn {
    width: 100%;
  }
}
</style>