<template>
  <div class="user-profile">
    <div class="profile-container">
      <div class="profile-section">
        <h2>My Dashboard</h2>

        <div class="navigation-links">
          <router-link to="/my-projects">
            <button>My Projects</button>
          </router-link>
          <router-link to="/UpdateProfile">
            <button>Update Profile</button>
          </router-link>
          <router-link to="/mycomp">
            <button>My competences</button> 
          </router-link>
          <router-link to="/followers">
            <button>My followers</button> 
          </router-link>
          <router-link to="/following">
            <button>Following</button> 
          </router-link>
        </div>

        <div class="user-info">
          <h3>Personal Information</h3>
          <div class="info-item">
            <span class="info-label">Name:</span>
            <span class="info-value">{{ userData.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Email:</span>
            <span class="info-value">{{ userData.email }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Bio:</span>
            <span class="info-value">{{ userData.bio }}</span>
          </div>
        </div>

        <div class="goals-section">
          <h3>My Goals</h3>
          <div v-if="userData.goals && userData.goals.length">
            <div
              v-for="(goal, index) in userData.goals"
              :key="index"
              class="goal-card"
            >
              <div class="info-item">
                <span class="info-label">Goal:</span>
                <span class="info-value">{{ goal.obj }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Status:</span>
                <span class="info-value">{{ goal.status }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Progress:</span>
                <span class="info-value">{{ goal.suivi }}</span>
              </div>

              <router-link :to="{ name: 'Edit_goal', params: { index } }">
                <button class="edit-btn">Edit</button>
              </router-link>
            </div>
            <div v-if="!showAddGoalForm">
              <button @click="set_true" class="add-btn">Add a New Goal</button>
            </div>
          </div>
          <div v-else>
            <p>No goals listed.</p>
            <button @click="set_true" class="add-btn">Add a New Goal</button>
          </div>
          
          <!-- Add new goal form -->
          <div v-if="showAddGoalForm" class="add-goal-form">
            <h3>Add a New Goal</h3>
            <form @submit.prevent="addGoal">
              <div class="form-group">
                <label>Objective:</label>
                <input type="text" v-model="newGoal.obj" placeholder="Goal objective" required>
              </div>
              <div class="form-group">
                <label>Status:</label>
                <select v-model="newGoal.status" required>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div class="form-group">
                <label>Progress:</label>
                <input type="text" v-model="newGoal.suivi" placeholder="My progression" required>
              </div>
              <div class="form-actions">
                <button type="submit" class="save-btn">Save Goal</button>
                <button @click="set_false" type="button" class="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-container">
          <nbre_competences_mois />
        </div>
        <div class="chart-container">
          <projet_realis/>
        </div>
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
  props: {
    goals: Array,
    userId: String,
  },
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
      goalEditVisible: []
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
          this.goalEditVisible = (data.goals || []).map(() => false);
        }
      }
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

        goals.push({
          obj: this.newGoal.obj,
          status: this.newGoal.status,
          suivi: this.newGoal.suivi
        });
        await updateDoc(docRef, { goals });

        this.userData.goals = goals;
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
      this.userData.goals[goalIndex] = updatedGoal;
    }
  }
};
</script>

<style scoped>
.user-profile {
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
  color: #333;
  padding: 20px;
}

.profile-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  gap: 30px;
}

.profile-section {
  flex: 1;
  max-width: 700px;
}

.charts-section {
  width: 450px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.chart-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 28px;
}

h3 {
  color: #2c3e50;
  margin: 25px 0 15px;
  font-size: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.navigation-links {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.navigation-links button {
  background-color: #4caf50;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  padding: 10px 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.navigation-links button:hover {
  background-color: #388e3c;
  transform: translateY(-2px);
}

.user-info {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.info-item {
  display: flex;
  margin-bottom: 15px;
  align-items: center;
}

.info-label {
  font-weight: 600;
  width: 100px;
  color: #555;
}

.info-value {
  flex: 1;
  padding: 8px 12px;
  background: #f9f9f9;
  border-radius: 6px;
}

.goal-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
}

.edit-btn {
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.edit-btn:hover {
  background-color: #0b7dda;
  transform: translateY(-1px);
}

.add-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;
}

.add-btn:hover {
  background-color: #388e3c;
  transform: translateY(-2px);
}

.add-goal-form {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.save-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  cursor: pointer;
  flex: 1;
  transition: all 0.3s ease;
}

.save-btn:hover {
  background-color: #388e3c;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  cursor: pointer;
  flex: 1;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #d32f2f;
}

@media (max-width: 992px) {
  .profile-container {
    flex-direction: column;
  }
  
  .charts-section {
    width: 100%;
    margin-top: 30px;
  }
}
</style>