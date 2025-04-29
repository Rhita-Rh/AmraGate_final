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
            <p> goal: {{ goals.obj }}</p>
            <p> statu: {{ goals.status }}</p>
            <p> my progression: {{ goals.suivi }}</p>
            <Edit_goal 
              :userId="currentUserId"
              :goal="user.goals[index]" 
              :goalIndex="index"
            />
            <button @click="deletegoal(index)">Delete</button>
          </div>
          <div v-if="!showAddGoalForm">
            <button @click="set_true">Add a New Goal</button>
          </div>
        </div>
        
        <div v-else>
          <p>No goals listed.</p>
          <button @click="set_true">Add a New Goal</button>
        </div>

        <div v-if="showAddGoalForm">
          <h3>Add a New Goal</h3>
          <form @submit.prevent="addGoal">
            <label>Objectif:</label>
            <input type="text" v-model="newGoal.obj" placeholder="Goal Objectif" required>
            <label>Statu:</label>
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
      

  
        <div v-if="userData.competences && userData.competences.length">
          <h3>Competences</h3>
          <div
            v-for="(competence, index) in userData.competences"
            :key="index"
            class="competence-card"
          >
            <p> Name: {{ competence.name }}</p>
            <p> Level: {{ competence.level }}</p>
            <p> Date of acquisition: {{ competence.date_acqui }}</p>
            <p> Date of progression: {{ competence.date_progr }}</p>
            <Edit_comp 
              :userId="currentUserId" 
              :competence="userData.competences[index]" 
              :competenceIndex="index"
            />
            <button @click="deleteCompetence(index)">Delete</button>
          </div>
        </div>
        <div v-else>
          <p>No competences listed.</p>
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
        userData: {
          name: "",
          email: "",
          bio: "",
          goals: [],
          competences: []
        },
        showAddGoalForm:false,
        newGoal: {
          obj: "",
          status: "",
          suivi: ""
        }
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
          }
        }
      },
      set_true(){
        this.showAddGoalForm = true;
      },
      set_false(){
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
      }
      
    }
  };
  </script>
  
  