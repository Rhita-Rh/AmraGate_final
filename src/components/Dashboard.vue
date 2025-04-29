<template>
  <div class="user-profile">
    <h2>My Dashboard</h2>

    <div class="navigation-links">
      <router-link to="/my-projects">
        <button>My Projects</button>
      </router-link>
      <router-link to="/UpdateProfile">
        <button>Update Profile</button>
      </router-link>
      <router-link to="/AjouterComp">
        <button>Add Competence</button>
      </router-link>
    </div>
    <nbre_competences_mois />
    <projet_realis/>

    <div>
      <p> Name: {{ userData.name }} </p>
      <p> Email: {{ userData.email }} </p>
      <p> Bio: {{ userData.bio }} </p>
      
      <div v-if="userData.goals && userData.goals.length">
        <h3>Goals</h3>
        <div
          v-for="(goals, index) in userData.goals"
          :key="index"
          class="Goals-card"
        >
          <p> Goal: {{ goals.obj }}</p>
          <p> Status: {{ goals.status }}</p>
          <p> My progression: {{ goals.suivi }}</p>

          <button @click="toggleGoalEdit(index)">
            {{ goalEditVisible[index] ? "Cancel Edit" : "Edit Goal" }}
          </button>

        </div>
        <div v-if="!showAddGoalForm">
          <button @click="set_true">Add a New Goal</button>
        </div>
      </div>
      <div v-else>
        <p>No goals listed.</p>
        <button @click="set_true">Add a New Goal</button>
      </div>
      
      <!-- Add new goal form -->
      <div v-if="showAddGoalForm">
        <h3>Add a New Goal</h3>
        <form @submit.prevent="addGoal">
          <label>Objectif:</label>
          <input type="text" v-model="newGoal.obj" placeholder="Goal Objectif" required>
          <label>Status:</label>
          <select v-model="newGoal.status" required>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <label>My progression:</label>
          <input type="text" v-model="newGoal.suivi" placeholder="My Progression" required>
          <button type="submit">Save Goal</button>
          <button @click="set_false">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { db, auth } from "../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Edit_goal from "../components/Edit_goal.vue";
import Edit_comp from "../components/Edit_comp.vue";
import nbre_competences_mois from "./nbre_competences_mois.vue";
import projet_realis from "./projet_realis.vue";

export default {
  components: {
    Edit_goal,
    Edit_comp,
    nbre_competences_mois,
    projet_realis
  },
  data() {
    return {
      currentUserId: auth.currentUser?.uid || "",
      userData: {
        name: "",
        email: "",
        bio: "",
        goals: [],
        competences: []
      },
      showAddGoalForm: false,
      newGoal: {
        obj: "",
        status: "",
        suivi: ""
      },
      goalEditVisible: [] // Array to control visibility of goal editing
    };
  },
  created() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          this.userData = data;
          this.competences = data.competences || [];
          // Initialize all goals as not being edited
          this.goalEditVisible = (data.goals || []).map(() => false);
        }
      }
    },
    toggleGoalEdit(index) {
      // Toggle edit mode for the clicked goal
      this.goalEditVisible = this.goalEditVisible.map((item, idx) => idx === index ? !item : item);
    },
    set_true() {
      this.showAddGoalForm = true;
    },
    set_false() {
      this.showAddGoalForm = false;
    },
    async updateProfile() {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, this.userData);
        alert("Updated Profile");
        this.$router.push("/Home");
      }
    },
    async deleteCompetence(index) {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const competences = this.userData.competences || [];
        competences.splice(index, 1);
        await updateDoc(docRef, { competences });
        this.userData.competences = competences;
      }
    },
    async addGoal() {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const goals = this.userData.goals || [];

        // Push new goal
        goals.push({
          obj: this.newGoal.obj,
          status: this.newGoal.status,
          suivi: this.newGoal.suivi
        });
        await updateDoc(docRef, { goals });

        // Update local state
        this.userData.goals = goals;

        // Reset form
        this.newGoal = { obj: "", status: "", suivi: "" };
        this.showAddGoalForm = false;

        alert("New goal added!");
      }
    },
    async deletegoal(index) {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const goals = this.userData.goals || [];
        goals.splice(index, 1);
        await updateDoc(docRef, { goals });
        this.userData.goals = goals;
      }
    },
    updateGoalLocally(updatedGoal, goalIndex) {
      this.userData.goals[goalIndex] = updatedGoal;  // Update the local goal data
    }
  }
};
</script>

<style scoped>
/* Background Styling */
.user-profile {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background: radial-gradient(circle at top left, #d0f8ce, #fce4ec);
  font-family: 'Quicksand', sans-serif;
  overflow: hidden;
  animation: floatBg 10s infinite alternate;
}

@keyframes floatBg {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

/* Card Container */
.page-container {
  background: linear-gradient(145deg, #ffffff, #f8fff4);
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(120, 190, 90, 0.2);
  padding: 40px 30px;
  max-width: 420px;
  width: 90%;
  transition: transform 0.4s ease;
}

.page-container:hover {
  transform: translateY(-5px);
}

/* Title */
.title h1 {
  text-align: center;
  color: #43a047;
  font-size: 2.2em;
  letter-spacing: 1px;
  margin-bottom: 25px;
}

/* Navigation Buttons */
.navigation-links {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 30px;
}

button {
  padding: 12px 24px;
  background: linear-gradient(135deg, #66bb6a, #a5d6a7);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 187, 106, 0.4);
  transition: all 0.3s ease;
}

button:hover {
  background: linear-gradient(135deg, #388e3c, #81c784);
  transform: translateY(-2px);
}

/* User Data Section */
.user-profile p {
  font-size: 18px;
  color: #558b2f;
  margin: 10px 0;
}

/* Goals Section */
.Goals-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(102, 187, 106, 0.2);
  padding: 15px;
  margin-bottom: 15px;
}

.Goals-card p {
  font-size: 16px;
  color: #616161;
  margin: 8px 0;
}

button[type="submit"],
button[type="button"] {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #66bb6a, #a5d6a7);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(102, 187, 106, 0.4);
  transition: all 0.3s ease;
}

button[type="submit"]:hover,
button[type="button"]:hover {
  background: linear-gradient(135deg, #388e3c, #81c784);
  transform: translateY(-2px);
}

/* Add New Goal Form */
form {
  background: linear-gradient(145deg, #ffffff, #f8fff4);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(120, 190, 90, 0.2);
  max-width: 420px;
  margin: 0 auto;
}

form label {
  font-size: 16px;
  font-weight: 600;
  color: #558b2f;
  display: block;
  margin-bottom: 10px;
}

form input,
form select {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1.5px solid #aed581;
  background-color: #f9fff8;
  font-size: 15px;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

form input:focus,
form select:focus {
  border-color: #66bb6a;
  box-shadow: 0 0 0 3px rgba(102, 187, 106, 0.2);
  outline: none;
}

/* Add Competence & Project Container */
.page-container {
  background: linear-gradient(145deg, #ffffff, #f8fff4);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(120, 190, 90, 0.2);
}

/* Cancel Button */
button[type="button"] {
  background-color: #f44336;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
  transition: all 0.3s ease;
}

button[type="button"]:hover {
  background-color: #c62828;
  transform: translateY(-2px);
}
</style>
