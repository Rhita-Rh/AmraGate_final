<template>
  <div class="edit-goal-page">
    <h2>Edit Goal</h2>

    <form v-if="editedGoal" @submit.prevent="updateGoal">
      <label>Objectif:</label>
      <input v-model="editedGoal.obj" required />

      <label>Status:</label>
      <select v-model="editedGoal.status" required>
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <label>Progression:</label>
      <input v-model="editedGoal.suivi" required />

      <div style="display:flex; justify-content:space-between; margin-top:20px;">
        <button type="submit">Update</button>
        <router-link to="/Dashboard"><button type="button">Back to Dashboard</button></router-link>
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
.edit-goal-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
  color: #333;
}

h2 {
  color: #2f855a;
  margin-bottom: 30px;
}

/* Form layout */
form {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 30px;
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

input,
select {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #fff;
  font-size: 14px;
  box-sizing: border-box;
}

input:focus,
select:focus {
  border-color: #4CAF50;
  outline: none;
}

/* Button styles */
button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Submit button */
button[type="submit"] {
  background-color: #4CAF50;
}

button[type="submit"]:hover {
  background-color: #388E3C;
}

/* Back button */
button[type="button"] {
  background-color: #f44336;
}

button[type="button"]:hover {
  background-color: #c62828;
}

/* Form button container */
form > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  gap: 15px;
}

/* Loading message */
p {
  margin-top: 20px;
  color: #666;
  font-size: 16px;
}
</style>
