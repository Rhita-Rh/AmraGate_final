<template>
  <div class="edit-goal">
    <button @click="showForm = !showForm">
      {{ showForm ? 'Cancel' : 'Edit Goal' }}
    </button>

    <div v-if="showForm">
      <h4>Edit Goal</h4>
      <form @submit.prevent="saveGoal">
        <label>Objectif:</label>
        <input type="text" v-model="editedGoal.obj" required />

        <label>Status:</label>
        <select v-model="editedGoal.status" required>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <label>Progression:</label>
        <input type="text" v-model="editedGoal.suivi" required />

        <button type="submit">Save</button>
      </form>
    </div>
  </div>
</template>

<script>
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";

export default {
  props: {
    userId: String,
    goal: Object,
    goalIndex: Number,
    goals: Array,
  },
  data() {
    return {
      editedGoal: { ...this.goal },
      showForm: false,
    };
  },
  methods: {
    async saveGoal() {
      try {
        const updatedGoals = [...this.goals];
        updatedGoals[this.goalIndex] = this.editedGoal;

        const docRef = doc(db, "users", this.userId);
        await updateDoc(docRef, { goals: updatedGoals });

        // Emit the updated goal to the parent component
        this.$emit("goalUpdated", this.editedGoal, this.goalIndex);

        this.showForm = false;
        alert("Goal updated successfully!");
      } catch (error) {
        console.error("Error updating goal:", error);
        alert("Failed to update goal.");
      }
    },
  },
};
</script>
