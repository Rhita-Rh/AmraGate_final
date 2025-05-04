<template>
  <div class="edit-goal-container">
    <h2 class="form-title">Edit Goal</h2>

    <form v-if="editedGoal" @submit.prevent="updateGoal" class="goal-form">
      <div class="form-group">
        <label class="form-label">Objectif:</label>
        <input v-model="editedGoal.obj" required class="form-input" />
      </div>

      <div class="form-group">
        <label class="form-label">Status:</label>
        <select v-model="editedGoal.status" required class="form-select">
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Progression:</label>
        <input v-model="editedGoal.suivi" required class="form-input" />
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn">Update</button>
        <router-link to="/Dashboard">
          <button type="button" class="cancel-btn">Back to Dashboard</button>
        </router-link>
      </div>
    </form>

    <p v-else>Loading goal...</p>
  </div>
</template>

<script>
import { db, auth } from "../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default {
  name: "EditGoal",
  props: {
    index: Number, // comes from route param like /edit-goal/:index
  },
  data() {
    return {
      goals: [],
      editedGoal: null,
    };
  },
  created() {
    this.loadGoal();
  },
  methods: {
    async loadGoal() {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in.");
        this.$router.push("/login");
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          this.goals = Array.isArray(data.goals) ? data.goals : [];

          if (this.index >= 0 && this.index < this.goals.length) {
            this.editedGoal = { ...this.goals[this.index] };
          } else {
            alert("Invalid goal index.");
            this.$router.push("/Dashboard");
          }
        } else {
          alert("User data not found.");
        }
      } catch (error) {
        console.error("Error loading goal:", error);
        alert("Failed to load goal.");
      }
    },

    async updateGoal() {
      const user = auth.currentUser;
      if (!user) return;

      try {
        this.goals[this.index] = this.editedGoal;
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { goals: this.goals });

        alert("Goal updated successfully!");
        this.$router.push("/Dashboard");
      } catch (error) {
        console.error("Error updating goal:", error);
        alert("Failed to update goal.");
      }
    },
  },
};
</script>
<style scoped>
.edit-goal-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(148, 182, 229, 0.15);
  border: 1px solid #e0e8f5;
  font-family: 'Segoe UI', sans-serif;
  color: #333;
  min-height: 100vh;
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

.goal-form {
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

.form-input,
.form-select {
  padding: 0.85rem;
  border: 1px solid #d0d6e2;
  border-radius: 10px;
  font-size: 1rem;
  background-color: #f9fafd;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus {
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

p {
  margin-top: 20px;
  color: #666;
  font-size: 16px;
  text-align: center;
}

@media (max-width: 640px) {
  .edit-goal-container {
    padding: 1.5rem;
    margin: 1rem;
    border-radius: 12px;
  }

  .form-actions {
    flex-direction: column;
    gap: 0.8rem;
  }

  .submit-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>
