<template>
    <div>
      <h3>Edit Goal</h3>
      <form @submit.prevent="saveGoal">
        <div>
          <label>Objectif:</label>
          <input type="text" v-model="obj" />
        </div>
  
        <div>
          <label>Status:</label>
          <input type="text" v-model="status" />
        </div>
  
        <div>
          <label>Suivi:</label>
          <input type="text" v-model="suivi" />
        </div>
  
        <button type="submit">Save Goal</button>
      </form>
    </div>
  </template>
  
  <script>
  import { doc, getDoc, updateDoc } from "firebase/firestore";
  import { db } from "../firebase-config"; // adjust path if needed
  
  export default {
    name: "Edit_goal",
    props: {
      userId: {
        type: String,
        required: true
      },
      goal: {
        type: Object,
        required: true
      },
      goalIndex: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        obj: "",
        status: "",
        suivi: ""
      };
    },
    mounted() {
      if (this.goal) {
        this.obj = this.goal.obj;
        this.status = this.goal.status;
        this.suivi = this.goal.suivi;
      }
    },
    methods: {
      async saveGoal() {
        try {
          const userRef = doc(db, "users", this.userId);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            throw new Error("User not found");
          }
  
          const userData = userSnap.data();
          let goals = userData.goals || [];
  
          // Update the specific goal
          goals[this.goalIndex] = {
            obj: this.obj,
            status: this.status,
            suivi: this.suivi
          };
  
          // Update in Firestore
          await updateDoc(userRef, {
            goals: goals
          });
  
          alert("Goal updated successfully!");
        } catch (error) {
          alert("Error updating goal:", error);
        }
      }
    }
  };
  </script>
  
