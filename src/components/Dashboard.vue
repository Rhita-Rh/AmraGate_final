<template>
  <div class="user-profile">
    <div class="back-button-container">
      <router-link to="/Home" class="back-button">
        <span class="back-icon">←</span>
        <span class="back-text">Back to Home</span>
      </router-link>
    </div>
    <div class="profile-picture-section">
          <div class="avatar-container">
            <img 
              v-if="userData.photoURL" 
              :src="userData.photoURL" 
              alt="Profile Picture"
              class="profile-avatar"
            >
            <div v-else class="default-avatar">
              {{ userInitials }}
            </div>
          </div>
          <input 
            type="file" 
            id="avatar-upload" 
            accept="image/*" 
            @change="handleFileUpload"
            style="display: none"
          >
          <button 
            class="upload-btn"
            @click="triggerFileInput"
          >
            {{ userData.photoURL ? 'Change Photo' : 'Upload Photo' }}
          </button>
        </div>
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
          <div class="info-item">
            <span class="info-label">Phone:</span>
            <span class="info-value">{{ userData.phone }}</span>
          </div>
        </div>

        <!-- Starred Projects Section -->
        <div class="starred-projects-section">
          <h3>Starred Projects</h3>
          <div v-if="starredProjects.length > 0">
            <div
              v-for="project in starredProjects"
              :key="project.id"
              class="project-card"
            >
              <div class="info-item">
                <span class="info-label">Project:</span>
                <span class="info-value">{{ project.title }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Description:</span>
                <span class="info-value">{{ project.description }}</span>
              </div>
              <button @click="unstarProject(project.id)" class="unstar-btn">Unstar</button>
              <router-link :to="`/project/${project.id}`" class="details-btn">View Details</router-link>
            </div>
          </div>
          <div v-else>
            <p>No starred projects.</p>
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
              <button @click="deletegoal(index)" class="cancel-btn">Delete</button>
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
          <div v-if="showAddGoalForm" class="add-goal-form" ref="down">
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
                <button @click="set_false" type="button" class="delete-btn">Cancel</button>
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
import { nextTick } from "vue";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, getDocs, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
        phone: "",
        goals: [],
        competences: [],
      },
      starredProjects: [],
      showAddGoalForm: false,
      newGoal: {
        obj: "",
        status: "",
        suivi: ""
      },
      goalEditVisible: []
    };
  },
  computed: {
    userInitials() {
      if (!this.userData.name) return '?';
      const names = this.userData.name.split(' ');
      return names.map(name => name[0]).join('').toUpperCase();
    }
  },
  created() {
    this.fetchUserData();
    this.fetchStarredProjects();
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
    async fetchStarredProjects() {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        try {
          // Get starred projects for current user
          const starredQuery = collection(db, 'starred');
          const starredSnapshot = await getDocs(starredQuery);
          const starredProjectIds = starredSnapshot.docs
            .filter(doc => doc.data().userId === user.uid)
            .map(doc => doc.data().projectId);

          // Get project details for each starred project
          const projectsCollection = collection(db, 'projects');
          const projectsSnapshot = await getDocs(projectsCollection);
          this.starredProjects = projectsSnapshot.docs
            .filter(doc => starredProjectIds.includes(doc.id))
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
        } catch (error) {
          console.error('Error fetching starred projects:', error);
        }
      }
    },
    async unstarProject(projectId) {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        try {
          const starredRef = collection(db, 'starred');
          const starDoc = doc(starredRef, `${user.uid}_${projectId}`);
          await deleteDoc(starDoc);
          
          // Update local state
          this.starredProjects = this.starredProjects.filter(project => project.id !== projectId);
        } catch (error) {
          console.error('Error unstarring project:', error);
        }
      }
    },
    set_true() {
      this.showAddGoalForm = true;
      nextTick(() => {
        this.$refs.down?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
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
      if(confirm("Do you want to delete this goal?")){
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const goals = this.userData.goals || [];
          goals.splice(index, 1);
          await updateDoc(docRef, { goals });
          this.userData.goals = goals;
        }
          alert("Goal deleted!");
      }
      
    },
    updateGoalLocally(updatedGoal, goalIndex) {
      this.userData.goals[goalIndex] = updatedGoal;
    },
    triggerFileInput() {
      document.getElementById('avatar-upload').click();
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      try {
        const user = auth.currentUser;
        const storage = getStorage();
        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
        
        // Upload the file
        await uploadBytes(storageRef, file);
        
        // Get download URL
        const photoURL = await getDownloadURL(storageRef);
        
        // Update user profile in Firestore
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, { photoURL });
        
        // Update local data
        this.userData.photoURL = photoURL;
        
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("Error uploading profile picture");
      }
    },
    }
  
};
</script>

<style scoped>
.profile-picture-section {
  margin-top:20px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.avatar-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-avatar {
  font-size: 32px;
  font-weight: bold;
  color: #555;
}

.upload-btn {
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background-color: #0b7dda;
}

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
.back-button-container {
  margin-bottom: 20px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #f8fafc;
  color: #2d3748;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.back-button:hover {
  background-color: #edf2f7;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.back-icon {
  font-size: 18px;
  font-weight: bold;
}

.back-text {
  margin-left: 4px;
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
  height: 40px;
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  margin: 10px;
}

.edit-btn:hover {
  background-color: #0b7dda;
  transform: translateY(-1px);
}
.delete-btn {
  background-color: #f44336;
  height: 40px;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}
.delete-btn:hover {
  background-color: #952c25;
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

.starred-projects-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.project-card {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
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

.unstar-btn {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  margin-top: 8px;
}

.unstar-btn:hover {
  background-color: #d32f2f;
  transform: translateY(-1px);
}

.details-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  margin-top: 8px;
  text-decoration: none;
  margin-left: 15px;
}

.details-btn:hover {
  background-color: #388e3c;
  transform: translateY(-1px);
}
</style>